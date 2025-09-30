export type CONVERSATION = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  creatorId: string;
  latestMessage: [
    {
      text: string;
    }
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
    }
  ];
};
