import { QueryClient, QueryClientProvider, useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ChatBubble from "./ChatBubble";
import { z } from "zod";
import { ChatClient, createChatClient } from "./chatClient";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import ImgButton from "../ui/imgButton";
import { IMAGES } from "@/lib/constants";

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
  //   const user = useGameStore((state) => state.user!);

  // const [allMessages, setAllMessages] = useState<Array<ChatMessageType>>([]);
  // const { GameStatePage, currentIslandLevel } = useGameStore((state) => state);

  // const CHAT_ROOM = currentIslandLevel == 0 ? "Town" : "RestArea";
  // // Add this line to create a unique key for the query
  // const queryKey = `messageHistory-${CHAT_ROOM}-${GameStatePage}`;
  // const chatClient = createChatClient(CHAT_ROOM);
  
  // const {
  //   data: historyData,
  //   isLoading: isLoadingHistory,
  //   fetchPreviousPage,
  //   hasPreviousPage,
  //   isFetchingPreviousPage,
  // } = useInfiniteQuery({
  //   queryKey: [queryKey],
  //   queryFn: async ({ pageParam }) => {
  //     console.log("Fetching messages with pageParam:", pageParam);

  //     const result = await chatClient.readHistory({
  //       idBefore: pageParam ? pageParam + 1 : undefined,
  //       limit: queryPageSize,
  //     });
  //     console.log("Ashu: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
  //      setLatestMessage(result[0]);
  //     console.log("Fetched messages:", result);
  //     return result;
  //   },
  //   initialPageParam: 0,
  //   getNextPageParam: () => undefined,
  //   getPreviousPageParam: (firstPage) => {
  //     if (!firstPage) return undefined;
  //     //   if firstPage is not an array, return undefined
  //     if (!Array.isArray(firstPage)) {
  //       return undefined;
  //     }
  //     if (firstPage.length === 0) {
  //       return undefined;
  //     }
  //     const lowestId = Math.min(...firstPage.map((m) => m.Id));
  //     if (lowestId <= 1) {
  //       return undefined;
  //     }
  //     return lowestId - 1;
  //   },
  //   enabled: false,
  // });

  // const { data: newMessages, refetch: refetchNewMessages } = useQuery({
  //   queryKey: [`newMessages-${queryKey}`],
  //   queryFn: async () => {
  //     const latestId = allMessages?.[allMessages.length - 1]?.Id;
  //     console.log("all message 2 Ashu: "+JSON.stringify(allMessages));
  //     console.log("latestId Ashu: "+JSON.stringify(latestId));
  //     if (latestId === undefined) return [];
  //     console.log("5 second poll", latestId);
  //     const result = await chatClient.readHistory({
  //       idAfter: latestId,
  //       limit: queryPageSize,
  //     });
  //     console.log("result useQuery Ashu: "+JSON.stringify(result));
  //     if (!chatOpen) setLatestMessage(result[0]);

  //     return result;
  //   },
  //   // enabled: !!historyData?.pages[0]?.length,
  //   refetchInterval: 5000, // Poll every 5 seconds
  // });
  // function removeDuplicates(messages: Array<ChatMessageType>) {
  //   const messagesMap = new Map();
  //   messages.forEach((msg) => messagesMap.set(msg.Id, msg));
  //   return Array.from(messagesMap.values()).sort((a, b) => a.Timestamp - b.Timestamp);
  // }

  // useEffect(() => {
  //   if (historyData) {
  //     const newMessages = historyData.pages.flatMap((page) => page);
  //     console.log("newmessage 1 Ashu: "+JSON.stringify(newMessages));
  //     setAllMessages((prev) => removeDuplicates([...prev, ...newMessages]));
  //     console.log("all message 3 Ashu: "+JSON.stringify(allMessages));
  //   }
  // }, [historyData]);

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
  const { lastDisplayedMessageId, user } = useGameStore();
  const setLastDisplayedMessageId = useGameStore((state) => state.setLastDisplayedMessageId);
console.log("Ashu: "+JSON.stringify(latestMessage));
  useEffect(() => {
    if (latestMessage && latestMessage.Id !== lastDisplayedMessageId && latestMessage.AuthorId.toString()!==user?.address) {

      setDisplayMessage(latestMessage);
      setLastDisplayedMessageId(latestMessage.Id);

      // Clear any existing timer
      if (timer) {
        clearTimeout(timer);
      }

      // Set a new timer to hide the message
      const newTimer = setTimeout(() => {
        setDisplayMessage(null);
      }, 3000);

      setTimer(newTimer);
    }

    // Cleanup function to clear the timer
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
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
      className="absolute bottom-20 right-4 z-10"
    >
      <div className="flex items-center space-x-4 p-4">
        <img
          src={displayMessage.AuthorNFT ? `https://arweave.net/${displayMessage.AuthorNFT}` : IMAGES.DEFAULT_DUMDUM}
          alt="User Avatar"
          className="w-16 h-16 object-contain"
        />
        <div className="flex flex-col">
          <span className="text-white text-xl line-clamp-2">
            {displayMessage.AuthorName}:{displayMessage.Content}
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

  const {
    data: historyData,
    isLoading: isLoadingHistory,
    fetchPreviousPage,
    hasPreviousPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: async ({ pageParam }) => {
      console.log("Fetching messages with pageParam:", pageParam);

      const result = await chatClient.readHistory({
        idBefore: pageParam ? pageParam + 1 : undefined,
        limit: queryPageSize,
      });
       setLatestMessage(result[0]);
      console.log("Fetched messages:", result);
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: () => undefined,
    getPreviousPageParam: (firstPage) => {
      if (!firstPage) return undefined;
      //   if firstPage is not an array, return undefined
      if (!Array.isArray(firstPage)) {
        return undefined;
      }
      if (firstPage.length === 0) {
        return undefined;
      }
      const lowestId = Math.min(...firstPage.map((m) => m.Id));
      if (lowestId <= 1) {
        return undefined;
      }
      return lowestId - 1;
    },
    enabled: true,
  });

  const { data: newMessages, refetch: refetchNewMessages } = useQuery({
    queryKey: [`newMessages-${queryKey}`],
    queryFn: async () => {
      const latestId = allMessages?.[allMessages.length - 1]?.Id;
      if (latestId === undefined) return [];
      console.log("5 second poll", latestId);
      const result = await chatClient.readHistory({
        idAfter: latestId,
        limit: queryPageSize,
      });
      if (!chatOpen) setLatestMessage(result[0]);

      return result;
    },
    // enabled: !!historyData?.pages[0]?.length,
    refetchInterval: 5000, // Poll every 5 seconds
  });

  useEffect(() => {
    if (historyData) {
      const newMessages = historyData.pages.flatMap((page) => page);
      setAllMessages((prev) => removeDuplicates([...prev, ...newMessages]));
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
    const messagesMap = new Map();
    messages.forEach((msg) => messagesMap.set(msg.Id, msg));
    return Array.from(messagesMap.values()).sort((a, b) => a.Timestamp - b.Timestamp);
  }
  useEffect(() => {
    if (newMessages) {
      setAllMessages((prev) => removeDuplicates([...prev, ...newMessages]));
    }
  }, [newMessages]);

  const form = useForm();

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      <div
        className="relative flex flex-col"
        style={{
          //   backgroundImage: "url('https://arweave.net/VuvTMQrwAs5Pai_xzwuzl_1gnz3bCFyJ6a0OXJEW_ow')",
          //   backgroundSize: "contain",
          //   backgroundPosition: "center",
          //   backgroundRepeat: "no-repeat",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          borderRadius: "30px",
          width: "881px",
          height: "881px",
          maxHeight: "90vh",
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
