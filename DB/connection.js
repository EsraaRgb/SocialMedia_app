import mongoose from "mongoose";

export default async function connectDB() {
  return mongoose.connect(process.env.DB_URL)
    .then(() => {
      console.log("DB Connected");
    })
    .catch(() => {
      console.log("Canno't Connect to DB");
    });
}

