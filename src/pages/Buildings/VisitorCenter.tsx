import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import { RiveAnimation } from "@/components/buildings/RiveShopkeeper";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";
import GifComponent from "@/components/Dialogue/Dialogue";
import { BUILDING_IMAGES } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";
import { useState, useEffect } from "react";

export default function VisitorCenter() {
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const { getTotalUsers } = useGameStore();

  useBuildingMusic({});

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchUsers = async () => {
      const users = await getTotalUsers();
      setTotalUsers(users);
    };

    fetchUsers(); 
    intervalId = setInterval(fetchUsers, 6000);

    return () => clearInterval(intervalId);
  }, [getTotalUsers]);

  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="absolute inset-0">
        <img
          src={
            "https://arweave.net/feD7pI2mLW1GlbkklXV3gmypekkFFxaBRzWsjPYRlSU"
          }
          alt="Visitor Center Background"
          className="w-full h-full object-cover"
        />
      </div>
      {/* White Board */}
      <div
        className="relative bg-contain bg-center bg-no-repeat w-full max-w-xl ml-4 p-8"
        style={{
          backgroundImage:
            "url('https://arweave.net/ZWcNIcAHxcHc6pFhaelZh8kSbtbF3mPDK6sI3y_95vM')",
          aspectRatio: "1784/1035",
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center m-4">
          {/* <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome to</h1> */}
          <h2 className="text-lg md:text-xl text-center mt-9 underline">
            Welcome to Dumverse!
          </h2>
          {/* <p className="text-base md:text-lg text-center mt-1 underline">Enjoy your stay!</p> */}
          {/* w-max mx-auto */}
          <div className="w-full text-sm flex flex-row items-center px-3 space-x-4">
            <div className="flex flex-row items-center justify-center w-[50%] bg-white p-2 rounded-3xl border-8 border-[#6e7275]">
              <div className="grid grid-cols-2 gap-x-8">
                <div className="text-left w-fit">
                  <h3 className="font-semibold mt-2 underline ml-6">Q1</h3>
                  <div className="mt-2 flex space-x-2">
                    <p>Cascade 1</p>
                    <span className="text-green-500">✔</span>
                  </div>
                  <p>Cascade 2</p>
                  <p>Cascade 3</p>
                </div>

                <div className="text-left w-fit">
                  <h3 className="font-semibold text-md mt-2 underline ml-6">
                    Q2
                  </h3>
                  <p className="mt-2">Cascade 4</p>
                  <p>Cascade 5</p>
                  <p>Cascade 6</p>
                </div>

                <div className="text-left w-fit">
                  <h3 className="font-semibold text-md mt-2 underline ml-6">
                    Q3
                  </h3>
                  <p className="mt-2">Cascade 7</p>
                  <p>Cascade 8</p>
                  <p>Cascade 9</p>
                </div>

                <div className="text-left w-fit">
                  <h3 className="font-semibold text-md mt-2 underline ml-6">
                    Q4
                  </h3>
                  <p className="mt-2">Cascade 10</p>
                  <p>Cascade 11</p>
                  <p>Cascade 12</p>
                </div>
              </div>
            </div>

            <div className="w-[50%] bg-white p-1 rounded-3xl border-8 border-[#6e7275] text-lg md:text-xl flex flex-col items-center gap-3">
              <h1 className="  text-center underline">
                Dumverse Resident Count
              </h1>
              <h1>{totalUsers} </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-[0px] left-[0px]">
        {/* Table */}
        <div
          className="relative bottom-[0px] left-[0px] bg-contain bg-center bg-no-repeat w-[400px] max-w-xl ml-4 p-8"
          style={{
            zIndex: 2,
            backgroundImage:
              "url('https://arweave.net/iGgg4X_Mb9xWoropvHjqaplkmT1SXwFUE6ejSuhE2eM')",
            aspectRatio: "918/1080",
          }}
        >
          <div className="absolute w-[200px] m-auto inset-0 flex flex-col items-center justify-center text-white">
            <h2 className="text-lg md:text-lg text-center mt-40 underline">
              Entry Fees:
            </h2>
            <p className="text-base md:text-lg text-center mt-1 underline">
              .1984 wAR for Dumz
            </p>
            <p className="text-base md:text-lg text-center mt-1 underline">
              .3968 wAR for non residents
            </p>
          </div>
        </div>

        {/* Shopkeeper */}
        <div
          className="absolute"
          style={{
            maxWidth: "11vw",
            width: "100%",
            left: "calc(50% - 5.5vw)",
            top: "25px", // Adjust this value to fine-tune the vertical position
            aspectRatio: 1,
            zIndex: 1, // This ensures the shopkeeper is behind the table
          }}
        >
          <RiveAnimation
            url={BUILDING_IMAGES.VISITOR_CENTER_HALL_FAME_DUMDUM}
          />
        </div>
        <GifComponent className="absolute h-[20vh] translate-x-[15vw] translate-y-[-56vh]" />
      </div>

      {/* sign */}
      <img
        src={"https://arweave.net/PeSGv6_5015F9ol8zmgXXXnALvP3qELuZtXcONOPzK0"}
        alt="Visitor Center Sign"
        style={{ transform: "translate(0%, -100%)" }}
        className="absolute top-[100%] left-[410px] w-[10%] h-auto"
      />

      <img
        src={"https://arweave.net/iYOoke2OfHWqXtW67cjHIhM7ChTnnV8PRL6S2BY-A-c"}
        alt="Window Frame"
        style={{ transform: "translate(-100%, 0%)" }}
        className="absolute top-[0%] left-[100%] w-[15%] h-auto"
      />

      <div className="absolute left-[550px] inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src={
              "https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"
            }
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[0%] w-[25%] h-auto"
          />
          <img
            src={
              "https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"
            }
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[25%] w-[25%] h-auto"
          />
          <img
            src={
              "https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"
            }
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[50%] w-[25%] h-auto"
          />
          <img
            src={
              "https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"
            }
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[75%] w-[25%] h-auto"
          />
        </div>
      </div>

      {/* <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full max-w-[177.78vh] max-h-[56.25vw]"> */}
      {/* Town map image */}
      {/* <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain"
            style={{
              //   backgroundImage: `url(https://arweave.net/feD7pI2mLW1GlbkklXV3gmypekkFFxaBRzWsjPYRlSU)`,
              background: "rgb(0, 0, 0, 0)",
            }}
          > */}
      {/* <img
              src={"https://arweave.net/iYOoke2OfHWqXtW67cjHIhM7ChTnnV8PRL6S2BY-A-c"}
              alt="Window Frame"
              style={{ transform: "translate(-100%, 0%)" }}
              className="absolute top-[0%] left-[100%] w-[15%] h-auto"
            /> */}
      {/* </div> */}
      {/* </div>
      </div> */}
    </div>
  );
}
