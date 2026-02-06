require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const HISTORY_FILE = './chat_history.json';

// בדיקת טעינת המפתח
console.log("המפתח של Groq:", process.env.GROQ_API_KEY ? "נטען בהצלחה" : "חסר בקובץ .env");

app.post('/send-pilot', async (req, res) => {
    const userMessage = req.body.message;
    let history = [];

    // טעינת זיכרון
    try {
        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) { history = []; }

    try {
        // שימוש במודל Llama 3 - מהיר בטירוף וחינמי
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
{ role: "system", content: "אתה עוזר אישי חכם ומקצועי של העסק. ענה תמיד באדיבות ובעברית. הנה המידע: שעות פעילות א-ה 09:00-18:00, יום ו 08:30-12:30. כתובת: הרצל 10, תל אביב. יש 10% הנחה לקבוצות מעל 3 או נרשמים מראש. אם שואלים משהו שאתה לא יודע, תציע לדבר עם נציג בטלפון 050-1234567." },
            ...history,
            { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        });

        const reply = completion.choices[0]?.message?.content || "";

        // עדכון זיכרון (20 הודעות אחרונות)
        history.push({ role: "user", content: userMessage });
        history.push({ role: "assistant", content: reply });
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-20), null, 2));

        res.json({ status: "success", info: reply });

    } catch (error) {
        console.error("Groq Error:", error.message);
        res.status(500).json({ status: "error", info: "תקלה בחיבור לשרת החינמי. נסה שוב." });
    }
});

const PORT = process.env.port || 10000;
app.listen(PORT, () => console.log(`🚀 השרת רץ${PORT}`));
