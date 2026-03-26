import { Client, Databases, Query } from 'node-appwrite';
import { Webhook } from 'svix';

export default async ({ req, res, log, error }) => {
  // 1. Inisialisasi Appwrite Client
  const client = new Client()
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69b4d7040031272d9173')
    .setKey(
      'standard_b2d4f5fa14b98026fb4d26b831227bc88d3a08d110e42032eff4e786864f5212246760e95a5cf2da47e09748e9f4806be69a7f7b0b4f5db5396b7f4f4cc57721c9d3828fbcee7fe17837e47fdbb723613c66106942d3b215654b51a12b694650ed4767bd4b727fe0a623611f83731631ecbce4b1aea353ffdec01a53a197ea18'
    );

  const databases = new Databases(client);
  const DATABASE_ID = '69b4dc180026208c5959';
  const COLLECTION_ID = 'users';


  // 2. Verifikasi Webhook Clerk (Svix)
  const WEBHOOK_SECRET = 'whsec_S7xhy/OHSiJ2J73PleyGMoCKVJbcv4Z9';
  if (!WEBHOOK_SECRET) {
    error('Missing CLERK_WEBHOOK_SECRET');
    return res.json({ error: 'Webhook secret not configured' }, 500);
  }

const defaultMetadataObj = {
  role: 'free-user',
  Key: '1_freeUser',
  bg_color: '#F87171',
  color: '#FFFFFF',
};

  
  // Ambil headers untuk verifikasi
  const svix_id = req.headers['svix-id'];
  const svix_timestamp = req.headers['svix-timestamp'];
  const svix_signature = req.headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.json({ error: 'Missing svix headers' }, 400);
  }


let payload = req.body;

if (typeof payload !== 'string') {
  payload = JSON.stringify(payload);
}

// Log untuk debugging (Hapus jika sudah jalan)
log(`Payload type: ${typeof payload}`);

// 2. Verifikasi dengan proteksi try-catch yang lebih spesifik
const wh = new Webhook(WEBHOOK_SECRET);
let evt;

try {
  // Pastikan headers tidak kosong sebelum verifikasi
  evt = wh.verify(payload, {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  });
} catch (err) {
  error('Verification failed: ' + err.message);
  // Error 'constructor' biasanya karena payload undefined di sini
  return res.json(
    {
      error: 'Invalid signature or empty payload',
      details: err.message,
    },
    400
  );
}

  // 3. Tangani Event Clerk
  const { id, ...attributes } = evt.data;
  const eventType = evt.type;

  log(`Handling event: ${eventType} for user ${id}`);

  try {
    switch (eventType) {
      case 'user.created':
      case 'user.updated': {
        // Gabungkan data profil dan metadata (public/private)
        const userData = {
          userId: id,
          email: attributes.email_addresses?.[0]?.email_address,
          firstName: attributes.first_name,
          lastName: attributes.last_name,
          user_image_url: attributes.image_url,
          // Menyimpan metadata jika ada
        };

        // Cek apakah dokumen sudah ada
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('userId', id)]
        );

        if (existing.total > 0) {
          // Update jika ada
          await databases.updateDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existing.documents[0].$id,
            userData
          );
          log('User updated successfully');
        } else {
          // Create jika belum ada
          await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            'unique()',
            userData
          );
          log('User created successfully');
        }
        break;
      }

      case 'user.deleted': {
        // Cari dokumen berdasarkan clerkId lalu hapus
        const existing = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [Query.equal('userId', id)]
        );

        if (existing.total > 0) {
          await databases.deleteDocument(
            DATABASE_ID,
            COLLECTION_ID,
            existing.documents[0].$id
          );
          log('User deleted successfully');
        }
        break;
      }

      default:
        log(`Unhandled event type: ${eventType}`);
    }

    return res.json({ success: true });
  } catch (dbError) {
    error('Database error:', dbError.message);
    return res.json({ error: 'Database sync failed' }, 500);
  }
};
