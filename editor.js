// משתנים לשליטה
const frame = document.getElementById('site-frame');
const props = document.getElementById('props-panel');
let currentEl = null;

// 1. שינוי תצוגה (מחשב/מובייל)
function changeView(mode, btn) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    frame.className = (mode === 'mobile') ? 'mobile' : '';
}

// 2. הפעלת העריכה כשהאתר נטען
frame.onload = function() {
    const doc = frame.contentDocument;
    
    // הוספת סגנון סימון לאתר שבתוך ה-iframe
    const style = doc.createElement('style');
    style.innerHTML = `
        .selected { outline: 2px solid #007aff !important; outline-offset: 2px; }
        *:hover { cursor: pointer; }
    `;
    doc.head.appendChild(style);

    // האזנה ללחיצות בתוך האתר
    doc.body.addEventListener('click', (e) => {
        e.preventDefault(); // מונע מהכפתורים באתר לעבור דף
        
        if (currentEl) currentEl.classList.remove('selected');
        
        currentEl = e.target;
        currentEl.classList.add('selected');
        currentEl.contentEditable = "true"; // מאפשר לערוך טקסט בלחיצה
        
        props.style.display = 'block';
    });
};

// 3. הוספת אלמנטים חדשים
function createNew(tag) {
    const doc = frame.contentDocument;
    const el = doc.createElement(tag);
    el.innerText = tag === 'button' ? 'כפתור חדש' : 'טקסט חדש';
    el.style.margin = "10px";
    if(tag === 'button') {
        el.style.padding = "10px 20px";
        el.style.background = "#007aff";
        el.style.color = "white";
        el.style.border = "none";
        el.style.borderRadius = "8px";
    }
    doc.body.appendChild(el);
}

// 4. מחיקה
function removeNode() {
    if (currentEl) {
        currentEl.remove();
        currentEl = null;
        props.style.display = 'none';
    }
}
