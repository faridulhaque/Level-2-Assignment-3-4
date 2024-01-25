import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const port: number = 5000 || 8080;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://faridulhaquemurshed:QOj2aDRBuDCYNCG3@cluster0.kr1r9yw.mongodb.net/assignment-2?retryWrites=true&w=majority" as string
    );

    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  } catch (err) {
    console.log(err)
  }
}

main();
