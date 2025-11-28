export type CONVERSATION = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  pubKeyGroup: string;
  keyVersion: number;
  latestMessage: {
    text: string;
  };
  groupKeys: [
    {
      ciphertext: string;
      nonce: string;
      version: number;
      privKey: string;
    },
  ];
  unreadMessages: number;
  usersConversation: [
    {
      id: string;
      conversationId: number;
      userId: string;
      createdAt: string;
      user: {
        id: string;
        firstname: string;
        lastname: string;
        publicKey: string;
      };
    },
  ];
};
