const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const cors = require("cors");

const app = express();

// Use environment variables for configuration
const port = process.env.PORT || 5000; // Use the PORT environment variable or default to 5000

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests from localhost and production URL
            const allowedOrigins = [
                "http://localhost:3000", // React app running locally
                "https://salmon-river-05baed90f.6.azurestaticapps.net", // Production URL
            ];
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"], // Allow specific HTTP methods
        allowedHeaders: ["Content-Type"], // Allow specific headers
    })
);

// Azure SQL Database Configuration
const dbConfig = {
    user: "awaneesh497@awaneeshcv", // Replace with your Azure SQL username
    password: "8@12A3kx2j4hf", // Replace with your Azure SQL password
    server: "awaneeshcv.database.windows.net", // Replace with your Azure SQL server name
    database: "AwaneeshCV", // Replace with your Azure SQL database name
    options: {
        encrypt: true, // Use encryption for Azure SQL
        trustServerCertificate: false, // Ensure server certificate is validated
    },
};

// Test Database Connection
sql.connect(dbConfig)
    .then(() => console.log("Connected to Azure SQL Database successfully!"))
    .catch((err) => {
        console.error("Failed to connect to Azure SQL Database:", err.message);
        process.exit(1); // Exit the server if the database connection fails
    });

// API Endpoint to Save Contact Us Details
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    // Validate request body
    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        // Connect to Azure SQL Database
        const pool = await sql.connect(dbConfig);

        // Insert Data into the Table
        await pool
            .request()
            .input("Name", sql.NVarChar, name)
            .input("Email", sql.NVarChar, email)
            .input("Message", sql.NVarChar, message)
            .query(
                "INSERT INTO ContactUs (Name, Email, Message) VALUES (@Name, @Email, @Message)"
            );

        res.status(200).json({ message: "Contact details saved successfully." });
    } catch (error) {
        console.error("Database error:", error.message); // Log the full error
        res.status(500).json({ error: "Failed to save contact details.", details: error.message });
    }
});

// Start the Server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});