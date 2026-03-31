import "reflect-metadata";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { bookingDB } from "../infrastructure/database/models/booking.model";
import { config } from "../shared/config";
import { generateBookingId } from "../shared/utils/booking-id";

dotenv.config();

async function main() {
  const uri = config.database.URI;
  await mongoose.connect(uri);

  // Backfill only documents missing bookingId.
  const cursor = bookingDB
    .find({
      $or: [{ bookingId: { $exists: false } }, { bookingId: null }, { bookingId: "" }],
    })
    .select({ _id: 1 })
    .cursor();

  let updated = 0;
  let scanned = 0;

  for await (const doc of cursor) {
    scanned += 1;

    for (let attempt = 0; attempt < 10; attempt += 1) {
      const candidate = generateBookingId();
      try {
        const res = await bookingDB.updateOne(
          { _id: doc._id, $or: [{ bookingId: { $exists: false } }, { bookingId: null }, { bookingId: "" }] },
          { $set: { bookingId: candidate } }
        );
        if ((res.modifiedCount ?? 0) > 0) updated += 1;
        break;
      } catch (err) {
        const code = (err as { code?: number })?.code;
        const msg = err instanceof Error ? err.message : String(err);
        const isDuplicateKey = code === 11000 || msg.toLowerCase().includes("e11000");
        if (!isDuplicateKey || attempt === 9) throw err;
      }
    }

    if (scanned % 500 === 0) {
      // eslint-disable-next-line no-console
      console.log(`Scanned ${scanned}, updated ${updated}`);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Scanned ${scanned}, updated ${updated}`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});

