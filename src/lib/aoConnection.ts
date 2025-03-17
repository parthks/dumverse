import { connect, createDataItemSigner } from "@permaweb/aoconnect";

// Default configuration (NO external imports)
const AO_CONFIG = {
  MU_URL: "https://mu.ao-testnet.xyz",
  CU_URL: "https://cu.ao-testnet.xyz", // Primary CU
  GATEWAY_URL: "https://arweave.net",
};

// Backup Compute Units (CU) in case of failure
const backupCUs = ["https://cu.randao.net", "https://cu1.randao.net"];

// Track the currently active CU
let currentCU = AO_CONFIG.CU_URL;

/**
 * Utility function to add timeout
 */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Request timed out")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * Function to attempt a request with fallbacks.
 * If a CU fails, it switches and persists the new CU.
 */
async function attemptWithFallback<T>(
  fn: (cuUrl: string) => Promise<T>,
  timeout = 5000
): Promise<T> {
  const cuList = [currentCU, ...backupCUs];

  for (const cuUrl of cuList) {
    try {
      console.log(`🔄 Trying CU: ${cuUrl}`);
      const res = await withTimeout(fn(cuUrl), timeout);
      
      if (cuUrl !== currentCU) {
        console.warn(`✅ Switched to Backup CU: ${cuUrl}`);
        currentCU = cuUrl; // Persist this CU for future requests
      }

      return res;
    } catch (error) {
      console.warn(`❌ CU Failed: ${cuUrl}, trying next...`, error);
    }
  }

  throw new Error("🚨 All Compute Units (CUs) failed after retries.");
}

// Create a single connection instance (dynamic CU)
const getConnection = () => connect({ ...AO_CONFIG, CU_URL: currentCU });

/**
 * Wrapped methods with automatic persistent fallback logic
 */
export const message = async (params: any) =>
  attemptWithFallback((cu) =>
    connect({ ...AO_CONFIG, CU_URL: cu }).message({
      ...params,
      signer: createDataItemSigner(window.arweaveWallet),
    })
  );

export const result = async (params: any) =>
  attemptWithFallback((cu) =>
    connect({ ...AO_CONFIG, CU_URL: cu }).result({
      ...params,
    })
  );

export const dryrun = async (params: any) =>
  attemptWithFallback((cu) =>
    connect({ ...AO_CONFIG, CU_URL: cu }).dryrun({
      ...params,
      signer: createDataItemSigner(window.arweaveWallet),
    })
  );

// Export other methods normally
export const { spawn, monitor, unmonitor } = getConnection();
export { createDataItemSigner };
export default getConnection();
