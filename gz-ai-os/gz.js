/* GZ AI OS — client-side decryption.
   Pages are stored as AES-256-GCM ciphertext; the key is derived from the
   password with PBKDF2-SHA256. Without the password the server holds nothing
   readable. */
window.GZ = (function () {
  var td = new TextDecoder();

  function b64(s) {
    var bin = atob(s), out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  async function decrypt(payload, password) {
    var baseKey = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey']);
    var key = await crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: b64(payload.salt), iterations: payload.iter, hash: 'SHA-256' },
      baseKey, { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
    var plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: b64(payload.iv) }, key, b64(payload.ct));
    return td.decode(plain);
  }

  async function load(url, password) {
    var res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('payload missing');
    return decrypt(await res.json(), password);
  }

  return { load: load, decrypt: decrypt };
})();
