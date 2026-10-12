const express = require("express");
const router = express.Router();
const Lead = require("../models/Lead");
const calculateLeadScore = require("../utils/calculateLeadScore");

router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find();
        res.json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post("/", async (req, res) => {
    try {
        const lead = new Lead(req.body);
        const result = calculateLeadScore(req.body);
        lead.leadScore = result.score;
        lead.priority = result.priority;
        lead.reasons = result.reasons;
        console.log("Calculated Score:", result);
        const savedLead = await lead.save();
        res.status(201).json(savedLead);
    } catch (error) {
        console.error("Save Lead Error:", error.message);
        res.status(400).json({ message: error.message });

    }
});
module.exports = router;