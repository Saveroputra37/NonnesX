import client, {
  DATABASE_ID,
  COLLECTION_ID_POST,
  databases,
} from "../appwriteconfig";
const BUCKET_ID = "69b65237000c0c300c8b";

export const subscribeToPosts = (callback) => {
  const channel = `databases.${DATABASE_ID}.collections.${COLLECTION_ID_POST}.documents`;

  return client.subscribe(channel, (response) => {
    // 1. Cek apakah event-nya adalah salah satu dari create, update, atau delete
    const isTargetEvent = response.events.some(
      (e) =>
        e.includes("documents.*.create") ||
        e.includes("documents.*.update") ||
        e.includes("documents.*.delete"),
    );

    if (isTargetEvent) {
      // 2. Ekstrak tipe aksi (mengambil kata terakhir setelah titik: 'create', 'update', atau 'delete')
      const actionType = response.events[0].split(".").pop();

      // 3. Kirim payload dan tipe aksinya ke callback
      callback({
        type: actionType,
        payload: response.payload,
      });
    }
  });
};