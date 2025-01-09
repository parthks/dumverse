import React, { useState, useEffect } from "react";
import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { DIALOGUES, IMAGES } from "@/lib/constants";

interface GifComponentProps {
  className?: string;
  buttonClassName?: string;
  buttonAppearTime?: number;
  onClickFunction?: ()=>Promise<boolean>;
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
  const [gifSrc, setGifSrc] = useState<string | null>("");
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
      if (user.special_item_key > -1) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.BANK || 0);
      }else if(!user.nft_address){
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

    if (GameStatePage === GameStatePages.NFT_SHOP && user) {
      if (user.special_item_thread > -1) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.NFT_SHOP || 0);
      }else if(!user.nft_address){
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.NFT_SHOP || 0);
      } else {
        setQuestAccepted(false);
        setGifSrc(`${DIALOGUES.NFT_SHOP.dialogue_quest}?${Date.now()}`);
        const timer = setTimeout(() => {
          setShowButton(true);
        }, buttonAppearTime);

        return () => clearTimeout(timer);
      }
    }

    if (GameStatePage === GameStatePages.WEAPON_SHOP && user) {
      if (user.special_item_bark > -1) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.WEAPON_SHOP || 0);
      }else if(!user.nft_address){
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.WEAPON_SHOP || 0);
      } else {
        setQuestAccepted(false);
        setGifSrc(`${DIALOGUES.WEAPON_SHOP.dialogue_quest}?${Date.now()}`);
        const timer = setTimeout(() => {
          setShowButton(true);
        }, buttonAppearTime);

        return () => clearTimeout(timer);
      }
    }

    if (GameStatePage === GameStatePages.SHOP && user) {
      if (user.special_item_heart > -1) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.SHOP || 0);
      } else {
        setQuestAccepted(false);
        setGifSrc(`${DIALOGUES.SHOP.dialogue_quest}?${Date.now()}`);
        const timer = setTimeout(() => {
          setShowButton(true);
        }, buttonAppearTime);

        return () => clearTimeout(timer);
      }
    }

    if (GameStatePage === GameStatePages.DEN && user) {
      if (user.special_item_kitten > -1) {
        setQuestAccepted(true);
        setDialogueIndex(retrievedData.DEN || 0);
      } else {
        setQuestAccepted(false);
        setGifSrc(`${DIALOGUES.DEN.dialogue_quest}?${Date.now()}`);
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

      if (GameStatePage === GameStatePages.NFT_SHOP) {
        const newIndex = (savedData.NFT_SHOP + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, NFT_SHOP: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
      }

      if (GameStatePage === GameStatePages.WEAPON_SHOP) {
        const newIndex = (savedData.WEAPON_SHOP + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, WEAPON_SHOP: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
      }

      if (GameStatePage === GameStatePages.SHOP) {
        const newIndex = (savedData.SHOP + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, SHOP: newIndex };
        localStorage.setItem("currentDialogue", JSON.stringify(updatedData));
      }

      if (GameStatePage === GameStatePages.DEN) {
        const newIndex = (savedData.DEN + 1) % 4; 
        setDialogueIndex(newIndex);
        const updatedData = { ...savedData, DEN: newIndex };
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
        const updatedData = { ...savedData, INFIRMARY: newIndex };
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
    console.log("Quest Accept clicked"); 
    if (onClickFunction) {
      const questStatus: boolean = await onClickFunction();
      if (questStatus) setGifSrc(null) ;
      setShowButton(!questStatus);
      setQuestAccepted(questStatus);
    }
  };
  

  return (
    <div className={`${className}`}>
      <div className="relative w-full h-full">
        {gifSrc && (
          <img
            src={gifSrc}
            alt="Dialogue Quest GIF"
            className="relative max-w-full object-cover"
          />
        )}
        {showButton && !questAccepted && (
          // <button
          //   className={`absolute bottom-[23%] right-[20%] bg-gray-800 text-white px-4 py-2 rounded-md z-10 ${buttonClassName}`}
          //   onClick={handleQuestAcceptance}
          // >
          //   Accept Quest
          // </button>
          // top-[55%] right-[35%]
          <ImgButton
            src={IMAGES.ACCEPT_QUEST_BUTTON}
            alt={"Accept Quest"}
           disabled={buttonDisable}
            onClick={handleQuestAcceptance}
            className={`absolute bottom-[20%] 
              right-[15%] 
              sm:bottom-[22%] 
              sm:right-[18%] 
              md:bottom-[23%] 
              md:right-[20%] 
              lg:bottom-[24%] 
              lg:right-[22%] 
              xl:bottom-[23%] 
              xl:right-[21%]
              ${buttonClassName}`}
          />
        )}
      </div>
    </div>
  );
};

export default GifComponent;
