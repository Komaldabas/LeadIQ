function calculateLeadScore(lead) {
    let score = 0;
    let reasons = [];
    if (lead.companyName) {
        score += 10;
        reasons.push("Company identified +10");
    }
    if (lead.industry) {
        score += 15;
        reasons.push("Industry information available +15");
    }
    if (lead.website) {
        score += 15;
        reasons.push("Website available +15");

    }
    if (lead.contactName) {
        score += 20;
        reasons.push("Contact person identified +20");

    }
    if (lead.email) {
        score += 25;
        reasons.push("Contact email available +25");

    }
    if (lead.notes) {
        score += 15;
        reasons.push("Lead research notes available +15");

    }
    return {
        score: score,
        priority: score >= 75 ? "High" : score >= 45 ? "Medium" : "Low",
        reasons: reasons
    };
}
module.exports = calculateLeadScore;