// Nandini

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT ?? 3000;

// allows requests from any origin
app.use(cors());
// this middleware must be before the routes, it allows us to access the request body
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/users", (req, res) => {
  res.json([
    { id: 1, name: "Jane" },
    { id: 2, name: "John" },
  ]);
});

app.post("/users", (req, res) => {
  const { body } = req;
  const newUser = { id: crypto.randomUUID(), ...body };

  res.status(201).json(newUser);
});

app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  res.send(`GET user ${id}`);
});

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const body = req.body;
  // find the user based on the id and return the updated user

  res.json(body);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  // delete the user based on the id
  // const result = await client.query("DELETE FROM USERS WHERE id=$1", [id])

  res.send(`DELETE user ${id}`);
});

app.listen(PORT, () => console.log(`Express App is running on http://localhost:${PORT}`));