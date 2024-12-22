import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Document, Packer, Paragraph, TextRun } from "docx"; // Import docx library

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
  const [editorHeight, setEditorHeight] = useState("calc(100vh - 60px)"); // Adjusting the editor height

  // Set up socket connection
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);

    return () => {
      if (s) {
        s.disconnect(); // Clean up socket connection when component unmounts
      }
    };
  }, []);

  // Initialize Quill editor when wrapper is set
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null || quill) return;  // Avoid re-initializing if `quill` is already set

    wrapper.innerHTML = "";  // Clear any existing content
    const editor = document.createElement("div");
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });

    q.disable(); // Start with Quill disabled
    q.setText("Loading..."); // Show loading text
    setQuill(q); // Set the Quill instance once it's created
  }, [quill]);  // Only re-run if `quill` is not set

  // Fetch document once quill and socket are set
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
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
      clearInterval(interval); // Clean up auto-save interval
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
      socket.off("receive-changes", handler); // Clean up the event listener
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
      quill.off("text-change", handler); // Clean up the event listener
    };
  }, [socket, quill]);

  // Function to handle saving the document as a .docx file
  const handleSaveAsDocx = () => {
    if (!quill) return;

    const content = quill.getText(); // Get the text content from Quill
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: content.split("\n").map((line, index) => {
                return new TextRun(line + (index !== content.split("\n").length - 1 ? "\n" : ""));
              }),
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${documentId}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div
      className="container"
      ref={wrapperRef}
      style={{
        position: "relative",
        width: "100%",
        height: editorHeight, // Ensure the container has enough height
      }}
    >
      <div style={{ height: "100%" }} />
      {/* Save Button at the bottom of the page */}
      <div
        style={{
          position: "relative",
          bottom: 0,
          padding: "10px 15px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          textAlign: "center",
          marginTop: "20px",
        }}
        onClick={handleSaveAsDocx}
      >
        Save as .docx
      </div>
    </div>
  );
}
