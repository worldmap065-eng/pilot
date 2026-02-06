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
    } catch (e) { 
        history = []; 
    }

    try {
        // שימוש במודל Llama 3 - מהיר בטירוף וחינמי
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: "אתה עוזר אישי חכם ומקצועי של העסק. ענה תמיד באדיבות ובעברית. הנה המידע על העסק: 1. שעות פעילות: א'-ה' בין 09:00 ל-18:00, יום ו' בין 08:30 ל-12:30. בשבת סגור. 2. מיקום: רחוב הרצל 10, קומה 2, תל אביב. 3. יצירת קשר: טלפון או וואטסאפ 050-1234567. 4. שאלות נפוצות: יש 10% הנחה לנרשמים מראש או לקבוצות מעל 3 אנשים. יש קורסים אונליין ובזום. רוב הקורסים מתאימים למתחילים. אם שואלים משהו שאתה לא יודע, תציע לדבר עם נציג בטלפון." 
                },
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

        // שליחת התשובה בפורמט כפול כדי למנוע שגיאות תצוגה בבוט
        res.json({ status: "success", info: reply, reply: reply });

    } catch (error) {
        console.error("Groq Error:", error.message);
        res.status(500).json({ status: "error", info: "תקלה בחיבור. נסה שוב.", reply: "תקלה בחיבור. נסה שוב." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 השרת רץ על פורט ${PORT}`));
