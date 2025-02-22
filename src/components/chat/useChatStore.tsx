import { create } from "zustand";
import axios from "axios";

export interface Transaction {
  id: string;
  timestamp?: number;
  authorName: string;
  chatRoom: string;
  authorNFT?: string;
  arweaveData?: any;
}

interface TransactionState {
  transactions: Transaction[];
  latestMessage: Transaction | null;
  nextCursor: string | null;
  fetchTransactions: (chatRoom: string, pageParam?: string) => Promise<{ transactions: Transaction[]; nextCursor: string | null }>;
  addTransactions: (newTransactions: Transaction[]) => void;
  setLatestMessage: (message: Transaction) => void;
  setNextCursor: (cursor: string | null) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  latestMessage: null,
  nextCursor: null,

  fetchTransactions: async (chatRoom: string, pageParam = undefined) => {
    try {
      const endpoint = "https://arweave-search.goldsky.com/graphql";
      const query0 = `
        query ($entityId: String!, $limit: Int!, $sortOrder: SortOrder!, $cursor: String) {
          transactions(sort: $sortOrder, first: $limit, after: $cursor, ingested_at: {min: 1696107600}, tags: [{name: "From-Process", values: [$entityId]}]) {
            edges {
              node {
                id
                ingested_at
                recipient
                block { timestamp height }
                tags { name value }
                data { size }
                owner { address }
              }
            }
            pageInfo {
              hasNextPage
              
            }
          }
        }
      `;

      const variables = {
        entityId: "uln9Hp5_AE_rbDwDJYmv2s4A8Z0NLu-669x_I0aUmGI",
        limit: 100,
        sortOrder: "HEIGHT_DESC",
        cursor: pageParam || undefined,
      };

      const { data } = await axios.post(endpoint, { query: query0, variables });
      
      let transactions = data.data.transactions.edges.map((edge: any) => edge.node);
      const pageInfo = data.data.transactions.pageInfo;
      const nextCursor = pageInfo.hasNextPage ? pageInfo.endCursor : null;

      // Fetch "Pushed-For" values
      const pushedForValues = await Promise.all(
        transactions.map(async (tx: any) => {
          const query1 = `
            query ($id: ID!) {
              transactions(ids: [$id], ingested_at: {min: 1696107600}) {
                edges {
                  node {
                    id
                    block {
                      timestamp
                    }
                    tags { name value }
                  }
                }
              }
            }
          `;
          const { data } = await axios.post(endpoint, { query: query1, variables: { id: tx.id } });
          const pushedForTag = data.data.transactions.edges[0]?.node.tags.find(
            (tag: any) => tag.name === "Pushed-For"
          );
          return pushedForTag ? pushedForTag.value : null;
        })
      );

      // Fetch additional details and filter by ChatRoom
      const transactionDetails = await Promise.all(
        pushedForValues.map(async (pushedForId) => {
          if (!pushedForId) return null;
          const { data } = await axios.post(endpoint, {
            query:  `
            query ($id: ID!) {
              transactions(ids: [$id], ingested_at: {min: 1696107600}) {
                edges {
                  node {
                    id
                    block {
                      timestamp
                    }
                    tags { name value }
                  }
                }
              }
            }
          `,
            variables: { id: pushedForId },
          });

          const transaction = data.data.transactions.edges[0]?.node;
          if (!transaction) return null;

          const blockTimestamp = transaction.block?.timestamp || null;

          const tags = transaction.tags.reduce(
            (acc: any, tag: any) => {
              if (tag.name === "AuthorName") acc.authorName = tag.value;
              if (tag.name === "ChatRoom") acc.chatRoom = tag.value;
              if (tag.name === "AuthorNFT") acc.authorNFT = tag.value;
              return acc;
            },
            {}
          );

          if (tags.chatRoom !== chatRoom) return null;

          try {
            const getRes = await axios.get(`https://arweave.net/${transaction.id}`);
            return {
              id: transaction.id,
              timestamp: blockTimestamp,
              ...tags,
              arweaveData: getRes.data,
            };
          } catch (err) {
            console.error(`Failed to fetch data for ${transaction.id}:`, err);
            return null;
          }
        })
      );
      return { transactions: transactionDetails.filter(Boolean), nextCursor };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return { transactions: [], nextCursor: null };
    }
  },

  addTransactions: (newTransactions) =>
    set((state) => ({ transactions: [...state.transactions, ...newTransactions] })),

  setLatestMessage: (message) => set({ latestMessage: message }),

  setNextCursor: (cursor) => set({ nextCursor: cursor }),
}));