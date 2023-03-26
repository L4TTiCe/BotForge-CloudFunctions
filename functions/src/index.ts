import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface VoteRecord {
    botId: string;
    userId: string;
    timestamp: number;
}

// Trigger a function when a document is added
// or deleted in up_votes collection
export const updateUpVoteCount = functions.firestore
  .document("up_votes/{id}")
  .onWrite(async (change) => {
    // Get a reference to the realtime database record for all bots
    const botRef = admin.database().ref("bots");

    // Check if the document exists or not
    const exists = change.after.exists;

    // If the document exists, get the botId from the document data
    if (exists) {
      const record = change.after.data() as VoteRecord;

      // Increment the post like count
      await botRef.child(record.botId)
        .child("userUpVotes")
        .transaction((current) => {
          return current + 1;
        }).then(() => {
        // Update updatedAt timestamp
          return botRef.child(record.botId).update({
            updatedAt: admin.database.ServerValue.TIMESTAMP,
          });
        });
    } else {
      // Otherwise, get the botId from the document data
      const record = change.before.data() as VoteRecord;

      // Decrement the post like count
      await botRef.child(record.botId)
        .child("userUpVotes")
        .transaction((current) => {
          return current - 1;
        }).then(() => {
        // Update updatedAt timestamp
          return botRef.child(record.botId).update({
            updatedAt: admin.database.ServerValue.TIMESTAMP,
          });
        });
    }
  });

// Trigger a function when a document is added
// or deleted in down_votes collection
export const updateDownVoteCount = functions.firestore
  .document("down_votes/{id}")
  .onWrite(async (change) => {
    // Get a reference to the realtime database record for all bots
    const botRef = admin.database().ref("bots");

    // Check if the document exists or not
    const exists = change.after.exists;

    // If the document exists, get the botId from the document data
    if (exists) {
      const record = change.after.data() as VoteRecord;

      // Increment the post like count
      await botRef.child(record.botId)
        .child("userDownVotes")
        .transaction((current) => {
          return current + 1;
        }).then(() => {
        // Update updatedAt timestamp
          return botRef.child(record.botId).update({
            updatedAt: admin.database.ServerValue.TIMESTAMP,
          });
        });
    } else {
      // Otherwise, get the botId from the document data
      const record = change.before.data() as VoteRecord;

      // Decrement the post like count
      await botRef.child(record.botId)
        .child("userDownVotes")
        .transaction((current) => {
          return current - 1;
        }).then(() => {
        // Update updatedAt timestamp
          return botRef.child(record.botId).update({
            updatedAt: admin.database.ServerValue.TIMESTAMP,
          });
        });
    }
  });
