import { query } from "../db/index.js";

export const getPosts = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const { rows } = await query("SELECT * FROM Posts LIMIT $1 OFFSET $2", [
      limit,
      offset,
    ]);
    console.log("rows : ", rows);
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await query(`SELECT * FROM posts WHERE id=$1`, [id]);
    console.log("rows : ", rows);
    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(404).send("Post not found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const createPost = async (req, res) => {
  try {
    const { author, title, content, cover } = req.body;
    const date = new Date();
    console.log("date : ", date);
    const result = await query(
      `INSERT INTO posts (author, title, content, cover, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [author, title, content, cover, date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const updatePost = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send("Id cannot be null");
    }

    await query(`DELETE FROM posts WHERE id=$1`, [id]);
    res.status(200).send("Post deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("something went wrong");
  }
};
