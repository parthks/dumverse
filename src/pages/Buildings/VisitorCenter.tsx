import ExistToTownButton from "@/components/buildings/ExistToTownButton";
import useBuildingMusic from "@/components/buildings/useBuildingMusic";

export default function VisitorCenter() {
  useBuildingMusic({});

  return (
    <div className="h-screen relative">
      <div className="z-10 absolute bottom-4 left-4">
        <ExistToTownButton />
      </div>
      {/* <div className="z-10 absolute bottom-4 right-4">
        <InventoryBag />
      </div> */}
      <div className="absolute inset-0">
        <img src={"https://arweave.net/feD7pI2mLW1GlbkklXV3gmypekkFFxaBRzWsjPYRlSU"} alt="Visitor Center Background" className="w-full h-full object-cover" />
      </div>
      {/* White Board */}
      <div
        className="relative bg-contain bg-center bg-no-repeat w-full max-w-xl ml-4 p-8"
        style={{ backgroundImage: "url('https://arweave.net/ZWcNIcAHxcHc6pFhaelZh8kSbtbF3mPDK6sI3y_95vM')", aspectRatio: "1784/1035" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center m-4">
          {/* <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome to</h1> */}
          <h2 className="text-lg md:text-xl text-center mt-9 underline">Welcome to Dumverse!</h2>
          <p className="text-base md:text-lg text-center mt-1 underline">Enjoy your stay!</p>

          <div className="grid grid-cols-2 gap-x-52 w-max mx-auto text-sm">
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
              <h3 className="font-semibold text-md mt-2 underline ml-6">Q2</h3>
              <p className="mt-2">Cascade 4</p>
              <p>Cascade 5</p>
              <p>Cascade 6</p>
            </div>

            <div className="text-left w-fit">
              <h3 className="font-semibold text-md mt-2 underline ml-6">Q3</h3>
              <p className="mt-2">Cascade 7</p>
              <p>Cascade 8</p>
              <p>Cascade 9</p>
            </div>

            <div className="text-left w-fit">
              <h3 className="font-semibold text-md mt-2 underline ml-6">Q4</h3>
              <p className="mt-2">Cascade 10</p>
              <p>Cascade 11</p>
              <p>Cascade 12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="absolute bottom-[0px] left-[0px] bg-contain bg-center bg-no-repeat w-[400px] max-w-xl ml-4 p-8"
        style={{ backgroundImage: "url('https://arweave.net/iGgg4X_Mb9xWoropvHjqaplkmT1SXwFUE6ejSuhE2eM')", aspectRatio: "918/1080" }}
      >
        <div className="absolute w-[200px] m-auto inset-0 flex flex-col items-center justify-center text-white">
          {/* <h1 className="text-2xl md:text-3xl font-bold text-center">Welcome to</h1> */}
          <h2 className="text-lg md:text-lg text-center mt-40 underline">Entry Fees:</h2>
          <p className="text-base md:text-lg text-center mt-1 underline">.1984 wAR for Dumz</p>
          <p className="text-base md:text-lg text-center mt-1 underline">.3968 wAR for non residents</p>
        </div>
      </div>

      <img
        src={"https://arweave.net/iYOoke2OfHWqXtW67cjHIhM7ChTnnV8PRL6S2BY-A-c"}
        alt="Window Frame"
        style={{ transform: "translate(-100%, 0%)" }}
        className="absolute top-[0%] left-[100%] w-[20%] h-auto"
      />

      <div className="absolute left-[500px] inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <img
            src={"https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"}
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[0%] w-[20%] h-auto"
          />
          <img
            src={"https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"}
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[25%] w-[20%] h-auto"
          />
          <img
            src={"https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"}
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[50%] w-[20%] h-auto"
          />
          <img
            src={"https://arweave.net/SnIUR_P7GXlwEPX0Dl74rGTmXQczbQ0hRY48G_uB5bo"}
            alt="Stage"
            style={{ transform: "translate(0%, 0%)" }}
            className="absolute bottom-[0] left-[75%] w-[20%] h-auto"
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
