const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  data: {
    label: String,
    to: String, // For email node
    subject: String, // For email node
    message: String, // For email node
    delay: Number, // For delay node
  },
  position: {
    x: Number,
    y: Number,
  },
  scheduledAt: Date, // When this node is scheduled to trigger
});

const EdgeSchema = new mongoose.Schema({
  source: String,
  target: String,
});

const EmailFlowSchema = new mongoose.Schema({
  nodes: [NodeSchema],
  edges: [EdgeSchema],
  status: { type: String, default: "Scheduled" },
  scheduledAt: Date, // The initial scheduled time for the entire flow
});

module.exports = mongoose.model("EmailFlow", EmailFlowSchema);
