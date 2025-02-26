import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import GifComponent from "@/components/Dialogue/Dialogue";
import { BUILDING_IMAGES } from "@/lib/constants";
import { calculatePositionAndSize } from "@/lib/utils";
import { useGameStore } from "@/store/useGameStore";
import ImgButton from "../../components/ui/imgButton";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLeaderboardStore } from "@/store/useLeaderboardStore";

export default function HallOfFame() {
  useBuildingMusic({});

  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const HallOfFameLeaderboardData = useLeaderboardStore(
    (state) => state.HallOfFameLeaderboardData
  );
  // const getParticularLeaderboardData = useLeaderboardStore(
  //   (state) => state.getParticularLeaderboardData
  // );
  const topThreePlayerInfo = useLeaderboardStore((state) => state.topThreePlayerInfo);

  const { goldEarnedLeaderboardInfo } = useLeaderboardStore();

  const { data: fetchedData = [], isFetching } = useQuery({
    queryKey: ["leaderboardData"],
    queryFn: async () => {
      try {
        // const leaderboardMetrics = [
        //   "battle_win",
        //   "gold_earned",
        //   "player_death",
        // ];

        // const results = await Promise.all(
        //   leaderboardMetrics.map((metric) =>
        //     getParticularLeaderboardData(metric)
        //   )
        // );
       await topThreePlayerInfo();
        // return results.filter(Boolean);
        return [];
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return [];
      }
    },
    refetchInterval: 3000,
    staleTime: 3000,
    enabled: !isLeaderboardOpen,
  });

  // -----------------------------------------------------------------

  return (
    <div className="h-screen relative">
      <div className="absolute bottom-[4vh] left-[4vw] z-10">
        <ExistToTownButton />
      </div>
      <div className="absolute w-[12%] bottom-[4vh] right-[4vw] z-10">
        <ImgButton
          src="https://arweave.net/nYTjNe4X9GAQjhFIHgMZmkS2pvco7JTAUHb338TOsfo"
          alt="Leaderboard"
          // disabled={currentPage === 0}
          // className="absolute bottom-[20%] left-[12%]"
          onClick={() => setIsLeaderboardOpen(true)}
        />
      </div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="absolute inset-0">
        <img
          src={
            "https://arweave.net/JGuoKPoYzOF3DJnEV4z7JURzu6as2Z_L99_a0DD5xZw"
          }
          alt="Hall of Fame Background"
          className="w-full h-full object-cover"
        />
      </div>

      <img
        src="https://arweave.net/3VaXHnefkV1QW875cuPZUkObeUw1OxXHNm_f9oSJz9k"
        alt="Poles"
        className="absolute"
        style={{
          ...calculatePositionAndSize(50, 70, 85),
          transform: "translate(-50%, -50%)",
        }}
      />

      <div
        className="absolute w-full z-10 flex flex-col items-center justify-end"
        style={{
          width: "35vw",
          height: "30vh",
          bottom: "0vh",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {/* Shopkeeper and Table Group */}
        <div className="relative w-full flex flex-col items-center">
          {/* Shopkeeper */}
          <div
            className="relative "
            style={{
              maxWidth: "15vw",
              width: "15vw",
              aspectRatio: "1", // Ensures square dimensions
              top: "2vh",
            }}
          >
            <RiveAnimation
              url={BUILDING_IMAGES.VISITOR_CENTER_HALL_FAME_DUMDUM}
            />
          </div>
          <GifComponent className=" absolute h-[20vh] translate-x-[12vw] translate-y-[-5vh] " />

          {/* Shop Table */}
          <img
            src="https://arweave.net/TO0hx4HWRPaDyGyxaXbEsMAuyHlxo_cHQxO_rByNhQ4"
            alt="Shop Table"
            className=" w-full relative "
            style={{ height: "auto" }}
          />
        </div>
      </div>

      {/* <div className="absolute" style={{ ...calculatePositionAndSize(50, 100, 30), transform: "translate(-50%, -100%)" }}>
        <img src="https://arweave.net/g2i08NVCRWFbwGflpf4S7b6M2LwRwScnEK6N6chVCMM" alt="Shop Table" className="absolute bottom-0" style={{ width: "100%", height: "auto" }} />
        <img
          src={BUILDING_IMAGES.GREEN_SHOPKEEPER}
          alt="Shop Keeper"
          className="absolute"
          style={{ left: "50%", width: "30%", height: "auto", transform: "translate(-50%, -202%)" }}
        />
      </div> */}

      <Frame
        index={1}
        nft_address={HallOfFameLeaderboardData.gold_earned?.nft_address || null}
        name={HallOfFameLeaderboardData.gold_earned?.name}
        category="Gold Earned"
      />
      <Frame
        index={2}
        nft_address={HallOfFameLeaderboardData.battle_win?.nft_address || null}
        name={HallOfFameLeaderboardData.battle_win?.name}
        category="Battles Won"
      />
      <Frame
        index={3}
        nft_address={HallOfFameLeaderboardData.player_death?.nft_address || null}
        name={HallOfFameLeaderboardData.player_death?.name}
        category="Deaths"
      />

      {isLeaderboardOpen && (
        <LeaderboardPopup onClose={() => setIsLeaderboardOpen(false)} />
      )}
    </div>
  );
}

function Frame({
  index,
  nft_address,
  name,
  category,
}: {
  index: number;
  nft_address?: string | null;
  name?: string;
  category?: string;
}) {
  const user = useGameStore((state) => state.user);

  // Calculate position based on index
  const topPosition = index === 1 ? "5%" : index === 2 ? "0%" : "5%";
  const leftPosition = index === 1 ? "2%" : index === 2 ? "50%" : "98%";
  const translateX = index === 1 ? "0" : index === 2 ? "-50%" : "-100%";

  // Determine size adjustments for NULL addresses
  const isNullAddress = nft_address === null;
  const imageStyle: React.CSSProperties = isNullAddress
    ? { objectFit: "contain" } // Add padding to avoid cropping
    : { objectFit: "cover" }; // Normal styling for non-NULL addresses

  return (
    <div
      className={`absolute top-[${topPosition}]`}
      style={{
        width: "20vw", // Reduced frame size
        aspectRatio: "768 / 899",
        transform: `translateX(${translateX})`,
        left: leftPosition,
      }}
    >
      {/* Frame background */}
      <img
        src="https://arweave.net/6swKthAqLMd_BmWScSz7Tm6en5IyKnJRa4bvQhlIMEQ"
        alt="Frame"
        className="absolute inset-0 w-full h-full z-10 object-cover"
      />

      {/* Container for the image inside the frame */}
      <div className="absolute top-[17%] left-[26%] w-[53%] h-[50%]">
        <img
          src={
            nft_address !== null
              ? `https://arweave.net/${nft_address}`
              : "https://arweave.net/dT-wfl5Yxz_HfgpH2xBi3f-nLFKVOixRnSjjXt1mcGY"
          }
          alt="Content Image"
          className="w-full h-[120%]" // Adjusted size to fit content properly
          style={imageStyle}
        />
      </div>

      {/* Container for the text in the bottom box */}
      <div
        className="absolute z-10 flex flex-col items-center justify-center text-center"
        style={{
          bottom: "8.5%",
          left: "51.9%",
          width: "40%",
          height: "20%", // Increased height to center text better
          transform: "translateX(-50%)",
        }}
      >
        <p className="text-white text-lg font-bold underline">{name}</p>{" "}
        {/* Font size adjusted */}
        <p className="text-white text-sm font-bold">1st in {category}</p>{" "}
        {/* Font size adjusted */}
      </div>
    </div>
  );
}

const LeaderboardPopup = ({ onClose }: { onClose: () => void }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [leaderboardType, setLeaderboardType] = useState("player_profile");
  const [isLoadingLocal, setIsLoadingLocal] = useState(false); // Separate loading state

  const leaderboardPages = [
    "player_profile",
    "gold_earned",
    "gold_lost",
    "dumz_lost",
    "battle_win",
    "battle_lost",
    "enemy_killed",
    "player_death",
    "death_streak",
    "gold_win_in_pvp",
    "dumz_win_in_pvp",
    "pvp_wins",
  ];

  const LeaderboardData = useLeaderboardStore((state) => state.LeaderboardData);
  const PlayerLeaderboardProfileData = useLeaderboardStore(
    (state) => state.PlayerLeaderboardProfileData
  );
  const GoldEarnedLeaderboardData = useLeaderboardStore(
    (state) => state.GoldEarnedLeaderboardData
  );
  const GoldLostLeaderboardData = useLeaderboardStore(
    (state) => state.GoldLostLeaderboardData
  );
  const DumzLostLeaderboardData = useLeaderboardStore(
    (state) => state.DumzLostLeaderboardData
  );
  const BattleWinLeaderboardData = useLeaderboardStore(
    (state) => state.BattleWinLeaderboardData
  );
  const BattleLostLeaderboardData = useLeaderboardStore(
    (state) => state.BattleLostLeaderboardData
  );
  const EnemiesKilledLeaderboardData = useLeaderboardStore(
    (state) => state.EnemiesKilledLeaderboardData
  );
  const PlayerDeathLeaderboardData = useLeaderboardStore(
    (state) => state.PlayerDeathLeaderboardData
  );
  const DeathStreakLeaderboardData = useLeaderboardStore(
    (state) => state.DeathStreakLeaderboardData
  );
  const GoldWinInPvPLeaderboardData = useLeaderboardStore(
    (state) => state.GoldWinInPvPLeaderboardData
  );
  const DumzWinInPvPLeaderboardData = useLeaderboardStore(
    (state) => state.DumzWinInPvPLeaderboardData
  );
  const PvpWinLeaderboardData = useLeaderboardStore(
    (state) => state.PvpWinLeaderboardData
  );

  // const getParticularLeaderboardData = useLeaderboardStore(
  //   (state) => state.getParticularLeaderboardData
  // );
  const {
    playerLeaderboardProfileInfo,
    goldEarnedLeaderboardInfo,
    goldLostLeaderboardInfo,
    dumzLostLeaderboardInfo,
    battleWinLeaderboardInfo,
    battleLostLeaderboardInfo,
    enemiesKilledLeaderboardInfo,
    playerDeathLeaderboardInfo,
    deathStreakLeaderboardInfo,
    goldWinInPvPLeaderboardInfo,
    dumzWinInPvPLeaderboardInfo,
    pvpWinLeaderboardInfo,
  } = useLeaderboardStore();

  const { data: fetchedData = [], isFetching } = useQuery({
    queryKey: ["leaderboardData", leaderboardType, currentPage],
    queryFn: async () => {
      try {
        // await getParticularLeaderboardData(leaderboardType);
        if (leaderboardType == "player_profile")
          await playerLeaderboardProfileInfo();
        if (leaderboardType == "gold_earned") await goldEarnedLeaderboardInfo();
        if (leaderboardType == "gold_lost") await goldLostLeaderboardInfo();
        if (leaderboardType == "dumz_lost") await dumzLostLeaderboardInfo();
        if (leaderboardType == "battle_win") await battleWinLeaderboardInfo();
        if (leaderboardType == "battle_lost") await battleLostLeaderboardInfo();
        if (leaderboardType == "enemy_killed")
          await enemiesKilledLeaderboardInfo();
        if (leaderboardType == "player_death")
          await playerDeathLeaderboardInfo();
        if (leaderboardType == "death_streak")
          await deathStreakLeaderboardInfo();
        if (leaderboardType == "gold_win_in_pvp")
          await goldWinInPvPLeaderboardInfo();
        if (leaderboardType == "dumz_win_in_pvp")
          await dumzWinInPvPLeaderboardInfo();
        if (leaderboardType == "pvp_wins") await pvpWinLeaderboardInfo();
        return [];
      } catch (error) {
        return [];
      }
    },
    refetchInterval: 3000,
    staleTime: 3000,
  });

  const handleTurnPage = (direction: "prev" | "next") => {
    if (isLoadingLocal) return; // Prevent turning pages while loading

    let newPage = currentPage; // Keep the current page value

    if (direction === "next") {
      const nextIndex = leaderboardPages.indexOf(leaderboardType) + 1;
      setLeaderboardType(
        nextIndex >= leaderboardPages.length
          ? leaderboardPages[0]
          : leaderboardPages[nextIndex]
      );
      newPage = 0; // Reset page to 0 when moving to the next type
    } else {
      const prevIndex = leaderboardPages.indexOf(leaderboardType) - 1;
      setLeaderboardType(
        prevIndex < 0
          ? leaderboardPages[leaderboardPages.length - 1]
          : leaderboardPages[prevIndex]
      );
      newPage = 0; // Reset page to 0 when moving to the previous type
    }

    setCurrentPage(newPage); // Update current page
  };

  const getLeaderboardTitle = (type: string): string => {
    switch (type) {
      case "player_profile":
        return "Player Profile";
      case "gold_earned":
        return "Gold Earned";
      case "gold_lost":
        return "Gold Lost";
      case "dumz_lost":
        return "$DUMZ Lost";
      case "battle_win":
        return "Battles Won";
      case "battle_lost":
        return "Battles Lost";
      case "enemy_killed":
        return "Enemies Killed";
      case "player_death":
        return "Player Death";
      case "death_streak":
        return "Death Streak";
      case "gold_win_in_pvp":
        return "Gold Won In PvP";
      case "dumz_win_in_pvp":
        return "$DUMZ Won In PvP";
      case "pvp_wins":
        return "PvP Won";
      default:
        return "Leaderboard";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen relative z-10">
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="relative w-[50vw] h-[75vh] max-w-4xl bg-[#3C3012] rounded-lg border-[25px] border-[#B8860B] shadow-2xl">
          {/* Header */}
          <div className="bg-[#B8860B] flex justify-between items-center px-3 py-3">
            <ImgButton
              src="https://arweave.net/SKu9BObCHuN4lJVIa9tnP7R4OzwikZzDw1C-ALSIP30"
              alt="Previous Page"
              disabled={isLoadingLocal}
              className="w-10 h-10 transition-transform transform hover:scale-110"
              onClick={() => handleTurnPage("prev")}
            />
            <h2 className="text-4xl underline underline-offset-1 font-bold text-black text-center flex-grow">
              {getLeaderboardTitle(leaderboardType)}
            </h2>
            <div className="flex items-center gap-3">
              <ImgButton
                src="https://arweave.net/oLYsRSefknK9vSDBVcZ8-NGOXzu9JFZxxiU-BnkY6Pc"
                alt="Next Page"
                disabled={isLoadingLocal}
                className="w-10 h-10 transition-transform transform hover:scale-110"
                onClick={() => handleTurnPage("next")}
              />
              <button
                className="text-black text-2xl font-bold transition-transform transform hover:scale-150"
                onClick={() => onClose()}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6 overflow-y-auto h-[calc(100%-64px)] bg-[#3C3012] rounded-b-lg scrollbar-thin scrollbar-thumb-[#B8860B]/80 scrollbar-track-[#3C3012]">
            {/* Header Row */}
            {/*
            <div className="grid grid-cols-2 gap-4 mb-6 border-b border-[#B8860B] pb-2">
              <div className="text-white text-4xl font-semibold">
                Player Name
              </div>
              <div className="text-white text-4xl font-semibold text-right">
                Count
              </div>
            </div>
            */}

            <div>
              {/* Leaderboard Rows */}
              {leaderboardType === "player_profile" ? (
                Array.isArray(PlayerLeaderboardProfileData) ? (
                  PlayerLeaderboardProfileData?.map(
                    (player: any, index: number) => {
                      return (
                        <div
                          key={`${leaderboardType}-${index}`}
                          className="transition-colors"
                        >
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Name
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.name}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Address
                            </span>
                            <span
                              className="text-white text-3xl font-medium text-right"
                              onClick={(e) => {
                                navigator.clipboard.writeText(player.address);
                              }}
                            >
                              {`${player.address.slice(
                                0,
                                3
                              )}...${player.address.slice(-4)}`}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              PVP
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.pvp_wins}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Enemy Killed
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.enemy_killed}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              $DUMZ Won In PvP
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.dumz_win_in_pvp}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Battle Lost
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.battle_lost}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              $DUMZ Lost
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.dumz_lost}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Battle Won
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.battle_win}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Gold Earned
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.gold_earned}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Gold Won In PvP
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.gold_win_in_pvp}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Gold Lost
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.gold_lost}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Player Death
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.player_death}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 py-3 rounded-lg hover:bg-[#B8860B]/30">
                            <span className="text-white text-3xl font-medium text-left">
                              Death Streak
                            </span>
                            <span className="text-white text-3xl font-medium text-right">
                              {player.death_streak}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  )
                ) : (
                  <div>No data available</div>
                )
              ) : leaderboardType === "gold_earned" ? (
                GoldEarnedLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.gold_earned}
                      </div>
                    </div>
                  );
                })
              ) : leaderboardType === "gold_lost" ? (
                GoldLostLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.gold_lost}
                      </div>
                    </div>
                  );
                })
              ) : leaderboardType === "dumz_lost" ? (
                DumzLostLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.dumz_lost}
                      </div>
                    </div>
                  );
                })
              ) : leaderboardType === "battle_win" ? (
                BattleWinLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.battle_win}
                      </div>
                    </div>
                  );
                })
              ) : leaderboardType === "battle_lost" ? (
                BattleLostLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.battle_lost}
                      </div>
                    </div>
                  );
                })
              ) : leaderboardType === "enemy_killed" ? (
                EnemiesKilledLeaderboardData?.map(
                  (player: any, index: number) => {
                    return (
                      <div
                        key={`${leaderboardType}-${index}`}
                        className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                      >
                        <div className="text-white text-3xl font-medium">
                          {player.name}
                        </div>
                        <div className="text-white text-3xl font-medium text-right">
                          {player.enemy_killed}
                        </div>
                      </div>
                    );
                  }
                )
              ) : leaderboardType === "player_death" ? (
                PlayerDeathLeaderboardData?.map(
                  (player: any, index: number) => {
                    return (
                      <div
                        key={`${leaderboardType}-${index}`}
                        className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                      >
                        <div className="text-white text-3xl font-medium">
                          {player.name}
                        </div>
                        <div className="text-white text-3xl font-medium text-right">
                          {player.player_death}
                        </div>
                      </div>
                    );
                  }
                )
              ) : leaderboardType === "death_streak" ? (
                DeathStreakLeaderboardData?.map(
                  (player: any, index: number) => {
                    return (
                      <div
                        key={`${leaderboardType}-${index}`}
                        className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                      >
                        <div className="text-white text-3xl font-medium">
                          {player.name}
                        </div>
                        <div className="text-white text-3xl font-medium text-right">
                          {player.death_streak}
                        </div>
                      </div>
                    );
                  }
                )
              ) : leaderboardType === "gold_win_in_pvp" ? (
                GoldWinInPvPLeaderboardData?.map(
                  (player: any, index: number) => {
                    return (
                      <div
                        key={`${leaderboardType}-${index}`}
                        className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                      >
                        <div className="text-white text-3xl font-medium">
                          {player.name}
                        </div>
                        <div className="text-white text-3xl font-medium text-right">
                          {player.gold_win_in_pvp}
                        </div>
                      </div>
                    );
                  }
                )
              ) : leaderboardType === "dumz_win_in_pvp" ? (
                DumzWinInPvPLeaderboardData?.map(
                  (player: any, index: number) => {
                    return (
                      <div
                        key={`${leaderboardType}-${index}`}
                        className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                      >
                        <div className="text-white text-3xl font-medium">
                          {player.name}
                        </div>
                        <div className="text-white text-3xl font-medium text-right">
                          {player.dumz_win_in_pvp}
                        </div>
                      </div>
                    );
                  }
                )
              ) : (
                PvpWinLeaderboardData?.map((player: any, index: number) => {
                  return (
                    <div
                      key={`${leaderboardType}-${index}`}
                      className="grid grid-cols-2 gap-4 py-3 hover:bg-[#B8860B]/30 rounded-lg transition-colors"
                    >
                      <div className="text-white text-3xl font-medium">
                        {player.name}
                      </div>
                      <div className="text-white text-3xl font-medium text-right">
                        {player.pvp_wins}
                      </div>
                    </div>
                  );
                })
              ) }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
