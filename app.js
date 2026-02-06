require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const CONTENT_FILE = './site_content.json';

// שליפת תוכן ועיצוב
app.get('/get-content', (req, res) => {
    try {
        if (fs.existsSync(CONTENT_FILE)) {
            res.json(JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')));
        } else {
            res.json({
                config: { primaryColor: "#0071e3", borderRadius: "12px", showChat: true },
                hero: { title: "כותרת פיילוט", subtitle: "משפט השראה כאן" },
                about: { text: "קצת עלינו..." },
                services: [
                    { id: 1, name: "קורס פרימיום", price: "499" }
                ]
            });
        }
    } catch (e) { res.status(500).send("Error"); }
});

// שמירה
app.post('/update-content', (req, res) => {
    const { password, newContent } = req.body;
    if (password === "pilot2026") { 
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2));
        res.json({ status: "success" });
    } else { res.status(403).json({ status: "error" }); }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
