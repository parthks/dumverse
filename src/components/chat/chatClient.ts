import { sendAndReceiveGameMessage, sendDryRunGameMessage } from "@/lib/wallet";
import { ChatMessageCreate, ChatMessageHistoryType, ChatMessageType } from "./Chat";
import axios from "axios";
import { json } from "stream/consumers";
import { results } from "@permaweb/aoconnect";

type HistoryQuery = {
  idAfter?: number;
  idBefore?: number;
  timeStart?: Date;
  timeEnd?: Date;
  limit?: number;
};

type FetchMessagesResult = {
  messages: ChatMessageType[];
  nextCursor: string | null;
};

export type ChatClient = {
  //   aoContractClient: AoContractClient;
  chatRoom: "Town" | "RestArea";
  // Reads
  readCount(): Promise<number>;
  readHistory(query?: HistoryQuery): Promise<ChatMessageHistoryType>;

  // Writes
  postMessage(message: ChatMessageCreate): Promise<any>;
  fetchMessages(limit?: number, cursor?: string | null): Promise<FetchMessagesResult>;
  lastFetchResponse: FetchMessagesResult | null;
};

// Placeholder
// TODO: Define these methods properly
export const createChatClient = (chatRoom: "Town" | "RestArea"): ChatClient => ({
  chatRoom,
  // Read
  readCount: () =>
    sendDryRunGameMessage({
      tags: [
        { name: "Action", value: "ChatCount" },
        { name: "ChatRoom", value: chatRoom },
      ],
      process: "chat",
    }).then((reply) => parseInt(reply.data as any)),
  readHistory: (query?: HistoryQuery) => {
    const queryTagsMap = {
      ChatRoom: chatRoom,
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

    return sendDryRunGameMessage({ tags, process: "chat" }).then((reply) => reply.data as any);
  },

  // Write
  postMessage: (chatMessage: ChatMessageCreate) => {
    const tags = [
      {
        name: "Action",
        value: "ChatMessage",
      },
      {
        name: "ChatRoom",
        value: chatRoom,
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
    return sendAndReceiveGameMessage({ tags, data: chatMessage.Content, process: "chat" }).then((reply) => reply.data);
  },
  fetchMessages: async function(limit = 10, cursor = null): Promise<FetchMessagesResult> {
    try {
      // Prepare request parameters with proper typing
      const params: {
        from?: string;
        sort: string;
        limit: number;
      } = {
        sort: 'DESC',
        limit: limit
      };
      
      // Add cursor parameter if provided
      if (cursor) {
        params.from = cursor;
      }
      
      console.log("cursor: " + JSON.stringify(cursor));
  
      // Make the API request
      // const response = await axios.get(
      //   `https://cu129.ao-testnet.xyz/results/tyB_PzGz26bOoHz0xPFeXhfdMCzcpi656iY4XsgILJQ`,
      //   { params }
      // );
      const response = await  results({
        process: "tyB_PzGz26bOoHz0xPFeXhfdMCzcpi656iY4XsgILJQ",
        to: params.from ? params.from :  undefined ,
        sort: params.sort,
        limit: params.limit,
      });
      console.log("params: " + JSON.stringify(params));

      console.log("axios response received: "+ JSON.stringify(response));
      
      // Extract the data from the response
      const data = response;
      
      // Check if data exists and has the expected structure
      if (!data || !data.edges || !Array.isArray(data.edges)) {
        console.error("Invalid response structure:", data);
        return { messages: [], nextCursor: null };
      }
  
      // Filter and transform the messages
      const messages = data.edges
        .filter(edge => 
          edge && 
          edge.node && 
          edge.node.Messages && 
          Array.isArray(edge.node.Messages) && 
          edge.node.Messages.length > 0
        )
        .map(edge => {
          try {
            // Find the Status tag in the Messages array
            const tags = edge.node.Messages[0].Tags;
            if (!tags || !Array.isArray(tags)) return null;
            
            const statusTag = tags.find(tag => tag.name === "Status");
            
            // Skip if no Status tag or if value is just "Success"
            if (!statusTag || !statusTag.value || statusTag.value === "Success") {
              return null;
            }
            
            // Parse the JSON string in the Status tag value
            const parsedValue = JSON.parse(statusTag.value);
            
            return {
              Id: parsedValue.id || null,
              MessageId: parsedValue.messageId || "",
              Timestamp: parsedValue.timestamp || 0,
              AuthorId: parsedValue.authorId || "",
              AuthorName: parsedValue.authorName || "",
              AuthorNFT: parsedValue.authorNFT || undefined,
              Content: parsedValue.content || "",
              cursor: edge.cursor || null // Add the cursor from the edge
            };            
          } catch (error) {
            console.error("Error processing message:", error);
            return null;
          }
        })
        .filter((message): message is any => message !== null);
  
      // For cursor-based pagination, use the cursor from the edge
      const nextCursor = data.edges.length > 0 ? 
        data.edges[data.edges.length - 1].cursor : null;
  
      // Store the result for access in getPreviousPageParam
      const result = { messages, nextCursor };
      this.lastFetchResponse = result;
      console.log("Ashu chat messssss: "+JSON.stringify(this.lastFetchResponse));
      return result;
    } catch (error) {
      console.error("Error fetching messages:", error);
      return { messages: [], nextCursor: null };
    }
  }
  ,
  lastFetchResponse : null,

  
});