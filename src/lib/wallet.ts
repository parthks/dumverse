import { result, results, message, spawn, monitor, unmonitor, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import { COMBAT_PROCESS_ID, GAME_PROCESS_ID, CHAT_PROCESS_ID } from "./utils";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export type MyMessageResult = MessageResult & {
  data: Record<string, any>;
  status?: "Success" | "Error";
};

type Process = "game" | "combat" | "chat";

function getProcessId(process: Process) {
  return process === "chat" ? CHAT_PROCESS_ID : process === "combat" ? COMBAT_PROCESS_ID : GAME_PROCESS_ID;
}

export async function sendAndReceiveGameMessage(tags: { name: string; value: string }[], data: string = "", process: Process = "game") {
  const processId = getProcessId(process);
  const action = tags.find((tag) => tag.name === "Action")?.value;
  console.log("sending message:" + action, { tags, data });
  const res = await message({
    process: processId,
    tags: tags,
    data: data,
    signer: createDataItemSigner(window.arweaveWallet),
  });
  let resultData = (await result({
    message: res,
    process: processId,
  })) as MessageResult;

  console.log("got result: " + action, { resultData });
  return handleResultData(resultData);
}

export async function sendDryRunGameMessage(tags: { name: string; value: string }[], process: Process = "game") {
  const processId = getProcessId(process);
  const action = tags.find((tag) => tag.name === "Action")?.value;
  console.log("sending dry run message:" + action, { tags });
  const resultData = (await dryrun({
    process: processId,
    tags: tags,
    signer: createDataItemSigner(window.arweaveWallet),
  })) as MessageResult;

  console.log("got result: " + action, { resultData });
  return handleResultData(resultData);
}

function handleResultData(resultData: MessageResult): MyMessageResult {
  const newResultData = { ...resultData, data: {}, status: undefined } as MyMessageResult;

  if (resultData.Messages.length > 0) {
    const message = resultData.Messages[0];
    const tags = message.Tags;
    const status = tags.find((tag: { name: string; value: string }) => tag.name === "Status")?.value;
    const data = message.Data ? JSON.parse(message.Data) : {};
    newResultData.data = data;
    if (status) {
      newResultData.status = status;
      if (status === "Success") {
        return newResultData;
      } else {
        // throw new Error(data.message);
        // TODO: show error notification toast
      }
    } else {
      // TODO: can check for assert errors here
    }
  }
  return newResultData;
}
