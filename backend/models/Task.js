const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    reward: {
      type: Number,
    },
    category: {
      type: String,
    },
    difficulty: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Task || mongoose.model("Task", taskSchema);
