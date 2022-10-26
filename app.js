import dotenv from "dotenv";
import express from "express";
import connectDB from "./DB/connection.js";
import * as Router from "./modules/index.router.js";
dotenv.config();

const app = express();
app.use(express.json());

connectDB();

app.use(`${process.env.BASE_URL}/auth`, Router.authRouter);
app.use(`${process.env.BASE_URL}/user`, Router.userRouter);
app.use(`${process.env.BASE_URL}/post`, Router.postRouter);
app.use(`${process.env.BASE_URL}/comment`, Router.commentRouter);
app.use('*', (req, res) => res.send('In-valid Routing'))

app.listen(process.env.PORT, () => {
  console.log(`Server is Running on port ${process.env.PORT}`);
});
