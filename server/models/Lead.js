import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    columns: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ["text", "number", "date", "boolean"],
          required: true,
        },
        required: { type: Boolean, default: false },
      },
    ],
    rows: [
      {
        data: { type: Map, of: mongoose.Schema.Types.Mixed },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", LeadSchema);

export default Lead;
