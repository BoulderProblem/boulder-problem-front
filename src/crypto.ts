// src/crypto.js
import sodium from 'libsodium-wrappers-sumo';

export async function generateKeys() {
  await sodium.ready;
  const kp = sodium.crypto_box_keypair();
  return {
    pub: sodium.to_base64(
      kp.publicKey,
      sodium.base64_variants.URLSAFE_NO_PADDING
    ),
    priv: sodium.to_base64(
      kp.privateKey,
      sodium.base64_variants.URLSAFE_NO_PADDING
    ),
  };
}

// Chiffre une clé privée avec mot de passe
export async function encrypt(privBase64: string, password: string) {
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
    ciphertext: sodium.to_base64(
      ciphertext,
      sodium.base64_variants.URLSAFE_NO_PADDING
    ),
    nonce: sodium.to_base64(nonce, sodium.base64_variants.URLSAFE_NO_PADDING),
    salt: sodium.to_base64(salt, sodium.base64_variants.URLSAFE_NO_PADDING),
  };
}

// Déchiffre la clé privée
export async function decrypt(encrypted: any, password: string) {
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
  return sodium.to_base64(priv, sodium.base64_variants.URLSAFE_NO_PADDING);
}

export async function decryptGroupKeyFromServer(
  cipherB64: string,
  nonceB64: string,
  serverPublicKey: string,
  userPrivateKey: string
) {
  await sodium.ready;

  const serverPublicKeyBytes = sodium.from_base64(
    serverPublicKey,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const userPrivateKeyBytes = sodium.from_base64(
    userPrivateKey,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const nonce = sodium.from_base64(
    nonceB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const cipher = sodium.from_base64(
    cipherB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const groupSecretKey = sodium.crypto_box_open_easy(
    cipher,
    nonce,
    serverPublicKeyBytes,
    userPrivateKeyBytes
  );

  return sodium.to_base64(
    groupSecretKey,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );
}

export async function encryptGroupMessage(
  message: string,
  groupSecretKeyB64: string
) {
  console.log(groupSecretKeyB64);

  await sodium.ready;
  const groupSecretKey = sodium.from_base64(
    groupSecretKeyB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );
  const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES);

  const cipher = sodium.crypto_secretbox_easy(message, nonce, groupSecretKey);

  return {
    nonce: sodium.to_base64(nonce, sodium.base64_variants.URLSAFE_NO_PADDING),
    ciphertext: sodium.to_base64(
      cipher,
      sodium.base64_variants.URLSAFE_NO_PADDING
    ),
  };
}

export async function decryptGroupMessage(
  cipherB64: string,
  nonceB64: string,
  groupSecretKeyB64: string
) {
  await sodium.ready;
  const groupSecretKey = sodium.from_base64(
    groupSecretKeyB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const nonce = sodium.from_base64(
    nonceB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );
  const cipher = sodium.from_base64(
    cipherB64,
    sodium.base64_variants.URLSAFE_NO_PADDING
  );

  const msg = sodium.crypto_secretbox_open_easy(cipher, nonce, groupSecretKey);

  return sodium.to_string(msg);
}
