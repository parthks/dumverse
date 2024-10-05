import { formatTimestamp } from "@/lib/time";
import { ChatMessageType } from "./Chat";
import { useGameStore } from "@/store/useGameStore";
import { IMAGES } from "@/lib/constants";

// const kingAddress = "kPjfXLFyjJogxGRRRe2ErdYNiexolpHpK6wGkz-UPVA";
// const bankerAddress = "ptvbacSmqJPfgCXxPc9bcobs5Th2B_SxTf81vRNkRzk";

// const highlightedAuthorIds = [kingAddress, bankerAddress];

type ChatBubbleProps = {
  chatMessage: ChatMessageType;
  userAddress?: string;
};

export const ChatBubble = ({ chatMessage }: ChatBubbleProps) => {
  const userId = useGameStore((state) => state.user?.id);
  const walletId = chatMessage.AuthorId;
  const isUser = chatMessage.AuthorId === userId;

  //   const isHighlighted =
  //     highlightedAuthorIds.includes(chatMessage.AuthorId) ||
  //     (chatMessage.Recipient !== undefined &&
  //       chatMessage.Recipient === userAddress);
  //   const isKing = chatMessage.AuthorId === kingAddress;

  return (
    <div key={chatMessage.Id} className="mb-8">
      <div>
        <div className="flex flex-row items-center gap-8">
          <div className="flex-shrink-0">
            <img
              src={chatMessage.AuthorNFT ? `https://arweave.net/${chatMessage.AuthorNFT}` : IMAGES.DEFAULT_DUMDUM}
              alt="User Avatar"
              className="w-[50px] h-[50px] object-contain"
            />
          </div>
          <div className="text-white">
            <div className="text-white text-xs">{formatTimestamp(chatMessage.Timestamp / 1000, true)}</div>
            <div className="text-white text-2xl">
              {chatMessage.AuthorName}: {chatMessage.Content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
