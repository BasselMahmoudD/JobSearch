import { mongoose } from "mongoose";

export const db = await mongoose
  .connect("mongodb://127.0.0.1:27017/JopSearch")
  .then(() => {
    console.log("Database connected");
  })
  .catch(() => {
    console.log("Database Disconnected");
  });