import React, { useState, useEffect } from 'react';
import ImgButton from "@/components/ui/imgButton";
import { GameStatePages, useGameStore } from "@/store/useGameStore";
import { DIALOGUES } from "@/lib/constants";



interface GifComponentProps {
  className?: string;
  buttonClassName?: string;
  buttonAppearTime?: number;
  onClickFunction: () => Promise<void>;
}

const GifComponent: React.FC<GifComponentProps> = ({
  buttonAppearTime = 3000,
  className,
  buttonClassName,
  onClickFunction
}) => {

  const { GameStatePage } = useGameStore();
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
    let buildingDialogue = null;
    let retrievedData: string | null = localStorage.getItem("currentDialogue");
    if (retrievedData==null) {

     let currentDialogue = {
      BANK: 0,
      DEN: 0,
      GENERAL_STORE: 0,
      NFT_HOLDER_SHOP:0,
      WEAPON:0
    };  
    localStorage.setItem("dialogueData", JSON.stringify(currentDialogue));
  } else{
    
    if (GameStatePage === GameStatePages.BANK){
            
      buildingDialogue=DIALOGUES.BANK;
      // const isquestAccepted= (async()=>await example())();
      // if (isquestAccepted) {
      //   setQuestAccepted(true);
       
      //   setDialogueIndex( retrievedData.BANK);
      // }
    

    }

  }


if (buildingDialogue) {
    if (!questAccepted ) {
      setGifSrc(`${buildingDialogue.dialogue_quest}?${Date.now()}`); 
    } else {
      if (dialogueIndex === 0) setGifSrc(`${buildingDialogue.dialogue1}?${Date.now()}`); 
      else if (dialogueIndex === 1) setGifSrc(`${buildingDialogue.dialogue2}?${Date.now()}`); 
      else if (dialogueIndex === 2) setGifSrc(`${buildingDialogue.dialogue3}?${Date.now()}`); 
      else if (dialogueIndex === 3) setGifSrc(`${buildingDialogue.dialogue4}?${Date.now()}`); 
    }
}
    if (!questAccepted) {
      const timer = setTimeout(() => {
        setShowButton(true);
      }, buttonAppearTime);

      return () => clearTimeout(timer);
    } 

  }, [questAccepted, dialogueIndex, buttonAppearTime]);

  const handleQuestAcceptance = async() => {
    setQuestAccepted(true);
    setShowButton(false); 
    await onClickFunction();
  };

  useEffect(()=>{
if (questAccepted){
  setDialogueIndex((prevIndex) => {
    const nextIndex = prevIndex + 2;
    if (nextIndex > 3) return 0; 
    return nextIndex;
  });
}
  },[questAccepted])

  return (
    <div className={`${className}`}>
      <div className='relative'>
      {gifSrc && (
        <img
          src={gifSrc}
          alt="Dialogue Quest GIF"
          className="relative max-w-full"
        />
      )}
      {showButton && !questAccepted && (
        <button
          className={`absolute bottom-[23%] right-[20%] bg-gray-800 text-white px-4 py-2 rounded-md ${buttonClassName}`}
          onClick={handleQuestAcceptance}
        >
          Accept Quest
        </button>
        // top-[55%] right-[35%]
      //   <ImgButton
      //   src={IMAGES.ACCEPT_QUEST_BUTTON}
      //   alt={"Accept Quest"}
      //   onClick={async () => {
      //    await onClickFunction();
      //   }}
      //   className='absolute bottom-[23%] right-[20%]'
      // />
      )}
      </div>
     
    </div>
  );
};

export default GifComponent;
