const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const leadRoutes = require("./routes/leadRoutes");
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB Connected Successfully!");
})
    .catch((error) => {
        console.error("MongoDB Connection Error:", error.message);
    });

//Middleware
app.use(cors());
app.use(express.json());

//Test route
app.get("/", (req, res) => {
    res.json({
        message: "LeadIQ Backend is running successfully!"

    });
});
//Server
const PORT = process.env.PORT || 5000;
app.use("/api/leads", leadRoutes);
app.listen(PORT, () => {
    console.log(`LeadIQ server running on port ${PORT}`);

});