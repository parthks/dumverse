import { result, results, message, spawn, monitor, unmonitor, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import { GAME_PROCESS_ID } from "./utils";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

type MyMessageResult = MessageResult & {
  data: Record<string, any>;
  status?: "Success" | "Error";
};

export async function sendAndReceiveGameMessage(tags: { name: string; value: string }[], process?: string) {
  console.log("sending message", { tags });
  const res = await message({
    process: process || GAME_PROCESS_ID,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet),
  });
  let resultData = (await result({
    message: res,
    process: GAME_PROCESS_ID,
  })) as MyMessageResult;

  return handleResultData(resultData);
}

export async function sendDryRunGameMessage(tags: { name: string; value: string }[], process?: string) {
  console.log("sending dry run message", { tags });
  const resultData = (await dryrun({
    process: process || GAME_PROCESS_ID,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet),
  })) as MyMessageResult;

  return handleResultData(resultData);
}

function handleResultData(resultData: MyMessageResult) {
  console.log("got result", { resultData });
  if (resultData.Messages.length > 0 && resultData.Messages[0].Data) {
    const message = resultData.Messages[0];
    const data = JSON.parse(message.Data);
    resultData.data = data;
    if (message.Status) {
      resultData.status = message.Status;
      if (message.Status === "Success") {
        return resultData;
      } else {
        // throw new Error(data.message);
        // TODO: show error notification toast
      }
    } else {
      // TODO: can check for assert errors here
    }
  }
  return resultData;
}
