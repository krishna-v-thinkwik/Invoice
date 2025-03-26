const express = require("express");

const app = express();
const port = process.env.PORT || 3000; // Render assigns a dynamic port

app.use(express.json());

let storedAmounts = []; // Temporary storage for amounts

// Endpoint to receive amounts
app.post("/amounts", (req, res) => {
    const { amounts } = req.body;

    if (!Array.isArray(amounts) || amounts.length === 0) {
        return res.status(400).json({ error: "Invalid 'amounts'. Provide a non-empty array." });
    }

    storedAmounts = amounts; // Store amounts
    res.json({ message: "Amounts received successfully", amounts: storedAmounts });
});

// Endpoint to receive orders separately
app.post("/parse-order", (req, res) => {
    const { order } = req.body;

    if (!order || typeof order !== "string") {
        return res.status(400).json({ error: "Invalid 'order'. Provide a string." });
    }

    if (storedAmounts.length === 0) {
        return res.status(400).json({ error: "Amounts data missing. Send amounts first." });
    }

    // Extracting items from the order string
    const orderItems = order.split(/\s*and\s*/);

    const items = orderItems.map((item, index) => {
        const match = item.match(/(\d+)\s(.+)/); // Extracting quantity and name
        if (!match) return null;

        return {
            name: match[2].trim(),
            currency: "USD",
            amount: storedAmounts[index] || 0, // Assign stored amount dynamically
            qty: parseInt(match[1], 10)
        };
    }).filter(Boolean); // Remove null values if any match fails

    res.json({ items });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
