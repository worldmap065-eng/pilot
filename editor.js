/* PILOT STUDIO ENGINE v3.0 - STABLE 
   קוד יציב לניהול עריכה בזמן אמת
*/

// 1. הגדרת משתנים גלובליים
let selectedElement = null;

// 2. פונקציית בחירה - מופעלת בלחיצה על אלמנט באתר
function selectItem(el) {
    // הסרת סימון מאלמנט קודם
    if (selectedElement) {
        selectedElement.style.outline = "none";
        selectedElement.classList.remove('selected-node');
    }

    // הגדרת האלמנט החדש כנבחר
    selectedElement = el;
    selectedElement.style.outline = "2px solid #0071e3"; // סימון כחול של אפל
    selectedElement.style.outlineOffset = "4px";

    // --- עדכון הפאנל הימני בנתונים של האלמנט שנבחר ---
    const textInput = document.getElementById('prop-text');
    const colorInput = document.getElementById('prop-color');
    const sizeInput = document.getElementById('prop-size');
    const radiusInput = document.getElementById('prop-radius');

    if (textInput) textInput.value = el.innerText;
    
    // שליפת הסטייל הנוכחי מהדפדפן
    const computedStyle = window.getComputedStyle(el);
    if (sizeInput) sizeInput.value = parseInt(computedStyle.fontSize);
    if (radiusInput) radiusInput.value = parseInt(computedStyle.borderRadius) || 0;
}

// 3. האזנה ללחיצות על אלמנטים ניתנים לעריכה
// אנחנו משתמשים ב-Event Delegation כדי שזה יעבוד גם על אלמנטים חדשים שנוסיף
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('editable')) {
        selectItem(e.target);
    } else if (!e.target.closest('.sidebar') && !e.target.closest('.nav')) {
        // אם לחצו מחוץ לאלמנט ומחוץ לסרגלים - בטל בחירה
        if (selectedElement) {
            selectedElement.style.outline = "none";
            selectedElement.classList.remove('selected-node');
            selectedElement = null;
        }
    }
});

// 4. חיבור השדות בצד ימין לפעולות (שינוי בזמן אמת)

// שינוי טקסט
const textInp = document.getElementById('prop-text');
if (textInp) {
    textInp.addEventListener('input', (e) => {
        if (selectedElement) selectedElement.innerText = e.target.value;
    });
}

// שינוי צבע
const colorInp = document.getElementById('prop-color');
if (colorInp) {
    colorInp.addEventListener('input', (e) => {
        if (selectedElement) selectedElement.style.color = e.target.value;
    });
}

// שינוי גודל גופן
const sizeInp = document.getElementById('prop-size');
if (sizeInp) {
    sizeInp.addEventListener('input', (e) => {
        if (selectedElement) selectedElement.style.fontSize = e.target.value + 'px';
    });
}

// שינוי רדיוס פינות
const radiusInp = document.getElementById('prop-radius');
if (radiusInp) {
    radiusInp.addEventListener('input', (e) => {
        if (selectedElement) selectedElement.style.borderRadius = e.target.value + 'px';
    });
}

// 5. הוספת אלמנטים חדשים מהסרגל השמאלי
function addNode(type) {
    const liveArea = document.getElementById('live-site') || document.getElementById('site-wrapper');
    const newEl = document.createElement(type);
    newEl.className = 'editable';
    newEl.innerText = type === 'button' ? 'כפתור' : 'טקסט חדש';
    
    if (type === 'button') {
        newEl.style.background = '#0071e3';
        newEl.style.color = 'white';
        newEl.style.padding = '12px 24px';
        newEl.style.borderRadius = '12px';
        newEl.style.border = 'none';
        newEl.style.display = 'inline-block';
        newEl.style.marginTop = '10px';
    } else if (type === 'h1') {
        newEl.style.fontSize = '32px';
        newEl.style.fontWeight = '600';
    }

    liveArea.appendChild(newEl);
    selectItem(newEl); // בחר אוטומטית את האלמנט החדש
}

// 6. מחיקה
function deleteNode() {
    if (selectedElement && confirm('למחוק את האלמנט?')) {
        selectedElement.remove();
        selectedElement = null;
    }
}
