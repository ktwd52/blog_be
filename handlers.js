import pg from 'pg';
const { Client } = pg;
import { processBodyFromRequest, returnErrorWithMessage, getResourceId } from './utils.js';

export const createPost = async (req, res, headers) => {
  try {
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, "Body is required");
    const parsedBody = JSON.parse(body);

    const client = new Client({
      connectionString: process.env.PG_G_URI,
    });

    await client.connect();

    const results = await client.query(
      `INSERT INTO posts (author, title, content, cover, date) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [parsedBody.author, parsedBody.title, parsedBody.content, parsedBody.cover, parsedBody.date]
    );

    await client.end();

    res.writeHead(201, headers);
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error("Error creating posts: ", error);
    returnErrorWithMessage(res);
  }
};

export const getPosts = async (req, res, headers) => {
  try {
    const client = new Client({
      connectionString: process.env.PG_G_URI,
    });

    await client.connect();

    const results = await client.query("SELECT * FROM posts;");

    await client.end();

    res.writeHead(200, headers);
    res.end(JSON.stringify(results.rows));
  } catch (error) {
    console.error("Error querying the posts from the database: ", error);
    returnErrorWithMessage(res);
  }
};

export const getPostById = async (req, res, headers) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_G_URI,
    });

    await client.connect();
    const results = await client.query("SELECT * FROM posts WHERE id = $1;", [id]);

    await client.end();
    if (!results.rowCount)
      return returnErrorWithMessage(res, 404, "Post was not found in the database");

    res.writeHead(200, headers);
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error("Error querying the posts from database: ", error);
    returnErrorWithMessage(res);
  }
};

export const updatePostbyId = async (req, res, headers) => {
  try {
    const id = getResourceId(req.url);
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, "Body is required");
    const parsedBody = JSON.parse(body);

    const client = new Client({
      connectionString: process.env.PG_G_URI,
    });

    await client.connect();

    const results = await client.query(
      "UPDATE posts SET author = $1, title = $2, content = $3, cover = $4, date = $5 WHERE id = $6 RETURNING *;",
      [parsedBody.author, parsedBody.title, parsedBody.content, parsedBody.cover, parsedBody.date, id]
    );
    await client.end();

    res.writeHead(200, headers);
    if (!results.rowCount) {
      res.end(JSON.stringify({ error: `id: ${id} does not exist in the database` }));
    } else {
      res.end(JSON.stringify(results.rows[0]));
    }
  } catch (error) {
    console.error("Error updating posts table: ", error);
    returnErrorWithMessage(res);
  }
};

export const deletePostbyId = async (req, res, headers) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_G_URI,
    });

    await client.connect();
    const isProductDeleted = await client.query("DELETE FROM posts WHERE id = $1;", [id]);
    await client.end();

    res.writeHead(200, headers);
    if (!isProductDeleted.rowCount) {
      res.end(JSON.stringify({ message: `Post id: ${id} was not found in the database` }));
    } else {
      res.end(JSON.stringify({ message: `Post id: ${id} was deleted successfully from the database` }));
    }
  } catch (error) {
    console.error("Error deleting post: ", error);
    returnErrorWithMessage(res);
  }
};