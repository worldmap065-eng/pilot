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
const CONTENT_FILE = './site_content.json'; // קובץ התוכן של האתר

// בדיקת טעינת המפתח
console.log("המפתח של Groq:", process.env.GROQ_API_KEY ? "נטען בהצלחה" : "חסר בקובץ .env");

// --- פונקציות עזר לניהול תוכן (CMS) ---

// 1. שליפת תוכן האתר (עבור index.html ו-admin.html)
app.get('/get-content', (req, res) => {
    try {
        if (fs.existsSync(CONTENT_FILE)) {
            const data = fs.readFileSync(CONTENT_FILE, 'utf8');
            res.json(JSON.parse(data));
        } else {
            // תוכן ברירת מחדל ראשוני
            const defaultContent = {
                hero_title: "ברוכים הבאים לפיילוט",
                hero_subtitle: "העתיד של הלמידה כבר כאן",
                about_text: "אנחנו מציעים קורסים טכנולוגיים מתקדמים לכל רמה.",
                contact_phone: "050-1234567"
            };
            res.json(defaultContent);
        }
    } catch (e) {
        res.status(500).json({ status: "error", message: "נכשלה טעינת התוכן" });
    }
});

// 2. עדכון תוכן האתר מפאנל הניהול
app.post('/update-content', (req, res) => {
    const { password, newContent } = req.body;
    
    // סיסמת ניהול פשוטה - שנה אותה למה שתרצה
    if (password === "pilot2026") { 
        try {
            fs.writeFileSync(CONTENT_FILE, JSON.stringify(newContent, null, 2));
            res.json({ status: "success", message: "האתר עודכן בהצלחה!" });
        } catch (e) {
            res.status(500).json({ status: "error", message: "נכשלה שמירת התוכן" });
        }
    } else {
        res.status(403).json({ status: "error", message: "סיסמה שגויה" });
    }
});

// --- בוט השיחה (הקוד ששלחת עם התאמות קטנות) ---

app.post('/send-pilot', async (req, res) => {
    const userMessage = req.body.message;
    let history = [];

    try {
        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }
    } catch (e) { history = []; }

    try {
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { 
                    role: "system", 
                    content: `אתה עוזר אישי חכם ומקצועי של העסק. ענה תמיד באדיבות ובעברית. 
                    הנה המידע המלא שאתה מכיר על העסק:
                    1. שעות פעילות: ימים א'-ה' בין 09:00 ל-18:00, יום ו' בין 08:30 ל-12:30. בשבת אנחנו סגורים.
                    2. מיקום: רחוב הרצל 10, קומה 2, תל אביב.
                    3. יצירת קשר: טלפון או וואטסאפ במספר 050-1234567. אימייל: office@pilot.com.
                    4. שאלות נפוצות: יש 10% הנחה לנרשמים מראש. הקורסים מתאימים למתחילים. ניתן לבטל עד 48 שעות מראש.`
                },
                ...history,
                { role: "user", content: userMessage }
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const reply = completion.choices[0]?.message?.content || "";

        history.push({ role: "user", content: userMessage });
        history.push({ role: "assistant", content: reply });
        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history.slice(-20), null, 2));

        res.json({ status: "success", info: reply, reply: reply });

    } catch (error) {
        console.error("Groq Error:", error.message);
        res.status(500).json({ status: "error", reply: "תקלה בחיבור לשרת." });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 השרת רץ על פורט ${PORT}`));
