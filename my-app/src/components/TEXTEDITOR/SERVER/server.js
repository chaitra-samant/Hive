import mongoose from "mongoose";
import Document from "./Document.js";
import { Server } from "socket.io";

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/google-docs-clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 50000, // Optional, increase timeout
})
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

// Set up Socket.io server
const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000", // React front-end
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", socket => {
  console.log("Client connected");

  socket.on("get-document", async documentId => {
    console.log(`Fetching document: ${documentId}`);
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    // Handle document changes from clients
    socket.on("send-changes", delta => {
      console.log("Sending changes to others:", delta);
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Save document data to DB when client saves
    socket.on("save-document", async data => {
      console.log("Saving document data:", data);
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

// Function to find or create a document
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) {
    console.log("Document found:", document);
    return document;
  }
  
  console.log("Creating new document with ID:", id);
  return await Document.create({ _id: id, data: defaultValue });
}
