const express = require("express");
const EmailFlow = require("../models/email"); // Import the model
const agenda = require("../jobs/emailJob"); // Import Agenda

const router = express.Router();

// Save flowchart and schedule the first email
router.post("/save-flowchart", async (req, res) => {
  try {
    const { nodes, edges } = req.body;

    if (!nodes.length || !edges.length) {
      return res.status(400).json({ error: "Invalid flowchart data" });
    }

    const emailFlow = new EmailFlow({ nodes, edges, scheduledAt: new Date() });
    await emailFlow.save();

    const firstNode = nodes.find((node) => node.type === "email");
    console.log(1, firstNode);
    if (firstNode) {
      console.log("Scheduling first email node:", firstNode);

      await agenda.schedule("in 1 minute", "send email", {
        to: firstNode.data.to,
        subject: firstNode.data.subject,
        body: firstNode.data.body,
      });

      console.log("Email scheduled successfully for 1 minute later.");
    }

    res.json({
      message: "Flowchart saved and first email scheduled",
      emailFlowId: emailFlow._id,
    });
  } catch (error) {
    console.error("Error saving flowchart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
