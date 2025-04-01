import { InfiniteData, QueryClient, QueryClientProvider, useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

import ChatBubble from "./ChatBubble";
import { z } from "zod";
import { ChatClient, createChatClient } from "./chatClient";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { IMAGES } from "@/lib/constants";
import { gql, GraphQLClient } from "graphql-request";

const queryPageSize = 10;

// Placeholder
// TODO: Define this properly
const ChatMessage = z.object({
  Id: z.number(),
  MessageId: z.string(),
  Timestamp: z.number(),
  AuthorId: z.number(),
  AuthorName: z.string(),
  AuthorNFT: z.string().optional(),
  Content: z.string(),
  cursor: z.string().nullable() // Add cursor field
});
export type ChatMessageType = z.infer<typeof ChatMessage>;

const ChatMessageHistory = z.array(ChatMessage);
export type ChatMessageHistoryType = z.infer<typeof ChatMessageHistory>;

export const ChatMessageCreate = ChatMessage.omit({
  Id: true,
  MessageId: true,
  AuthorId: true,
  Timestamp: true,
});
export type ChatMessageCreate = z.infer<typeof ChatMessageCreate>;

interface ChatProps {
  historyIndex?: number;
  onClose: () => void;
  chatOpen: boolean;
  setLatestMessage: (message: ChatMessageType) => void;
  //   chatClient: ChatClient;
  //   newMessages: Array<ChatMessageType>;
  //   onUserMessageSent?: () => voi  d;
}

export default function ChatWindow({ chatOpen, setChatOpen }: { chatOpen: boolean; setChatOpen: (chatOpen: boolean) => void }) {
  const [latestMessage, setLatestMessage] = useState<ChatMessageType | null>(null);

  return (
    <>
      <LatestPreviewMessage latestMessage={latestMessage} />
      {<Chat setLatestMessage={setLatestMessage} chatOpen={chatOpen} onClose={() => setChatOpen(false)} />}
    </>
  );
}

function LatestPreviewMessage({ latestMessage }: { latestMessage?: ChatMessageType | null }) {
  const [displayMessage, setDisplayMessage] = useState<ChatMessageType | null>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (latestMessage) {
      setDisplayMessage(latestMessage);
      // // Clear any existing timer
      // if (timer) {
      //   clearTimeout(timer);
      // }

      // // Set a new timer to hide the message
      // const newTimer = setTimeout(() => {
      //   setDisplayMessage(null);
      // }, 3000);

      // setTimer(newTimer);
    }

    // Cleanup function to clear the timer
    // return () => {
    //   if (timer) {
    //     clearTimeout(timer);
    //   }
    // };
  }, [latestMessage]);

  if (!displayMessage) return null;

  return (
    <div
      style={{
        backgroundImage: "url('https://arweave.net/bMyFoyl8AwtVa9-pMLRv3N_SPPD0vLBC1XBbvodDp74')",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "408px",
        height: "99px",
      }}
      className="absolute bottom-20 right-4 z-[60]"
    >
      <div className="flex items-center space-x-4 p-4">
        <img src={displayMessage.AuthorNFT ? `https://arweave.net/${displayMessage.AuthorNFT}` : IMAGES.DEFAULT_DUMDUM} alt="User Avatar" className="w-16 h-16 object-contain" />
        <div className="flex flex-col">
          {/* <span className="text-white text-xl line-clamp-2">
            {displayMessage.AuthorName}:{displayMessage.Content}
          </span> */}
          <span className="text-white text-xl line-clamp-2">
            <span className="font-bold mr-2">{displayMessage.AuthorName}:</span>
            <span>{displayMessage.Content}</span>
          </span>
        </div>
      </div>
    </div>
  );
}


function Chat({ onClose, chatOpen, setLatestMessage }: ChatProps) {
  const { GameStatePage, currentIslandLevel } = useGameStore((state) => state);

  const CHAT_ROOM = currentIslandLevel == 0 ? "Town" : "RestArea";
  // Add this line to create a unique key for the query
  const queryKey = `messageHistory-${CHAT_ROOM}-${GameStatePage}`;

  const chatClient = createChatClient(CHAT_ROOM);
  const user = useGameStore((state) => state.user!);
  const userAddress = user.address;
  const isInitialFetchRef = useRef(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [allMessages, setAllMessages] = useState<Array<ChatMessageType>>([]);

  useEffect(() => {
    setAllMessages([]);
  }, [GameStatePage]);

  //   reset isInitialFetchRef when chatOpen is false
  useEffect(() => {
    if (!chatOpen) {
      isInitialFetchRef.current = true;
    }
  }, [chatOpen]);
// Inside your component
const queryClient = useQueryClient();

// Reset query cache on component mount
useEffect(() => {
  // Reset the query cache for this specific query when component mounts
  queryClient.resetQueries({ queryKey: [queryKey] });
  
  return () => {
    // Optional: Save last known cursor in localStorage when unmounting
    if (lastKnownCursorRef.current) {
      localStorage.setItem(`chat-cursor-${queryKey}`, lastKnownCursorRef.current);
    }
  };
}, []);

// Track the last cursor we've seen
const lastKnownCursorRef = useRef<string | null>(null);

// Track which page ranges we've already fetched
const fetchedPageRangesRef = useRef<{start: number, end: number}[]>([]);

const {
  data: historyData,
  isLoading: isLoadingHistory,
  fetchPreviousPage,
  hasPreviousPage,
  isFetchingPreviousPage,
} = useInfiniteQuery<ChatMessageType[], Error, InfiniteData<ChatMessageType[]>, string[], string | null>({
  queryKey: [queryKey],
  queryFn: async ({ pageParam }) => {
    console.log("Fetching messages with pageParam:", pageParam);

    // Use fetchMessages instead of readHistory
    const result = await chatClient.fetchMessages(
      queryPageSize, 
      pageParam
    );
    
    console.log("Just checking: " + JSON.stringify(result));
    
    if (result.messages.length > 0) {
      setLatestMessage(result.messages[0]);
      
      // Update our tracking of fetched ranges
      if (result.messages.length > 0) {
        const highestId = Math.max(...result.messages.map(m => m.Id || 0));
        const lowestId = Math.min(...result.messages.map(m => m.Id || 0));
        
        // Track this range
        fetchedPageRangesRef.current.push({start: lowestId, end: highestId});
        console.log("Fetched range:", lowestId, "to", highestId);
        console.log("All fetched ranges:", fetchedPageRangesRef.current);
      }
      
      // Store the cursor for future use
      if (result.nextCursor) {
        lastKnownCursorRef.current = result.nextCursor;
      }
    }
    
    // Filter out messages with null IDs
    const validMessages = result.messages.filter(message => message.Id !== null);
    
    console.log("Fetched valid messages:", validMessages);
    return validMessages;
  },
  initialPageParam: (() => {
    // Try to restore cursor from localStorage if available
    const savedCursor = localStorage.getItem(`chat-cursor-${queryKey}`);
    return savedCursor || null;
  })(),
  getNextPageParam: () => undefined,
  getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
    if (!firstPage || firstPage.length === 0) {
      return undefined;
    }
    
    // Get the ID range of this page
    const pageIds = firstPage.map(m => m.Id).filter(id => id !== null) as number[];
    const lowestId = Math.min(...pageIds);
    const highestId = Math.max(...pageIds);
    
    console.log("Current page range:", lowestId, "to", highestId);
    
    // Check if we've already fetched the next range
    const nextRangeAlreadyFetched = fetchedPageRangesRef.current.some(range => 
      range.end < lowestId && range.end >= lowestId - queryPageSize
    );
    
    if (nextRangeAlreadyFetched) {
      console.log("Next range already fetched, skipping");
      return undefined;
    }
    
    // Find the oldest message with a valid cursor
    const oldestMessages = [...firstPage]
      .filter(m => m.Id !== null)
      .sort((a, b) => a.Id! - b.Id!);
    
    if (oldestMessages.length === 0) return undefined;
    
    const oldestMessage = oldestMessages[0];
    console.log("Using cursor from message ID:", oldestMessage.Id);
    
    return oldestMessage.cursor;
  },
  enabled: true,
});
  
  
  const { data: newMessages, refetch: refetchNewMessages } = useQuery<ChatMessageType[]>({
    queryKey: [`newMessages-${queryKey}`],
    queryFn: async () => {
      // Get the latest timestamp from all messages
      const latestTimestamp = allMessages?.[0]?.Timestamp;
      if (latestTimestamp === undefined) return [];
      
      console.log("5 second poll, latest timestamp:", latestTimestamp);
      
      // Fetch all recent messages and filter client-side
      const result = await chatClient.fetchMessages(queryPageSize);
      
      // Filter messages that are newer than our latest message and have valid IDs
      const newerMessages = result.messages.filter(
        message => message.Timestamp > latestTimestamp && message.Id !== null
      );
      
      if (newerMessages.length > 0) {
        setLatestMessage(newerMessages[0]);
      }
      
      return newerMessages;
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });
  
  useEffect(() => {
    if (historyData) {
      // Get all messages from all pages
      const pagesMessages = historyData.pages.flatMap(page => page)
        .filter(message => message.Id !== null);
      
      setAllMessages(prev => {
        // Combine with existing messages and apply our improved filtering
        const combined = removeDuplicates([...prev, ...pagesMessages]);
        
        console.log("Updated allMessages count:", combined.length);
        return combined;
      });
    }
  }, [historyData]);
  

  useEffect(() => {
    if (newMessages) {
      setAllMessages((prev) => removeDuplicates([...prev, ...newMessages]));
    }
  }, [newMessages]);

  const messagesRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);

  const handleScroll = useCallback(() => {
    const element = messagesRef.current;
    if (element) {
      const { scrollTop, scrollHeight, clientHeight } = element;
      setIsAtBottom(scrollHeight - scrollTop === clientHeight);

      if (scrollTop === 0 && hasPreviousPage && !isFetchingPreviousPage) {
        scrollPositionRef.current = scrollHeight;
        fetchPreviousPage();
      }
    }
  }, [fetchPreviousPage, hasPreviousPage, isFetchingPreviousPage]);

  useEffect(() => {
    const element = messagesRef.current;
    console.log("useEffect ADDING SCROLL EVENT LISTENER", { element, chatOpen });
    if (!chatOpen) {
      if (element) {
        element.removeEventListener("scroll", handleScroll);
      }
      return;
    }
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [chatOpen, handleScroll, messagesRef]);

  // scroll to bottom of chat when messages are loaded and on initial fetch
  useEffect(() => {
    const element = messagesRef.current;
    if (!element) return;

    const scrollToBottom = () => {
      // smooth scroll to bottom of chat
      element.scrollTo({
        top: element.scrollHeight,
        behavior: "smooth",
      });
    };

    if (isInitialFetchRef.current && !isLoadingHistory && allMessages.length) {
      // Use setTimeout to ensure the content has been rendered
      setTimeout(() => {
        scrollToBottom();
        isInitialFetchRef.current = false;
      }, 0);
    } else if (isAtBottom && newMessages?.length) {
      scrollToBottom();
    } else if (scrollPositionRef.current > 0) {
      const newScrollTop = element.scrollHeight - scrollPositionRef.current;
      element.scrollTop = newScrollTop;
      scrollPositionRef.current = 0;
    }
  }, [chatOpen, isLoadingHistory, newMessages, isAtBottom, allMessages]);

  //   const allMessages = useMemo(() => {
  //     const messagesMap = new Map();
  //     console.log("redering new messages", historyData, newMessages);

  //     // Add new messages to the map
  //     newMessages?.forEach((msg) => messagesMap.set(msg.Id, msg));

  //     // Add historical messages to the map, overwriting any duplicates
  //     historyData?.pages.forEach((page) => page.forEach((msg) => messagesMap.set(msg.Id, msg)));

  //     // Convert map to array, sort by timestamp
  //     return Array.from(messagesMap.values()).sort((a, b) => a.Timestamp - b.Timestamp);
  //   }, [newMessages, historyData]);
  function removeDuplicates(messages: Array<ChatMessageType>) {
    // Use a Map to remove duplicates by ID
    const messagesMap = new Map();
    
    // Only include messages with valid IDs
    const validMessages = messages.filter(msg => msg.Id !== null);
    
    // Add all messages to the map
    validMessages.forEach((msg) => {
      messagesMap.set(msg.Id, msg);
    });
    
    // Convert back to array and sort by ID in descending order
    const sortedMessages = Array.from(messagesMap.values())
      .sort((a, b) => (b.Id as number) - (a.Id as number));
    
    // Filter out messages with large ID gaps
    const filteredMessages = [];
    let previousId = null;
    
    for (const message of sortedMessages) {
      if (previousId === null || Math.abs((message.Id as number) - previousId) <= 2) {
        filteredMessages.push(message);
        previousId = message.Id as number;
      } else {
        console.log(`Filtering out message with ID ${message.Id} due to large gap from ${previousId}`);
      }
    }
    
    // Sort by timestamp in descending order (newest first)
    return filteredMessages.sort((a, b) => b.Timestamp - a.Timestamp);
  }
  

  useEffect(() => {
    if (newMessages) {
      setAllMessages((prev) => removeDuplicates([...prev, ...newMessages]));
    }
  }, [newMessages]);

  const form = useForm();

  if (!chatOpen) return null;
console.log("All messages: "+JSON.stringify(allMessages));
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 top-[100px] bottom-[10vh]">
      <div
        className="relative flex flex-col"
        style={{
          //   backgroundImage: "url('https://arweave.net/VuvTMQrwAs5Pai_xzwuzl_1gnz3bCFyJ6a0OXJEW_ow')",
          //   backgroundSize: "contain",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "30px",
          width: "800px",
          height: "100%",
          // maxHeight: "80vh",
        }}
      >
        <ImgButton
          className="absolute top-2 right-4"
          src="https://arweave.net/d-XLB6fqEQsopfIvBAY_eeU5fu9dLhbWh2cipzJqqFM"
          alt="Close Chat"
          onClick={() => {
            onClose();
          }}
        />
        <h2 className="text-white text-center text-4xl p-4 font-bold underline">DUMVERSE CHAT</h2>
        <div ref={messagesRef} className="flex-grow overflow-y-auto px-24 pb-4">
          {isFetchingPreviousPage && <div className="text-white text-center">Loading more...</div>}
          {isLoadingHistory && <div className="text-white text-center">Loading...</div>}
          {!isLoadingHistory && renderMessages(userAddress, allMessages)}
        </div>

        <Form {...form}>
          <form
            className="p-4 flex justify-center items-center gap-4"
            onSubmit={form.handleSubmit(async () => {
              console.log("submit");
              const message = form.getValues("message");
              form.setValue("message", "");

              if (message === undefined || message === "") return;
              setSendingMessage(true);
              await chatClient.postMessage({
                Content: message,
                AuthorNFT: user.nft_address,
                AuthorName: user.name,
                cursor: null
              });

              refetchNewMessages();
              setSendingMessage(false);
            })}
          >
            <img src={user.nft_address ? `https://arweave.net/${user.nft_address}` : IMAGES.DEFAULT_DUMDUM} alt="User Avatar" className="h-[100px] object-contain" />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Chat Message"
                      autoComplete="off"
                      className="text-white p-8 text-2xl bg-no-repeat bg-left border-none ring-0 ring-offset-transparent focus-visible:ring-0"
                      style={{
                        // width: "calc(487px * 1)",
                        height: "calc(120px * 1)",
                        // height: "200px",
                        objectFit: "contain",
                        backgroundColor: "transparent",
                        backgroundImage: "url('https://arweave.net/3j3dDHjRvksEdr0HUdHMJq7XDbbWHanQ8e_wLMR9QXA')",
                        backgroundSize: "100% 100%",
                      }}
                      {...field}
                    />
                    {/* <Input className="chat-input-message" placeholder="Message" autoComplete="off" /> */}
                  </FormControl>
                </FormItem>
              )}
            />
            <Button disabled={sendingMessage} className="text-white text-2xl" variant={"ghost"} type="submit">
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function renderMessages(userAddress: string, messages: Array<ChatMessageType>) {
  console.log("renderMessages", messages);
  // if (this.state.loading)
  //   return (<Loading />);

  const messageList = messages.sort((a, b) => a.Timestamp - b.Timestamp);

  if (messageList.length === 0) {
    return <div>No messages yet.</div>;
  }

  return messageList.map((msg) => <ChatBubble key={msg.Id} chatMessage={msg} userAddress={userAddress} />);
}