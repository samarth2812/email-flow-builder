import React, { useState, useCallback } from "react";
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
} from "reactflow";
import "reactflow/dist/style.css";

const EMAIL_FLOW_SAVE_URL =
  "https://email-flow-builder.onrender.com/api/emails/save-flowchart";

// State for managing nodes, edges, and form data
const FlowChart = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [nodeType, setNodeType] = useState("");
  const [formData, setFormData] = useState({
    to: "",
    subject: "",
    message: "",
    delay: "",
  });

  // Handlers for node and edge updates
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // Opens popup for adding nodes
  const openPopup = (type) => {
    setNodeType(type);
    setShowPopup(true);
    setFormData({ to: "", subject: "", message: "", delay: "" });
  };

  // Closes popup
  const closePopup = () => {
    setShowPopup(false);
    setNodeType("");
  };

  // Handles input changes in the popup form
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Adds a new node to the flowchart
  const addNode = () => {
    if (
      nodeType === "Email" &&
      (!formData.to || !formData.subject || !formData.message)
    ) {
      alert("All email fields are required");
      return;
    }
    if (
      nodeType === "Email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to)
    ) {
      alert("Invalid email address");
      return;
    }
    if (nodeType === "Wait/Delay" && !formData.delay) {
      alert("Delay field is required");
      return;
    }

    const id = `node-${nodes.length + 1}`;
    const currentTime = new Date();

    let nodeLabel =
      nodeType === "Email"
        ? `📧 Email: ${formData.to}, Subject: ${formData.subject}, Message: ${formData.message}`
        : `⏳ ${formData.delay} min`;

    let scheduledAt = currentTime;

    if (nodeType === "Wait/Delay" && formData.delay) {
      // Add delay to current time
      scheduledAt = new Date(currentTime.getTime() + formData.delay * 60000);
    } else if (nodeType === "Email") {
      scheduledAt = currentTime;
    }

    setNodes([
      ...nodes,
      {
        id,
        type: nodeType === "Email" ? "email" : "delay", // Add type here
        data: { label: nodeLabel, ...formData }, // Include form data for easy access
        position: { x: Math.random() * 400, y: Math.random() * 300 },
        scheduledAt: scheduledAt.toISOString(),
      },
    ]);
    closePopup();
  };

  // Handles right-click to delete nodes
  const handleNodeContextMenu = (event, node) => {
    event.preventDefault(); // Prevent the default context menu
    if (window.confirm("Are you sure you want to delete this node?")) {
      setNodes(nodes.filter((n) => n.id !== node.id));
    }
  };

  // Handles right-click to delete edges
  const handleEdgeContextMenu = (event, edge) => {
    event.preventDefault(); // Prevent the default context menu
    if (window.confirm("Are you sure you want to delete this edge?")) {
      setEdges(edges.filter((e) => e.id !== edge.id));
    }
  };

  // Saves the flowchart to the backend
  const saveFlowchart = async () => {
    console.log(1, nodes, edges);
    if (edges.length === 0 || nodes.length === 0) {
      alert(
        "You need to have at least one node and one edge to save the flowchart."
      );
      return;
    }

    try {
      const response = await fetch(
        EMAIL_FLOW_SAVE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nodes,
            edges,
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        alert(`Flowchart saved successfully! ID: ${result.emailFlowId}`);
      } else {
        alert(`Error saving flowchart: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving flowchart:", error);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Email Flowchart Builder
      </h2>

      <div style={{ display: "flex", gap: "20px", width: "100%" }}>
        <div
          style={{
            width: "250px",
            background: "#f4f4f4",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <h3>Controls</h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <button
              style={{
                padding: "10px",
                cursor: "pointer",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => openPopup("Email")}
            >
              Add Email Node
            </button>
            <button
              style={{
                padding: "10px",
                cursor: "pointer",
                background: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => openPopup("Wait/Delay")}
            >
              Add Wait/Delay Node
            </button>
            <button
              style={{
                padding: "10px",
                cursor: "pointer",
                background: edges.length > 0 ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={saveFlowchart} // Changed to call the saveFlowchart function
              disabled={edges.length === 0}
            >
              Save Flowchart
            </button>
          </div>
        </div>

        <div
          style={{
            width: "100%",
            height: "80vh",
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#bde0fe",
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeContextMenu={handleNodeContextMenu} // Added right-click handler for nodes
            onEdgeContextMenu={handleEdgeContextMenu} // Added right-click handler for edges
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <button
              onClick={closePopup}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              ✖
            </button>
            <h3>Add {nodeType} Node</h3>
            {nodeType === "Email" ? (
              <>
                <input
                  type="email"
                  name="to"
                  placeholder="Recipient Email"
                  value={formData.to}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "8px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <input
                  type="text"
                  name="subject"
                  placeholder="Email Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    padding: "8px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <textarea
                  name="message"
                  placeholder="Email Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  style={{ padding: "8px", height: "100px", width: "100%" }}
                />
              </>
            ) : (
              <input
                type="number"
                name="delay"
                placeholder="Delay in minutes"
                value={formData.delay}
                onChange={handleChange}
                required
                style={{ padding: "8px", width: "100%" }}
              />
            )}
            <button
              onClick={addNode}
              style={{
                padding: "10px",
                cursor: "pointer",
                background: "#007bff",
                color: "white",
                borderRadius: "5px",
                marginTop: "40px",
                width: "104%",
              }}
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowChart;
