import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

// Initialize app
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/kanban", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async () => {
  console.log("Connected to MongoDB");

  const taskCount = await Task.countDocuments();
  if (taskCount === 0) {
    const randomTasks = generateRandomTasks(5);
    await Task.insertMany(randomTasks);
    console.log("Seeded the database with 5 random tasks.");
  }
});

// Task schema
const taskSchema = new mongoose.Schema({
  task: String,
  deadline: String,
  column: { type: String, enum: ["todo", "inProgress", "done"] },
});

const Task = mongoose.model("Task", taskSchema);

// Routes
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  const { task, deadline, column } = req.body;

  const newTask = new Task({
    task,
    deadline,
    column: column || "todo",
  });

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const { column } = req.body;
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { column },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.json(deletedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function generateRandomTasks(numTasks) {
  const taskNames = [
    "Design Homepage",
    "Fix Bug in Authentication",
    "Write Documentation",
    "Prepare Presentation",
    "Develop API Endpoints",
    "Set up Database",
    "Deploy to Production",
    "Update Dependencies",
    "Conduct Code Review",
    "Test Features",
  ];

  const randomDates = () => {
    const randomDays = Math.floor(Math.random() * 30) + 1;
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() + randomDays);
    return randomDate.toISOString().split("T")[0];
  };

  const columns = ["todo", "inProgress", "done"];

  return Array.from({ length: numTasks }, () => {
    const randomTaskName =
      taskNames[Math.floor(Math.random() * taskNames.length)];
    const randomDeadline = randomDates();
    const randomColumn = columns[Math.floor(Math.random() * columns.length)];

    return {
      task: randomTaskName,
      deadline: randomDeadline,
      column: randomColumn,
    };
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
