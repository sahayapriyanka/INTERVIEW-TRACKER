const mongoose = require('mongoose');

const STAGES = ['Applied', 'HR Round', 'Technical', 'Final Round', 'Offer', 'Rejected'];

const ApplicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    stage: {
      type: String,
      enum: STAGES,
      default: 'Applied',
    },
    salary: {
      type: String,
      trim: true,
    },
    dateApplied: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    rejectionReason: {
      type: String,
      maxlength: [1000, 'Rejection reason cannot exceed 1000 characters'],
    },
    rounds: [
      {
        name: { type: String },          // e.g. "HR Screen", "System Design"
        date: { type: Date },
        feedback: { type: String },
        passed: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

// Index for faster user queries
ApplicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Application', ApplicationSchema);
