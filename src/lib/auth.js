// import { betterAuth } from "better-auth";
// import { MongoClient } from "mongodb";
// import { mongodbAdapter } from "@better-auth/mongo-adapter";

// const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db('pet-adoption-platform');

// export const auth = betterAuth({
//   database: mongodbAdapter(db, {
//     client,
//   }),
//    emailAndPassword: { 
//     enabled: true, 
//   }, 
// });



import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI);

const db = client.db("pet-adoption-platform");

client.connect()
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((error) => console.log("MongoDB Error:", error));

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  emailAndPassword: {
    enabled: true,
  },
    trustedOrigins: [
    "https://pet-adoption-platform-x5ur.vercel.app",
    "http://localhost:3000",
  ]
});