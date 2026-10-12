const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    industry: String,
    location: String,
    employeeCount: Number,
    revenue: Number,
    website: String,
    contactName: String,
    contactEmail: String,
    leadScore: {
        type: Number,
        default: 0
    },
    reasons: {
        type: [String],
        default: []
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
        default: "Low"
    },
    status: {
        type: String,
        default: "New"
    },
    lastContactedAt: Date,
    nextFollowUpAt: Date,

    callStatus: {
        type: String,
        enum: [
            "Not Called",
            "Called",
            "No Answer",
            "Interested"
        ],
        default: 'Not Called'
    },
    callCount: {
        type: Number,
        default: 0
    },
    contactHistory: [{
        contactedAt: Date,
        outcone: String,
        notes: String
    }],
    notes: String
}, { timestamps: true });
module.exports = mongoose.model("Lead", leadSchema);