import { result, results, message, spawn, monitor, unmonitor, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import { GAME_PROCESS_ID } from "./utils";

export async function sendAndReceiveGameMessage(tags: { name: string; value: string }[], process?: string) {
  console.log("sending message", { tags });
  const res = await message({
    process: process || GAME_PROCESS_ID,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet),
  });
  let resultData = await result({
    message: res,
    process: GAME_PROCESS_ID,
  });
  console.log("got result", { resultData });
  return resultData;
}

export async function sendDryRunGameMessage(tags: { name: string; value: string }[], process?: string) {
  console.log("sending dry run message", { tags });
  const res = await dryrun({
    process: process || GAME_PROCESS_ID,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet),
  });
  console.log("got dry run result", { res });
  return res;
}
