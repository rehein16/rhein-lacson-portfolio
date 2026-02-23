# Rheinel Fred M. Lacson — Portfolio 
Live Website: https://rheinlacson.netlify.app/

---

## 📁 Project Structure

```
rfl-portfolio/
├── index.html              ← Main HTML file (all sections)
├── css/
│   └── style.css           ← All styles (variables, layout, animations)
├── js/
│   └── script.js           ← Cursor, typewriter, scroll reveal, theme, form
├── assets/
│   └── images/
│       ├── rheinel-photo.png   ← Your photo (hero + about card)
│       └── rl-logo.png         ← RL Logo reference
└── README.md               ← This file
```

---

## 🚀 How to Run Locally

1. Open the `rfl-portfolio/` folder in **Visual Studio Code**
2. Install the **Live Server** extension (by Ritwick Dey) if you haven't
3. Right-click `index.html` → **Open with Live Server**
4. Your portfolio opens at `http://127.0.0.1:5500`

> No build tools, no npm, no dependencies. Pure HTML, CSS, JS.

---

## ✏️ What to Customize

### 1. Certification Links
In `index.html`, find the `<a href="REPLACE_WITH_YOUR_CERT_URL_X">` tags inside the Certifications section and replace with your real verification URLs.

### 2. Project Links
Search for `href="#"` inside the Projects section and replace with your:
- Live demo URLs
- GitHub repository URLs

### 3. Contact Info
Update your:
- Phone number
- Email
- GitHub username
- LinkedIn URL

### 4. Resume PDF
Add your resume PDF to `assets/` and name it `Rheinel-Lacson-Resume.pdf`
(The download button in the Resume section already points to this path)

### 5. Photo
Your photo is already in `assets/images/rheinel-photo.png`
If you update it, keep the same filename or update the `src` in `index.html`

---

## 🎨 Theme

- **Dark mode** (default): Midnight + Amber + Soft White
- **Light mode**: Warm parchment + Amber
- Toggle button in the nav — preference is saved to `localStorage`

---

## 🔮 Sections

| # | Section | ID |
|---|---|---|
| 0 | Hero (full-bleed photo + floating tech icons) | `#hero` |
| 1 | About | `#about` |
| 2 | Projects | `#projects` |
| 3 | Skills & Tools | `#skills` |
| 4 | Certifications | `#certifications` |
| 5 | Resume / Timeline | `#resume` |
| 6 | Contact | `#contact` |

---

## 📬 Contact Form

The form currently simulates a send. To make it functional:

**Option A — Formspree (easiest, free):**
1. Go to [formspree.io](https://formspree.io), create a form
2. Replace the form action in `index.html`:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
3. Remove the `novalidate` attribute and the JS form handler

**Option B — EmailJS:**
1. Sign up at [emailjs.com](https://emailjs.com)
2. Follow their SDK setup guide
3. Update `script.js` `contactForm` handler with EmailJS send call

---

## 🌐 Deployment

### Netlify (recommended — free)
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the `rfl-portfolio/` folder
3. Your site is live instantly with a free URL

### Vercel
1. Push to GitHub
2. Import repo at [vercel.com](https://vercel.com)
3. Deploy with zero config

---

## 🔄 Version History

| Version | Date | Notes |
|---|---|---|
| v1.0 | Feb 2026 | Initial release — all sections, dark/light mode |

---

*Continuous Improvement. Relentless. — Rheinel Fred M. Lacson*
