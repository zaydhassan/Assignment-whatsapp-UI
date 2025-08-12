require("dotenv").config();
const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const client = new MongoClient(process.env.MONGO_URI);

async function processPayloads() {
  try {
    await client.connect();
    const db = client.db("whatsapp");
    const collection = db.collection("processed_messages");
    console.log("✅ Connected to MongoDB");

    const folderPath = path.join(__dirname, "payloads");
    const files = fs.readdirSync(folderPath).filter(f => f.endsWith(".json"));

    for (const file of files) {
      const rawData = fs.readFileSync(path.join(folderPath, file), "utf8");
      const payload = JSON.parse(rawData);

      const changeValue = payload?.metaData?.entry?.[0]?.changes?.[0]?.value;

      if (changeValue?.messages && Array.isArray(changeValue.messages)) {
        for (const msg of changeValue.messages) {
          const contact = changeValue.contacts?.[0];
          const messageDoc = {
            wa_id: contact?.wa_id || msg.from,
            from: msg.from,
            to: changeValue.metadata?.display_phone_number || null,
            name: contact?.profile?.name || null,
            text: msg.text?.body || "",
            timestamp: new Date(parseInt(msg.timestamp) * 1000).toISOString(),
            status: "sent",
            id: msg.id,
            meta_msg_id: msg.id
          };

          await collection.updateOne(
            { id: msg.id },
            { $setOnInsert: messageDoc },
            { upsert: true }
          );
          console.log(`💬 Inserted/Found message from ${messageDoc.name || messageDoc.wa_id}`);
        }
      }

      if (changeValue?.statuses && Array.isArray(changeValue.statuses)) {
        for (const st of changeValue.statuses) {
          const matchQuery = { id: st.id };
          const updateResult = await collection.updateOne(
            matchQuery,
            { $set: { status: st.status, status_timestamp: new Date(parseInt(st.timestamp) * 1000).toISOString() } }
          );
          if (updateResult.matchedCount) {
            console.log(`✅ Updated status to "${st.status}" for message ID: ${st.id}`);
          } else {
            console.log(`⚠️ No matching message found for status ${st.status}`);
          }
        }
      }
    }

    console.log("📦 Done processing all payloads.");
  } catch (err) {
    console.error("❌ Error processing payloads:", err);
  } finally {
    await client.close();
    console.log("🔌 MongoDB connection closed");
  }
}

processPayloads();