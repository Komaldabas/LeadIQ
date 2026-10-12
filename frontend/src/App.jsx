import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [dbLeads, setDbLeads] = useState([]);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [contactName, setContactName] = useState("");
  const [website, setwebsite] = useState("");
  useEffect(() => {
    fetch("http://localhost:5000/api/leads").then((response) => response.json()).then((data) => {
      setDbLeads(data);
    })
      .catch((error) => {
        console.error("Error fetching leads:", error);
      });
  }, []);

  const leads = [
    {
      id: 1, company: "ABC Technologies", industry: "Technology", industryFit: 38, contactQuality: 28, dataCompleteness: 28, score: 94, action: "Contact CEO"
    },
    { id: 2, company: "Growth Solutions", industry: "Finance", industryFit: 35, contactQuality: 24, dataCompleteness: 23, score: 82, action: "Verify Contact" },
    { id: 3, company: "HealthCare Plus", industry: "Healthcare", industryFit: 28, contactQuality: 18, dataCompleteness: 18, score: 64, action: "Research First" },
    { id: 4, company: "Local Business Co.", industry: "Retail", industryFit: 15, contactQuality: 8, dataCompleteness: 8, score: 31, action: "Low Priority" }
  ];
  const allLeads = [
    ...dbLeads.map((lead) => ({
      id: lead._id,
      company: lead.companyName,
      industry: lead.industry,
      score: lead.leadScore ?? 0,
      action:
        lead.leadScore >= 80 ? "Contact Now" : lead.leadScore >= 50 ? "Research First" : "Low Priority",
      priority: lead.priority,
      reasons: lead.reasons,
    })),
    ...leads,
  ];
  const uniqueLeads = allLeads.filter((lead, index, arr) =>
    index === arr.findIndex(
      (item) =>
        item.company.trim().toLowerCase() === lead.company.trim().toLowerCase()
    )
  );

  const scoredLeads = uniqueLeads.map((lead) => ({
    ...lead,
    score: lead.industryFit !== undefined &&
      lead.contactQuality !== undefined &&
      lead.dataCompleteness !== undefined ? lead.industryFit + lead.contactQuality + lead.dataCompleteness : lead.score,
  }));

  const filteredLeads = scoredLeads.filter(lead => lead.company.toLowerCase().includes(search.toLowerCase()));
  const exportCSV = () => {
    const headers = ["Company", "Industry", "Score", "Priority", "Next Best Action"];
    const rows = filteredLeads.map((lead) => [lead.company, lead.industry, lead.score, lead.score >= 80 ? "High" : lead.score >= 50 ? "Medium" : "Low", lead.action]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replace(/"/g, "")}"`).join(",")).join("\n");
    const blob = new Blob([csv], { typr: "text/csv;charset=uft-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "LeadIQ_Leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  };
  const handleSaveLead = async () => {
    if (!companyName.trim() || !industry.trim()) {
      alert("Please enter Company Name and Industry");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName, industry, website, contactName,
        }),
      });
      if (!response.ok) {
        throw new Error(await response.text());

      }
      const newLead = await response.json();
      setDbLeads((previous) => [...previous, newLeas]);
      setCompanyName("");
      setIndustry("");
      setwebsite("");
      setContactName("");
      alert("Lead saved successfully!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: "35px", fontfamily: "Arial", textAlign: "center" }}>

      <h1 style={{ textAlign: "center", marginBottom: "8px" }}>LeadIQ</h1>

      <p style={{ textAlign: "center", width: "100%", margin: "0 auto 30px" }}>Intelligent Lead Prioritization & Action Engine</p>

      <h2>Lead Dashboard</h2>
      <div style={{
        padding: "20px",
        margin: "20px auto",
        maxWidth: "500px",
        border: "1px solid #ddd",
        borderRadius: "10px"
      }}>
        <h3>Add New Lead </h3>

        <input
          type="text"
          placeholder="Company Name"
          value={companyName}
          onChange={(e) =>
            setCompanyName(e.target.value)} />
        <input
          placeholder="Industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)} />
        <input
          placeholder="Website"
          value={website}
          onChange={(e) => setwebsite(e.target.value)} />
        <input
          placeholder="Contact Name"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)} />
        <button type="button" onClick={handleSaveLead}>Save Lead</button>

      </div>

      <button onClick={exportCSV}>Export CSV</button>
      <input
        type="text"
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "12px", width: "280px", marginBottom: "20px" }}
      />
      <table className="leads-table">
        <thread>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>Lead Score</th>
            <th>Priority</th>
            <th>Next Best Action</th>

          </tr>
        </thread>
        <tbody>
          {filteredLeads.map((lead) => (
            <tr key={lead.id} onClick={() => setSelectedLead(lead)} style={{ cursor: "pointer" }}>
              <td>{lead.company}</td>
              <td>{lead.industry}</td>
              <td>{lead.score}/100</td>
              <td>{lead.score >= 80 ? "High" : lead.score >= 50 ? "Medium" : "Low"}</td>
              <td>{lead.action}</td>

            </tr>
          ))}
        </tbody>
      </table>
      {selectedLead && (
        <div style={{
          marginTop: "25px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          backgroundColor: "#f8fafc"
        }}>
          <h2>Why This Lead?</h2>
          <h3>{selectedLead.company}</h3>
          <p>Industry:{selectedLead.industry}</p>
          <p>Lead Score:{selectedLead.score}</p>
          <h3>Lead Score Breakdown</h3>
          <p>Industry Fit:{selectedLead.industryFit ?? "Not evaluated"}/40</p>
          <p>Contact Quality:{selectedLead.contactQuality ?? "Not evaluated"}/30</p>
          <p>Data Completeness:{selectedLead.dataCompleteness ?? "Not evaluated"}/30</p>
          <p>Lead Strength:{selectedLead.score >= 80 ? "Strong" : "Needs Improvement"}</p>
          <p>Score:{selectedLead.score}/100</p>
          <p>Recommendation:{selectedLead.action}</p>
          <p>
            Priority:{selectedLead.score >= 80 ? "High"
              : selectedLead.score >= 50 ? "Medium" : "Low"}
          </p>
          <p>Next Best Action:{selectedLead.action}</p>
          <button onClick={() => setSelectedLead(null)}>
            close Details
          </button>
        </div>
      )}
    </div>

  );
}
export default App;