import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const SAVE_INTERVAL_MS = 2000;
const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
  [{ size: ["10px", "12px", "14px", "16px", "18px", "20px", "24px"] }], // Font size options
];


export default function TextEditor() {
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);

  // Set up socket connection
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Initialize Quill editor when wrapper is set
  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable(); // Start with Quill disabled
    q.setText("Loading..."); // Show loading text
    setQuill(q); // Set the Quill instance once it's created
  }, []);

  // Fetch document once quill and socket are set
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", document => {
      console.log("Document loaded:", document);
      quill.setContents(document); // Set document content
      quill.enable(); // Enable Quill for editing
    });

    socket.emit("get-document", documentId); // Request the document by ID
  }, [socket, quill, documentId]);

  // Handle auto-save functionality
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      console.log("Auto-saving document...");
      socket.emit("save-document", quill.getContents()); // Send document content periodically
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  // Receive changes from other clients and apply them
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      console.log("Applying changes from others:", delta);
      quill.updateContents(delta); // Apply changes from others
    };

    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  // Emit changes made by the user
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return; // Ignore changes from other sources
      console.log("Text change detected:", delta);
      socket.emit("send-changes", delta); // Send user changes to others
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  return <div className="container" ref={wrapperRef}></div>;
}
