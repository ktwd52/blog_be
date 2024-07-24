import express from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/posts.js";

const postsRouter = express.Router();

postsRouter.get("/", getPosts);
postsRouter.post("/", createPost);
postsRouter.get("/:id", getPost);
postsRouter.put("/:id", updatePost);
postsRouter.delete("/:id", deletePost);

export { postsRouter };
