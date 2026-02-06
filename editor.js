/* Pilot Engine - Logic Source */

const frame = document.getElementById('site-frame');
const propsPanel = document.getElementById('props-panel');
let selectedNode = null;

// 1. ניהול תצוגה (Desktop/Mobile)
function setMode(mode, btn) {
    document.querySelectorAll('.sw-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    frame.className = (mode === 'mobile') ? 'mobile' : '';
}

// 2. הזרקת יכולות עריכה לתוך האתר ברגע שהוא נטען
frame.onload = function() {
    const doc = frame.contentDocument;
    
    // הזרקת CSS של העורך לתוך האתר כדי לסמן אלמנטים
    const editorStyle = doc.createElement('style');
    editorStyle.innerHTML = `
        .pilot-active { outline: 2px solid #007aff !important; outline-offset: 3px; cursor: pointer; }
        [contenteditable]:focus { outline: 2px solid #007aff; }
    `;
    doc.head.appendChild(editorStyle);

    // האזנה ללחיצות בתוך ה-iframe
    doc.body.addEventListener('click', (e) => {
        e.preventDefault();
        
        // הסרת סימון קודם
        if (selectedNode) selectedNode.classList.remove('pilot-active');
        
        // בחירת אלמנט חדש
        selectedNode = e.target;
        selectedNode.classList.add('pilot-active');
        selectedNode.contentEditable = "true"; // מאפשר עריכת טקסט ישירה
        
        // הצגת פאנל ההגדרות
        propsPanel.style.display = 'block';
    });
};

// 3. הוספת אלמנטים חדשים
function addNew(type) {
    const doc = frame.contentDocument;
    const el = doc.createElement(type);
    el.innerText = type === 'button' ? 'כפתור חדש' : 'טקסט חדש';
    el.style.padding = "10px";
    el.style.margin = "10px";
    if(type === 'button') {
        el.style.background = "#007aff";
        el.style.color = "white";
        el.style.borderRadius = "8px";
        el.style.border = "none";
    }
    doc.body.appendChild(el);
}

// 4. מחיקה
function deleteNode() {
    if (selectedNode) {
        selectedNode.remove();
        selectedNode = null;
        propsPanel.style.display = 'none';
    }
}
