const express = require("express");
const cors = require("cors");
const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function startFunction() {
  const database = await sqlite.open({
    filename: "./todo.sqlite",
    driver: sqlite3.Database,
  });

  app.use((req, res, next) => {
    req.database = database;
    next();
  });

  await database.run("PRAGMA foreign_keys = ON");

  app.get("/todos", async (req, res) => {
    try {
      const rows = await req.database.all("SELECT * FROM todos");
      res.send(rows);
    } catch (error) {
      res.status(500).send("Something went wrong");
    }
  });

  app.post("/todos", async (req, res) => {
    const { title } = req.body;
    try {
      const result = await req.database.run(
        "INSERT INTO todos (title) VALUES (?)",
        [title]
      );
      const todo = await req.database.get(
        "SELECT * FROM todos WHERE id = ?",
        result.lastID
      );
      res.status(201).send(todo);
    } catch (error) {
      res.status(500).send("Could not add task to list");
    }
  });

  app.put("/todos/:id", async (req, res) => {
    const { completed } = req.body;
    const id = req.params.id;
    try {
      const result = await req.database.run(
        "UPDATE todos SET completed = ? WHERE id = ?",
        [completed, id]
      );
      res.json({ message: "Todo updated successfully", completed });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/todos/:id", async (req, res) => {
    try {
      const result = await req.database.run("DELETE FROM todos WHERE id = ?", [
        req.params.id,
      ]);
      res.send({ message: "To-do task removed" });
    } catch (error) {
      res.status(500).send("Could not remove task");
    }
  });

  app.listen(8080, () => {
    console.log("Redo på http://localhost:8080");
  });
}

startFunction().catch(console.error);
