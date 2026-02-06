/* Pilot Studio Engine - Stable Version */

const frame = document.getElementById('site-frame');
const propsPanel = document.getElementById('props-panel');
const textInput = document.getElementById('el-text-input');
let selectedNode = null;

// 1. שינוי מצב תצוגה
function uiSetMode(mode, btn) {
    document.querySelectorAll('.sw-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    frame.className = (mode === 'mobile') ? 'mobile' : '';
}

// 2. הזרקת יכולות עריכה לאתר
frame.onload = function() {
    const doc = frame.contentDocument || frame.contentWindow.document;
    
    // הזרקת עיצוב סימון לתוך ה-iframe
    const style = doc.createElement('style');
    style.innerHTML = `
        .pilot-selected { outline: 2px solid #007aff !important; outline-offset: 3px; cursor: pointer; }
        [contenteditable]:focus { outline: 2px solid #007aff; border-radius: 4px; }
    `;
    doc.head.appendChild(style);

    // האזנה ללחיצות בתוך האתר
    doc.body.addEventListener('click', (e) => {
        e.preventDefault();
        
        // הסרת בחירה קודמת
        if (selectedNode) selectedNode.classList.remove('pilot-selected');
        
        // בחירת אלמנט חדש
        selectedNode = e.target;
        selectedNode.classList.add('pilot-selected');
        selectedNode.contentEditable = "true";
        
        // עדכון הפאנל הצף
        propsPanel.style.display = 'block';
        textInput.value = selectedNode.innerText;
    });
};

// 3. עדכון טקסט בזמן אמת מהפאנל
textInput.addEventListener('input', (e) => {
    if (selectedNode) {
        selectedNode.innerText = e.target.value;
    }
});

// 4. הוספת אלמנטים
function uiAddNew(type) {
    const doc = frame.contentDocument || frame.contentWindow.document;
    const el = doc.createElement(type);
    el.innerText = type === 'button' ? 'כפתור חדש' : 'טקסט חדש';
    
    if(type === 'button') {
        el.style.background = "#007aff";
        el.style.color = "white";
        el.style.padding = "12px 24px";
        el.style.borderRadius = "10px";
        el.style.border = "none";
        el.style.display = "inline-block";
        el.style.cursor = "pointer";
    }
    
    doc.body.appendChild(el);
}

// 5. מחיקת אלמנט
function uiDeleteNode() {
    if (selectedNode) {
        selectedNode.remove();
        selectedNode = null;
        propsPanel.style.display = 'none';
    }
}
