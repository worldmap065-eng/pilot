require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const CONTENT_FILE = './site_content.json';

// שליפת תוכן
app.get('/get-content', (req, res) => {
    if (fs.existsSync(CONTENT_FILE)) {
        res.json(JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8')));
    } else {
        res.json({
            config: { primaryColor: "#0071e3", borderRadius: "12px", darkMode: false },
            hero: { title: "כותרת האתר שלך", subtitle: "כאן כותבים משפט שיווקי חזק" },
            buttons: { main: "התחילו עכשיו", contact: "צור קשר" }
        });
    }
});

// שמירת תוכן (הפאנל ישלח את הסיסמה רק בשמירה)
app.post('/update-content', (req, res) => {
    const { password, newContent } = req.body;
    if (password === "admin123") { // הסיסמה שלך
        fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2));
        res.json({ status: "success" });
    } else {
        res.status(403).json({ status: "error" });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Admin Engine Ready on ${PORT}`));
