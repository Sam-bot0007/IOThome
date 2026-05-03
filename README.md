# Home IoT Security

**A free, plain-English check-up for your smart home devices.**

Find out if your camera, speaker, smart plug, or light is safe — and get exact step-by-step instructions for what to fix.

---

## What it does

Smart cameras, speakers, plugs, lights and locks all connect to the internet. Many are full of security holes. This tool helps anyone — no technical knowledge needed — work out:

1. **How safe** their smart device actually is (a "safety score" out of 4)
2. **Where the weak points are** (broken down by category)
3. **What to do about it** — concrete step-by-step actions, ranked by importance

The check covers 23 things across 7 areas: how you log in, how your data is protected, how the device talks to the internet, how it gets updates, what privacy practices it follows, how physically secure it is, and what kind of company is behind it.

The framework underneath is built on three internationally-recognised IoT security standards: OWASP IoT Top 10, ENISA Baseline Recommendations, and NIST IR 8425. The technical rigour is unchanged from the academic version; the difference is the language.

---

## How to run it

This is a static website. No setup, no server, no installation.

1. Unzip the bundle.
2. Double-click `index.html`.

It opens in your browser and runs entirely on your own device. Nothing is sent anywhere.

If your browser blocks `file://` URLs (rare), run a local server from the unzipped folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

**Browser support:** any modern browser released in the last 3 years (Chrome, Firefox, Safari, Edge).

---

## How to use it

The app has six sections:

1. **Home** — introduction and three example device profiles you can preview
2. **Check device** — answer 23 questions about your device. Each has a help bubble explaining what it means and how to find out.
3. **Result** — your safety score, breakdown by category, top issues
4. **Fix it** — the most important section. Personalised, prioritised step-by-step actions for what to do.
5. **Compare** — side-by-side comparison of your device vs example profiles
6. **Learn** — browse all 23 checks to understand what we're looking for

Your answers are saved automatically as you go. Refresh the page and you're exactly where you left off.

---

## What's in this bundle

```
index.html       Entry point — open this
styles.css       All styling
framework.js     The 23 security checks, scoring rubrics, and recommended actions
app.js           Application logic — state management, view rendering
README.md        This file
```

Total bundle size: ~80 KB. No external dependencies. No tracking. No analytics.

---

## Privacy

- Your answers stay on your own device (in your browser's local storage).
- Nothing is sent anywhere. No accounts, no sign-up, no email required.
- You can clear your data at any time from your browser settings.

---

## About

This tool was developed as part of a BSc (Hons) Cyber Security final-year project at Manchester Metropolitan University by Muhammad Sami Ullah Shah (Student ID 23639752).

The technical framework underneath is documented in detail in the project dissertation.
