require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todosData = require("./assets/todos.json");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

const Todo = mongoose.model("Todo", {
  title: String,
  completed: {
    type: Boolean,
    default: false,
  },
  color: String,
});

app.post("/create-todos", async (req, res) => {
  try {
    await Todo.insertMany(todosData);
    const todos = await Todo.find();
    res.status(201).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const newTodo = new Todo(req.body);
    await newTodo.save(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/todos/toggle/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/todos/color/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
      color: req.body.color,
    });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put("/todos/all-completed", async (req, res) => {
  try {
    await Todo.updateMany({ completed: false }, { completed: true });
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todos/all-completed", async (req, res) => {
  try {
    await Todo.deleteMany({ completed: true });
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(process.env.PORT, () => console.log("Server started"));
