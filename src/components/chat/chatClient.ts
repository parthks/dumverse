import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { ChatMessageCreate, ChatMessageHistoryType } from "./Chat";

type HistoryQuery = {
  idAfter?: number;
  idBefore?: number;
  timeStart?: Date;
  timeEnd?: Date;
  limit?: number;
};

export type ChatClient = {
  //   aoContractClient: AoContractClient;

  // Reads
  readCount(): Promise<number>;
  readHistory(query?: HistoryQuery): Promise<ChatMessageHistoryType>;

  // Writes
  postMessage(message: ChatMessageCreate): Promise<any>;
};

// Placeholder
// TODO: Define these methods properly
export const createChatClient = (): ChatClient => ({
  // Read
  readCount: () => sendDryRunGameMessage([{ name: "Action", value: "ChatCount" }], "chat").then((reply) => parseInt(reply.data as any)),
  readHistory: (query?: HistoryQuery) => {
    const queryTagsMap = {
      "Id-After": query?.idAfter?.toString(),
      "Id-Before": query?.idBefore?.toString(),
      "Timestamp-Start": query?.timeStart?.getTime().toString(),
      "Timestamp-End": query?.timeEnd?.getTime().toString(),
      Limit: query?.limit?.toString(),
    };
    const filterTags = Object.entries(queryTagsMap)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => ({ name, value: value! }));
    const tags = filterTags.concat({ name: "Action", value: "ChatHistory" });

    return sendDryRunGameMessage(tags, "chat").then((reply) => reply.data as any);
  },

  // Write
  postMessage: (chatMessage: ChatMessageCreate) => {
    const tags = [
      {
        name: "Action",
        value: "TestChatMessage",
      },
      {
        name: "AuthorName",
        value: chatMessage.AuthorName,
      },
    ];
    if (chatMessage.AuthorNFT) {
      tags.push({
        name: "AuthorNFT",
        value: chatMessage.AuthorNFT,
      });
    }
    return sendAndReceiveGameMessage(tags, chatMessage.Content, "chat").then((reply) => reply.data);
  },
});
