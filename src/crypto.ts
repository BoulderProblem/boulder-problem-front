// src/crypto.js
import sodium from 'libsodium-wrappers-sumo';

export async function generateKeys() {
  await sodium.ready;
  const kp = sodium.crypto_box_keypair();
  return {
    pub: sodium.to_base64(kp.publicKey),
    priv: sodium.to_base64(kp.privateKey),
  };
}

export async function generateKeyPairBase64() {
  await sodium.ready;
  const kp = sodium.crypto_box_keypair(); // Curve25519 pair (publicKey, privateKey)
  return {
    pub: sodium.to_base64(kp.publicKey),
    priv: sodium.to_base64(kp.privateKey),
  };
}

// Chiffre une clé privée avec mot de passe
export async function encryptPrivateKey(privBase64: string, password: string) {
  await sodium.ready;
  const priv = sodium.from_base64(privBase64);
  const salt = sodium.randombytes_buf(16);

  const key = sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = sodium.crypto_secretbox_easy(priv, nonce, key);

  return {
    ciphertext: sodium.to_base64(ciphertext),
    nonce: sodium.to_base64(nonce),
    salt: sodium.to_base64(salt),
  };
}

// Déchiffre la clé privée
export async function decryptPrivateKey(encrypted: any, password: string) {
  await sodium.ready;
  const salt = sodium.from_base64(encrypted.salt);
  const nonce = sodium.from_base64(encrypted.nonce);
  const ciphertext = sodium.from_base64(encrypted.ciphertext);

  const key = sodium.crypto_pwhash(
    32,
    password,
    salt,
    sodium.crypto_pwhash_OPSLIMIT_MODERATE,
    sodium.crypto_pwhash_MEMLIMIT_MODERATE,
    sodium.crypto_pwhash_ALG_DEFAULT
  );

  const priv = sodium.crypto_secretbox_open_easy(ciphertext, nonce, key);
  return sodium.to_base64(priv);
}

const SALT = 'chat-v1'; // optional context for HKDF/generichash

// Encrypt (sender can later re-derive key to decrypt if he keeps recipientPub)
export async function encryptForRecipient(
  message: string,
  senderPrivB64: string,
  recipientPubB64: string
) {
  await sodium.ready;

  const senderPriv = sodium.from_base64(senderPrivB64); // 32 bytes
  const recipientPub = sodium.from_base64(recipientPubB64); // 32 bytes

  // derive shared secret (ECDH)
  const shared = sodium.crypto_scalarmult(senderPriv, recipientPub);
  const key = sodium.crypto_generichash(32, shared);

  const nonce = sodium.randombytes_buf(
    sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES
  );
  const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
    sodium.from_string(message),
    null,
    null,
    nonce,
    key
  );

  const senderPub = sodium.crypto_scalarmult_base(senderPriv);

  return {
    ciphertext: sodium.to_base64(ciphertext),
    nonce: sodium.to_base64(nonce),
    sender_pub: sodium.to_base64(senderPub),
    recipient_pub: recipientPubB64, // déjà base64
    version: '1',
  };
}

// Decrypt: works for **le destinataire** ou **l'expéditeur** (si le message contient sender_pub + recipient_pub)
export async function decryptMessageForParticipant(
  msgObj: any,
  myPrivB64: any
) {
  await sodium.ready;

  const ciphertext = sodium.from_base64(msgObj.ciphertext);
  const nonce = sodium.from_base64(msgObj.nonce);
  const myPriv = sodium.from_base64(myPrivB64);

  const myPub = sodium.crypto_scalarmult_base(myPriv);
  const myPubB64 = sodium.to_base64(myPub);

  let otherPub;
  if (myPubB64 === msgObj.senderPub) {
    otherPub = sodium.from_base64(msgObj.recipientPub);
  } else if (myPubB64 === msgObj.recipientPub) {
    otherPub = sodium.from_base64(msgObj.senderPub);
  } else {
    throw new Error(
      "Cette clé privée n'appartient ni à l'expéditeur ni au destinataire"
    );
  }

  const shared = sodium.crypto_scalarmult(myPriv, otherPub);
  const key = sodium.crypto_generichash(32, shared);

  const plaintext = sodium.crypto_aead_xchacha20poly1305_ietf_decrypt(
    null,
    ciphertext,
    null,
    nonce,
    key
  );

  return sodium.to_string(plaintext);
}
