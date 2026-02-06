<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>Pilot Studio | Admin Panel</title>
    <link href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;600&display=swap" rel="stylesheet">
    <style>
        :root { --accent: #0071e3; --bg: #000; --panel: #1c1c1e; --border: #333; }
        * { box-sizing: border-box; font-family: 'SF Pro Display', sans-serif; }
        body { margin: 0; background: var(--bg); color: white; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
        
        /* Header */
        .nav { height: 55px; background: rgba(0,0,0,0.8); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 20px; z-index: 100; }
        .logo { font-weight: 600; font-size: 15px; }

        .main { flex: 1; display: flex; overflow: hidden; }

        /* Sidebars */
        .sidebar { width: 280px; background: var(--panel); padding: 20px; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
        .sidebar-left { width: 75px; border-right: none; border-left: 1px solid var(--border); align-items: center; padding-top: 20px; }
        
        /* Canvas Area */
        .canvas { flex: 1; background: #080808; display: flex; justify-content: center; align-items: center; overflow: auto; background-image: radial-gradient(#222 1px, transparent 1px); background-size: 20px 20px; }
        #site-wrapper { width: 90%; height: 95%; background: white; color: black; border-radius: 4px; position: relative; overflow-y: auto; padding: 50px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); transition: 0.4s ease; }
        #site-wrapper.mobile { width: 375px; height: 812px; border-radius: 40px; border: 12px solid #333; }

        /* Inspector UI */
        .control-group { margin-bottom: 20px; }
        .control-group label { display: block; font-size: 11px; color: #86868b; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
        .input { width: 100%; background: #2c2c2e; border: 1px solid #444; color: white; padding: 10px; border-radius: 8px; font-size: 13px; }
        .input:focus { border-color: var(--accent); outline: none; }
        
        .tool-btn { width: 45px; height: 45px; background: #2c2c2e; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; margin-bottom: 15px; transition: 0.2s; border: 1px solid transparent; }
        .tool-btn:hover { border-color: var(--accent); background: #3a3a3c; }

        /* Editable Elements Styles */
        .editable { transition: 0.2s; position: relative; cursor: pointer; }
        .editable:hover { outline: 2px dashed var(--accent); outline-offset: 3px; }
        .selected-node { outline: 2px solid var(--accent) !important; outline-offset: 3px; }
    </style>
</head>
<body>

    <nav class="nav">
        <div class="logo">PILOT STUDIO <span style="font-weight:300; opacity:0.6">PRO</span></div>
        <div style="display:flex; gap:10px;">
            <button onclick="setDevice('desktop')" style="background:none; color:white; border:1px solid #444; padding:5px 12px; border-radius:6px; cursor:pointer;">Desktop</button>
            <button onclick="setDevice('mobile')" style="background:none; color:white; border:1px solid #444; padding:5px 12px; border-radius:6px; cursor:pointer;">Mobile</button>
        </div>
    </nav>

    <div class="main">
        <aside class="sidebar-left">
            <div class="tool-btn" onclick="addNode('h1')">H1</div>
            <div class="tool-btn" onclick="addNode('p')">Aa</div>
            <div class="tool-btn" onclick="addNode('button')">🔘</div>
        </aside>

        <main class="canvas">
            <div id="site-wrapper">
                <div id="live-site">
                    <h1 class="editable">הכותרת שלך</h1>
                    <p class="editable">לחץ כאן כדי להתחיל לערוך את התוכן.</p>
                </div>
            </div>
        </main>

        <aside class="sidebar">
            <div style="font-size: 11px; font-weight:600; color:#86868b; margin-bottom:20px;">INSPECTOR</div>
            
            <div class="control-group">
                <label>תוכן טקסט</label>
                <input type="text" id="prop-text" class="input" placeholder="בחר אלמנט...">
            </div>

            <div class="control-group">
                <label>צבע גופן</label>
                <input type="color" id="prop-color" class="input" style="height:40px; padding:2px;">
            </div>

            <div class="control-group">
                <label>גודל גופן (px)</label>
                <input type="number" id="prop-size" class="input">
            </div>

            <div class="control-group">
                <label>עיגול פינות (px)</label>
                <input type="number" id="prop-radius" class="input">
            </div>

            <button onclick="deleteNode()" style="width:100%; background:#ff453a15; color:#ff453a; border:1px solid #ff453a; padding:12px; border-radius:8px; cursor:pointer; margin-top:auto;">🗑️ מחק אלמנט</button>
        </aside>
    </div>

    <script src="editor.js"></script>
</body>
</html>
