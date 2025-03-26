const express = require("express");

const app = express();
const port = process.env.PORT || 3000; // Render assigns a dynamic port

// Middleware to parse JSON body
app.use(express.json());

app.post("/parse-order", (req, res) => {
    const { order, amounts } = req.body;

    if (!order || !Array.isArray(amounts) || amounts.length === 0) {
        return res.status(400).json({ error: "Invalid parameters. Provide 'order' as a string and 'amounts' as an array." });
    }

    // Extracting items using regex
    const matches = [...order.matchAll(/(\d+)\s([a-zA-Z\s]+?)(?:\sand|$)/g)];

    // Creating the items array
    const items = matches.map((match, index) => {
        return {
            name: match[2].trim(),
            currency: "USD",
            amount: amounts[index] || 0, // Assign amount dynamically
            qty: parseInt(match[1], 10)
        };
    });

    res.json({ items });
});

// Bind to "0.0.0.0" for Render deployment
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
