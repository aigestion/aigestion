declare module 'crystals-kyber' {
  export function KeyGen768(): [Uint8Array, Uint8Array];
  export function Encrypt768(publicKey: Uint8Array): [Uint8Array, Uint8Array];
  export function Decrypt768(ciphertext: Uint8Array, privateKey: Uint8Array): Uint8Array;
}
