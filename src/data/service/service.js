import client, { DATABASE_ID, COLLECTION_ID_POST } from "../appwriteconfig";

export const subscribeToPosts = (callback) => {
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID_POST}.documents`;

  return client.subscribe(channel, (response) => {
    // Memastikan hanya menangkap event "create"
    if (response.events.some((e) => e.includes("documents.*.create"))) {
      callback(response.payload);
    }
  });
};
