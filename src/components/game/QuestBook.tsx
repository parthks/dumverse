import { IMAGES } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import React, { useState, useRef, useEffect } from "react";
import ImgButton from "../ui/imgButton";

export default function QuestBook() {
  const [currentPage, setCurrentPage] = useState(0);
  const setQuestBookOpen = useGameStore((state) => state.setQuestBookOpen);
  const user = useGameStore((state) => state.user!);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Sample quest data - replace with your actual quest data
  const BankKeysQuest = () => {
    return (
      <div className="grid grid-rows-[50%_20%_20%] h-full">
        <div>
          <h2 style={{ fontSize: `${32 * scale}px` }} className="text-2xl mb-2 underline">
            Find the Keys
          </h2>
          <p style={{ fontSize: `${24 * scale}px` }}>A Siba Inu pup has run away with the vault keys! Find him to unlock the treasures buried deep within in the vault.</p>
        </div>
        <div className="self-start flex items-center justify-center gap-2 text-center mx-auto">
          <img src={IMAGES.BANK_KEYS} alt="Keys" className="w-8" /> <span style={{ fontSize: `${28 * scale}px` }}>Keys found {user.special_item_key}/3</span>
        </div>
        <div className="self-start">
          <h3 style={{ fontSize: `${28 * scale}px`, color: "#E19A4C" }}>Reward:</h3>
          <p style={{ fontSize: `${24 * scale}px` }}>Access to $DUMZ in the NFT Holder Vault</p>
        </div>
      </div>
    );
  };

  const HeartQuest = () => {
    return (
      <div className="grid grid-rows-[50%_20%_20%] h-full">
        <div>
          <h2 style={{ fontSize: `${32 * scale}px` }} className="text-2xl mb-2 underline">
            Moar Heartz
          </h2>
          <p style={{ fontSize: `${24 * scale}px` }}>
            The Dum at the General Shop mentioned that legend tells of heart pieces stolen by a mystical creature who tricked Dumz into falling in love and broke their hearts. Find
            the creature and you will be rewarded.
          </p>
        </div>
        <div className="self-start flex items-center justify-center gap-2 text-center mx-auto">
          <img src="https://arweave.net/7BSdsML77_UihdbeCQqTNfAOH_SENqNCwk7ykIYekVI" alt="Keys" className="w-8" />{" "}
          <span style={{ fontSize: `${28 * scale}px` }}>Heart pieces found {user.special_item_heart}/4</span>
        </div>
        <div className="self-start text-center mx-auto flex flex-col items-center gap-2">
          <h3 style={{ fontSize: `${28 * scale}px`, color: "#E19A4C" }}>Reward:</h3>
          <img src="https://arweave.net/K9wOeOpS68Pq-k2Wy9kt8VBXYd2RYUJa-556BKMBtzI" alt="Heart" className="w-8" />
        </div>
      </div>
    );
  };

  const ThreadQuest = () => {
    return (
      <div className="grid grid-rows-[50%_20%_20%] h-full">
        <div>
          <h2 style={{ fontSize: `${32 * scale}px` }} className="text-2xl mb-2 underline">
            Long Lost Cloak
          </h2>
          <p style={{ fontSize: `${24 * scale}px` }}>
            The Dum at the NFT shop said his shipment of thread got lost on the trail to the village. He said if we can find all the pieces he may possibly fashion us a cloak of
            unknown power.
          </p>
        </div>
        <div className="self-start flex items-center justify-center gap-2 text-center mx-auto">
          <img src="https://arweave.net/slDkc2nmkAVhvU5BQ_4TfV9OYwkZdg6cxyaLZNJ53DY" alt="Magic Thread" className="w-8" />{" "}
          <span style={{ fontSize: `${28 * scale}px` }}>Magical Thread {user.special_item_thread}/8</span>
        </div>
        <div className="self-start">
          <h3 style={{ fontSize: `${28 * scale}px`, color: "#E19A4C" }}>Reward:</h3>
          <p style={{ fontSize: `${24 * scale}px` }}>Magical Thread is used to buy the Magical Cloak in the NFT Holder Shop</p>
        </div>
      </div>
    );
  };

  const WoodQuest = () => {
    return (
      <div className="grid grid-rows-[50%_20%_20%] h-full">
        <div>
          <h2 style={{ fontSize: `${32 * scale}px` }} className="text-2xl mb-2 underline">
            Whispers of the woods
          </h2>
          <p style={{ fontSize: `${24 * scale}px` }}>
            The Dum at the Weapon shop told us the whereabouts of a special type of wood to make the wand of resilience. We must find teh sacred tree that holds these pieces.
          </p>
        </div>
        <div className="self-start flex items-center justify-center gap-2 text-center mx-auto">
          <img src="https://arweave.net/oOEo5x6rkk4CZeres-uW0pGpv0HTR8_O0Jjax49dfVM" alt="Wood" className="w-6" />{" "}
          <span style={{ fontSize: `${28 * scale}px` }}>Wood Core {user.special_item_bark}/8</span>
        </div>
        <div className="self-start">
          <h3 style={{ fontSize: `${28 * scale}px`, color: "#E19A4C" }}>Reward:</h3>
          <p style={{ fontSize: `${24 * scale}px` }}>Wood Core is used to buy the Wand in the NFT Holder Shop</p>
        </div>
      </div>
    );
  };

  function MissingKittenQuest() {
    return (
      <div className="grid grid-rows-[50%_20%_20%] h-full">
        <div>
          <h2 style={{ fontSize: `${32 * scale}px` }} className="text-2xl mb-2 underline">
            Curious Disappearance
          </h2>
          <p style={{ fontSize: `${24 * scale}px` }}>
            The denkepper asked if we could find his missing cat. Apparently it took off in the middle of the night and is nowhere to be found.
          </p>
          <p>Maybe he was stolen?</p>
        </div>
        <div className="self-start flex items-center justify-center gap-2 text-center mx-auto">
          <img src="https://arweave.net/HSPJhQZXZnZyiI7_eJW4OMCmOby70lR7BCd69qszBeQ" alt="Keys" className="w-8" />{" "}
          <span style={{ fontSize: `${28 * scale}px` }}>Missing Cat {user.special_item_kitten}/1</span>
        </div>
        <div className="self-start text-center mx-auto flex flex-col items-center gap-2">
          <h3 style={{ fontSize: `${28 * scale}px`, color: "#E19A4C" }}>Reward:</h3>
          <div className="flex items-start gap-2 content-start">
            <p>10,000</p>
            <img src={IMAGES.GOLD_ICON} alt="gold" className="w-5" />
          </div>
        </div>
      </div>
    );
  }

  const startedQuests = [] as React.ReactNode[];
  if (user.special_item_key > -1) startedQuests.push(<BankKeysQuest />);
  if (user.special_item_heart > -1) startedQuests.push(<HeartQuest />);
  if (user.special_item_thread > -1) startedQuests.push(<ThreadQuest />);
  if (user.special_item_bark > -1) startedQuests.push(<WoodQuest />);
  if (user.special_item_kitten > -1) startedQuests.push(<MissingKittenQuest />);

  // Create pairs of quests for left and right pages
  const quests = Array.from({ length: Math.ceil(startedQuests.length / 2) }, (_, index) => ({
    leftPage: startedQuests[index * 2] || <div></div>,
    rightPage: startedQuests[index * 2 + 1] || <div></div>,
  }));

  // Add an empty page if there are no quests
  if (quests.length === 0) {
    quests.push({
      leftPage: <div></div>,
      rightPage: <div></div>,
    });
  }

  const handleTurnPage = (direction: "next" | "prev") => {
    if (direction === "next" && currentPage < quests.length - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const containerAspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        const imageAspect = 1461 / 952;
        setScale(containerAspect > imageAspect ? containerRef.current.clientHeight / 952 : containerRef.current.clientWidth / 1461);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={containerRef} className="relative w-[90vw] h-[90vh] flex items-center justify-center">
        <div
          className="relative"
          style={{
            width: `${1461 * scale}px`,
            height: `${952 * scale}px`,
          }}
        >
          {/* Quest book background image */}
          <img src="https://arweave.net/absE2mgCsJ4c-nQS0G0U5IF2xltG_DvjNrXCbzlk7pc" alt="Quest Book" className="w-full h-full object-contain" />

          {/* Close button */}
          <button
            className="absolute top-[3%] right-[12%] z-10 cursor-pointer"
            style={{
              width: `${58 * scale}px`,
              height: `${58 * scale}px`,
              backgroundImage: `url(https://arweave.net/1r7IwcP8t-Cj3nZBbR8cPYVRNcIkglKW6IMf2ka4TYo)`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
            onClick={() => setQuestBookOpen(false)}
          />

          <div className="absolute top-[5%] left-[15%] flex justify-between">
            <h2 className="text-5xl underline mb-2">Quest Log</h2>
          </div>

          {/* Quest text */}
          <div className="absolute top-[18%] left-[11%] right-[13%] bottom-[15%] flex justify-between gap-20">
            <div className="w-[46%] overflow-y-auto text-xl text-center" style={{ fontSize: `${28 * scale}px` }}>
              {quests[currentPage].leftPage}
            </div>
            <div className="w-[46%] overflow-y-auto text-xl text-center" style={{ fontSize: `${28 * scale}px` }}>
              {quests[currentPage].rightPage}
            </div>
          </div>

          {/* Page turn arrows */}
          <ImgButton
            src="https://arweave.net/SKu9BObCHuN4lJVIa9tnP7R4OzwikZzDw1C-ALSIP30"
            alt="Previous Page"
            disabled={currentPage === 0}
            className="absolute bottom-[20%] left-[12%]"
            onClick={() => handleTurnPage("prev")}
          />
          <ImgButton
            src="https://arweave.net/oLYsRSefknK9vSDBVcZ8-NGOXzu9JFZxxiU-BnkY6Pc"
            alt="Next Page"
            disabled={currentPage === quests.length - 1}
            className="absolute bottom-[20%] right-[12%]"
            onClick={() => handleTurnPage("next")}
          />
        </div>
      </div>
    </div>
  );
}
