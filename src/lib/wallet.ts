import { createDataItemSigner, dryrun, message, result } from "./aoConnection";
import { COMBAT_PROCESS_ID, GAME_PROCESS_ID, CHAT_PROCESS_ID, DUMZ_TOKEN_PROCESS_ID, TRUNK_TOKEN_PROCESS_ID , BANK_PROCESS_ID, BLACKJACK_PROCESS_ID} from "./utils";
import { MessageResult } from "@permaweb/aoconnect/dist/lib/result";

export type MyMessageResult = MessageResult & {
  data: Record<string, any>;
  status?: "Success" | "Error";
};

type Process = "game" | "combat" | "chat" | "dumz_token" | "trunk_token" | string;

function getProcessId(process: Process) {
  return process === "chat"
    ? CHAT_PROCESS_ID
    : process === "bank"
    ? BANK_PROCESS_ID
    : process === "combat"
    ? COMBAT_PROCESS_ID
    : process === "dumz_token"
    ? DUMZ_TOKEN_PROCESS_ID
    : process === "trunk_token"
    ? TRUNK_TOKEN_PROCESS_ID 
    : process === "game"
    ? GAME_PROCESS_ID
    : process === "blackjack"
    ? BLACKJACK_PROCESS_ID
    : process;
}

export async function sendAndReceiveGameMessage({ tags, data, process = "game" }: { tags: { name: string; value: string }[]; data?: string; process?: Process }) {
  const processId = getProcessId(process);
  console.log("adada: "+ processId);
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

export async function sendDryRunGameMessage({ tags, process = "game" }: { tags: { name: string; value: string }[]; process?: Process }) {
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

  if (resultData.Messages?.length > 0) {
    const message = resultData.Messages[0];
    const tags = message.Tags;
    const status = tags.find((tag: { name: string; value: string }) => tag.name === "Status")?.value;
    let data = null;
    try {
      data = message.Data ? JSON.parse(message.Data) : {};
    } catch (e) {
      console.log("error parsing data", e);
    }

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

export async function pollForTransferSuccess(process: Process, onSuccessCheck: (messageTags: { name: string; value: string }[]) => boolean) {
  const processId = getProcessId(process);
  const url = `https://cu.ao-testnet.xyz/results/${processId}?sort=DESC`;

  try {
    let successFound = false;
    let attempts = 0;

    // Poll for a limited number of attempts (e.g., 10 attempts)
    while (!successFound && attempts < 10) {
      const response = await fetch(url);
      const result = await response.json();

      console.log("result", result);

      // Check if Transfer-Success message is in the result
      const transferSuccess = result.edges.find((edge: { node: { Messages: any[] } }) => {
        // Ensure that the edge has Messages and that Messages array is not empty
        if (edge.node.Messages && edge.node.Messages.length > 0) {
          for (let message of edge.node.Messages) {
            const messageTags = message.Tags;
            if (onSuccessCheck(messageTags)) {
              return true; // Found a successful message
            }
          }
          // return messageTags.some((tag: { name: string; value: string }) => tag.name === "Action" && tag.value === "Transfer-Success");
        }
        return false;
      });

      if (transferSuccess) {
        console.log("Transfer-Success message found:", transferSuccess);
        successFound = true;

        return true; // Success
      }

      // Wait for a few seconds before polling again
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 3 seconds
      attempts++;
    }

    return false; // Failed to find Transfer-Success message
  } catch (error) {
    console.error("Error polling Transfer-Success:", error);
    return false;
  }
}
