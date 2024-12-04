// routes/leads.js
const express = require('express');
const Lead = require('../models/Leads');
const router = express.Router();

router.post('/track', async (req, res) => {
    try {
        // Find the single document where click count is stored or create if not exists
        let lead = await Lead.findOne();

        if (lead) {
            // Increment the click count
            lead.clickCount += 1;
            await lead.save();
        } else {
            // Initialize the lead document with one click
            lead = new Lead({ clickCount: 1 });
            await lead.save();
        }

        res.status(200).json({ message: 'Lead count updated successfully', clickCount: lead.clickCount });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update lead count', error });
    }
});

module.exports = router;
