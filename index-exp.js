// Nandini

import express from "express";
import cors from "cors";
import { postsRouter } from "./routes/posts.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/posts", postsRouter);

app.listen(PORT, () =>
  console.log(`Express App is running on http://localhost:${PORT}`)
);
