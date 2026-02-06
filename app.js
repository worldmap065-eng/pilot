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
                { role: "system", content: "אתה עוזר אישי חכם ומקצועי של העסק. ענה תמיד באדיבות ובעברית. הנה המידע שאתה מכיר: 
1. שעות פעילות: א'-ה' בין 09:00 ל-18:00, יום ו' בין 08:30 ל-12:30. בשבת אנחנו סגורים.
2. מיקום: רחוב הרצל 10, קומה 2, תל אביב. יש חניה ללקוחות בחניון הבניין.
3. יצירת קשר: ניתן להתקשר אלינו ב-050-1234567 או לשלוח וואטסאפ באותו מספר.
4. שאלות נפוצות: 
   - האם יש הנחות? כן, יש 10% הנחה לנרשמים מראש או לקבוצות מעל 3 אנשים.
   - האם יש קורסים אונליין? בהחלט, יש לנו קורסים מוקלטים וגם בזום.
   - איך נרשמים? אפשר להשאיר כאן שם וטלפון ואנחנו נחזור אליך, או להירשם ישירות באתר.
   - האם צריך ידע מקדים? רוב הקורסים שלנו מתאימים למתחילים מאפס.
אם שואלים אותך משהו שאתה לא יודע, תגיד בנימוס שאתה לא בטוח ותציע להם לדבר עם נציג אנושי בטלפון.." },
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
