export type MESSAGE = {
  id: number;
  conversationId: number;
  senderId: string;
  receiverId: string;
  ciphertext: string;
  nonce: string;
  senderPub: string;
  recipientPub: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};
