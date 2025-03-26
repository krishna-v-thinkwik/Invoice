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
    console.log("Received order request:", req.body);

    const { order } = req.body;
    if (!order || typeof order !== "string") {
        console.log("❌ Invalid order format");
        return res.status(400).json({ error: "Invalid 'order'. Provide a string." });
    }

    if (storedAmounts.length === 0) {
        console.log("❌ Amounts data missing");
        return res.status(400).json({ error: "Amounts data missing. Send amounts first." });
    }

    console.log("✅ Stored amounts:", storedAmounts);

    const orderItems = order.split(/\s*and\s*/);
    console.log("✅ Extracted order items:", orderItems);

    const items = orderItems.map((item, index) => {
        console.log(`🔎 Processing item: ${item}`);

        // Adjust regex based on input format
        const match = item.match(/(\d+)\s(.+)/);
        console.log("🔎 Match result:", match);

        if (!match) {
            console.log("❌ Match failed for:", item);
            return null;
        }

        return {
            name: match[2].trim(),
            currency: "USD",
            amount: storedAmounts[index] || 0, // Assign stored amount dynamically
            qty: parseInt(match[1], 10)
        };
    }).filter(Boolean); // Remove null values if any match fails

    console.log("✅ Final parsed items:", items);
    res.json(items);
});


// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
});
