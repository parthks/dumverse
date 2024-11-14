import React, { useState, useEffect } from "react";
import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { DIALOGUES, IMAGES } from "@/lib/constants";

interface GifComponentProps {
  className?: string;
  buttonClassName?: string;
  buttonAppearTime?: number;
  onClickFunction?: () => Promise<void>;
  buttonDisable?: boolean;
}

const GifComponent: React.FC<GifComponentProps> = ({
  buttonAppearTime = 3000,
  className,
  buttonClassName,
  onClickFunction,
  buttonDisable,
}) => {
  const { GameStatePage, user, refreshUserData} = useGameStore();
  const [showButton, setShowButton] = useState(false);
  const [gifSrc, setGifSrc] = useState("");
  const [questAccepted, setQuestAccepted] = useState(false);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  // const buildingDialogue = {
  //   dialogue1_quest: "https://arweave.net/OeQKQOi4B6VG4IG9xPYrHgrJooWyvazHl9KvY5a1KO0",
  //   dialogue2: "https://arweave.net/z07WbL9aqJMfR3FN4vgGfezkUfxjf4sfWFD909vboro",
  //   dialogue3: "https://arweave.net/Jt3KS0FeaNbtRnOYiEhuhuPujNoOeukbnpp_-dbKuwA",
  //   dialogue4: "https://arweave.net/32bGcZNUBiL8yOfOF7zWibV9c1nQs-MsD-vBqZCs9aY",
  //   dialogue5: "https://arweave.net/3TmhZdvYqiJ9B0rGv22cvWT42SPj-as6eFLeNaYgNAE",
  // };

  useEffect(() => {
    // Initialize or retrieve currentDialogue from localStorage
    const savedData = JSON.parse(
      localStorage.getItem("currentDialogue") || "{}"
    );
    const initialData = {
      BANK: 0,
      DEN: 0,
      SHOP: 0,
      NFT_SHOP: 0,
      WEAPON_SHOP: 0,
      HALL_OF_FAME:0,
      INFIRMARY:0,
      ARMORY:0,
      BAKERY:0,
      VISITOR_CENTER:0,
    };
    const retrievedData = { ...initialData, ...savedData };
    localStorage.setItem("currentDialogue", JSON.stringify(retrievedData));

    if (GameStatePage === GameStatePages.BANK && user) {
      if (user.special_item_key === 0) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.BANK || 0);
      } else {
        setQuestAccepted(false);
        setGifSrc(`${DIALOGUES.BANK.dialogue_quest}?${Date.now()}`);
        const timer = setTimeout(() => {
          setShowButton(true);
        }, buttonAppearTime);

        return () => clearTimeout(timer);
      }
    }

   if (GameStatePage === GameStatePages.HALL_OF_FAME && user){
    setQuestAccepted(true);
    setDialogueIndex(retrievedData.HALL_OF_FAME);
   }

   if (GameStatePage === GameStatePages.INFIRMARY && user){
    setQuestAccepted(true);
    setDialogueIndex(retrievedData.INFIRMARY || 0);
   }
   if (GameStatePage === GameStatePages.ARMORY && user){
    setQuestAccepted(true);
    setDialogueIndex(retrievedData.ARMORY || 0);
   }
   if (GameStatePage === GameStatePages.BAKERY && user){
    setQuestAccepted(true);
    setDialogueIndex(retrievedData.BAKERY || 0);
   }
   if (GameStatePage === GameStatePages.VISITOR_CENTER && user){
    setQuestAccepted(true);
    setDialogueIndex(retrievedData.VISITOR_CENTER || 0);
   }

  }, [GameStatePage, user]);

  // Increment dialogueIndex when page is visited and update localStorage
  useEffect(() => {
    if (questAccepted) {
      const savedData = JSON.parse(
        localStorage.getItem("currentDialogue") || "{}"
      );

      if (GameStatePage === GameStatePages.BANK) {
        const newIndex = (savedData.BANK + 1) % 4; 
        setDialogueIndex(newIndex);

        // Update dialogueIndex in localStorage
        const updatedData = { ...savedData, BANK: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
      }

      if (GameStatePage === GameStatePages.HALL_OF_FAME ){
        const newIndex = (savedData.HALL_OF_FAME + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, HALL_OF_FAME: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
       }
       if (GameStatePage === GameStatePages.INFIRMARY ){
        const newIndex = (savedData.INFIRMARY + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, ARMORY: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
       }
       if (GameStatePage === GameStatePages.ARMORY ){
        const newIndex = (savedData.ARMORY + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, ARMORY: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
       }
       if (GameStatePage === GameStatePages.BAKERY ){
        const newIndex = (savedData.BAKERY + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, BAKERY: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
       }
       if (GameStatePage === GameStatePages.VISITOR_CENTER ){
        const newIndex = 0; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, VISITOR_CENTER: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
       }

    }
  }, [GameStatePage, questAccepted]);

  // Update gifSrc based on the current dialogueIndex
  useEffect(() => {
    if (questAccepted && GameStatePage) {
      const buildingDialogue =
        DIALOGUES[GameStatePage as keyof typeof DIALOGUES]; 
      if (buildingDialogue) {
        const dialogueKey = `dialogue${dialogueIndex + 1}`;
        const dialogueUrl =
          buildingDialogue[dialogueKey as keyof typeof buildingDialogue] ||
          buildingDialogue.dialogue1;

        if (dialogueUrl) {
          const newGifSrc = `${dialogueUrl}?${Date.now()}`;
          setGifSrc(newGifSrc);
        }
      }
    }
  }, [dialogueIndex, questAccepted, GameStatePage]);

  const handleQuestAcceptance = async () => {
    if (user && onClickFunction){
      setQuestAccepted(true);
      setShowButton(false);
      await onClickFunction();
      await refreshUserData(user.id)
    }
  };

  return (
    <div className={`${className}`}>
      <div className="relative">
        {gifSrc && (
          <img
            src={gifSrc}
            alt="Dialogue Quest GIF"
            className="relative max-w-full"
          />
        )}
        {showButton && !questAccepted && (
          // <button
          //   className={`absolute bottom-[23%] right-[20%] bg-gray-800 text-white px-4 py-2 rounded-md ${buttonClassName}`}
          //   onClick={handleQuestAcceptance}
          // >
          //   Accept Quest
          // </button>
          // top-[55%] right-[35%]
          <ImgButton
            src={IMAGES.ACCEPT_QUEST_BUTTON}
            disabled={buttonDisable}
            alt={"Accept Quest"}
            onClick={handleQuestAcceptance}
            className={`absolute bottom-[23%] right-[20%] ${buttonClassName}`}
          />
        )}
      </div>
    </div>
  );
};

export default GifComponent;
