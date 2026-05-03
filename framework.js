// =============================================================================
// Home IoT Security - Framework Data
//
// Built on three industry-leading security standards (OWASP IoT Top 10,
// ENISA Baseline Recommendations, NIST IR 8425), but presented in plain English
// so anyone can use it - no tech background required.
//
// All 23 security checks, scoring rubrics, category weights, risk bands, and
// the three reference device profiles are defined here.
// =============================================================================

const FRAMEWORK = {
  version: "1.0",
  name: "Home IoT Security",
  fullName: "Home IoT Security",
  brandLine: "Check if your smart home device is safe — in plain English",
  author: "Muhammad Sami Ullah Shah",
  studentId: "23639752",

  // Risk bands ----------------------------------------------------------------
  bands: [
    { id: "low",      min: 3.5,  max: 4.0,  label: "VERY SAFE",
      friendlyLabel: "Looking great",
      color: "#16a34a",
      action: "This device follows good security practices. Just keep its software up to date and you're in great shape." },
    { id: "moderate", min: 2.8,  max: 3.49, label: "MOSTLY SAFE",
      friendlyLabel: "Mostly safe with care",
      color: "#65a30d",
      action: "This device is reasonably secure if you take a few simple precautions. Follow the recommendations below." },
    { id: "elevated", min: 2.0,  max: 2.79, label: "NEEDS CARE",
      friendlyLabel: "Needs your attention",
      color: "#eab308",
      action: "This device has some real weaknesses. It can still be used safely, but only if you put protections in place. Read the recommendations." },
    { id: "high",     min: 1.0,  max: 1.99, label: "BE CAREFUL",
      friendlyLabel: "Use with caution",
      color: "#ea580c",
      action: "This device has serious security gaps. Use it only for non-sensitive things and keep it on a separate network from your main devices." },
    { id: "critical", min: 0.0,  max: 0.99, label: "NOT SAFE",
      friendlyLabel: "Not recommended",
      color: "#b91c1c",
      action: "This device fails on the basics of security. We don't recommend using it. Consider returning it or replacing it." }
  ],

  // Score rubric anchors ------------------------------------------------------
  scoreLevels: [
    { value: 0, label: "Major problem",  short: "Bad",      color: "#b91c1c" },
    { value: 1, label: "Weak",           short: "Weak",     color: "#ea580c" },
    { value: 2, label: "Okay",           short: "Okay",     color: "#eab308" },
    { value: 3, label: "Good",           short: "Good",     color: "#65a30d" },
    { value: 4, label: "Excellent",      short: "Great",    color: "#16a34a" }
  ],

  // Evidence tiers (kept for academic completeness, simplified labels) -------
  evidenceTiers: [
    { id: 1, label: "I tested it myself",
      description: "I tried it on the device, looked in settings, ran a tool to check, etc." },
    { id: 2, label: "From the maker's documentation",
      description: "I read the manual, the privacy policy, the security page, or independent reviews." },
    { id: 3, label: "I'm guessing",
      description: "Based on what I generally know about this brand or this type of product. Lower confidence." }
  ],

  // Categories with friendly labels and weights ------------------------------
  categories: [
    {
      id: "C1",
      name: "Logging in",
      academicName: "Authentication & Access Control",
      weight: 0.18,
      summary: "Whether the device makes you set a strong password and protects your account.",
      icon: "🔐",
      indicators: ["A1", "A2", "A3", "A4"]
    },
    {
      id: "C2",
      name: "Protecting your data",
      academicName: "Data Protection",
      weight: 0.16,
      summary: "Whether the device scrambles your information so other people can't read it.",
      icon: "🛡️",
      indicators: ["A5", "A6", "A7"]
    },
    {
      id: "C3",
      name: "Talking to the internet",
      academicName: "Network Exposure",
      weight: 0.14,
      summary: "How much the device exposes itself to the wider internet, and whether it can work without it.",
      icon: "🌐",
      indicators: ["A8", "A9", "A10"]
    },
    {
      id: "C4",
      name: "Updates and fixes",
      academicName: "Software Integrity & Updates",
      weight: 0.18,
      summary: "Whether the device gets security updates when problems are discovered.",
      icon: "⬆️",
      indicators: ["A11", "A12", "A13", "A14"]
    },
    {
      id: "C5",
      name: "Your privacy",
      academicName: "Privacy Practices",
      weight: 0.14,
      summary: "What information the device collects about you and who it shares with.",
      icon: "👁️",
      indicators: ["A15", "A16", "A17", "A18"]
    },
    {
      id: "C6",
      name: "Physical safety",
      academicName: "Physical Security",
      weight: 0.08,
      summary: "Whether someone with physical access to the device could break into it easily.",
      icon: "🔧",
      indicators: ["A19", "A20", "A21"]
    },
    {
      id: "C7",
      name: "The company behind it",
      academicName: "Vendor Practices",
      weight: 0.12,
      summary: "Whether the maker is open about security and has a good track record.",
      icon: "🏢",
      indicators: ["A22", "A23"]
    }
  ],

  // 23 indicators, plain-English ----------------------------------------------
  indicators: {
    A1: {
      id: "A1", category: "C1", name: "Default password",
      academicName: "Default Credentials",
      question: "When you first set the device up, did you have to make your own password?",
      help: "Some cheap devices come with a password printed on a sticker (like 'admin' or '1234'). That's a serious problem because anyone can find these online.",
      evidence: "Look at the setup steps you went through, or check the manual or the box.",
      rubric: [
        "There's no password at all — anyone can connect to it.",
        "It came with a password that's the same on every unit (like 'admin' or '0000').",
        "It came with its own unique password printed on a sticker, but didn't make me change it.",
        "It made me set my own password during setup.",
        "It made me set my own strong password (length and complexity rules) during setup."
      ]
    },
    A2: {
      id: "A2", category: "C1", name: "Password rules",
      academicName: "Password Strength",
      question: "Did the device let you pick a really weak password (like '1234' or 'password')?",
      help: "Strong devices won't let you use obvious passwords. They check the length, what characters you use, and ideally whether the password has been leaked online before.",
      evidence: "Try setting a weak password during setup or in the app's settings — does it let you?",
      rubric: [
        "Anything goes — even a blank password is accepted.",
        "Only checks length. '12345678' would be fine.",
        "Some basic rules — must include a number or symbol.",
        "Strong rules — length, complexity, and rejects obvious passwords.",
        "Strong rules and checks if your password has appeared in known leaks."
      ]
    },
    A3: {
      id: "A3", category: "C1", name: "Two-factor login",
      academicName: "Multi-Factor Authentication",
      question: "Can you turn on two-factor authentication (2FA) — where you also need a code from your phone to log in?",
      help: "Two-factor authentication means even if someone steals your password, they still can't get in. It's the single best thing you can do to protect any account.",
      evidence: "Check the device's app or its account website — is there a 2FA option in security settings?",
      rubric: [
        "No 2FA option at all.",
        "There's a 2FA option but it's hidden in obscure settings.",
        "There's a 2FA option in the normal settings.",
        "The setup actively suggested I turn 2FA on.",
        "2FA is required by default — I had to turn it on."
      ]
    },
    A4: {
      id: "A4", category: "C1", name: "Lockout after wrong passwords",
      academicName: "Brute Force Protection",
      question: "If someone keeps typing the wrong password, does the device lock them out?",
      help: "Without lockout, an attacker can run a program that tries thousands of passwords per second. With lockout, they get a few tries and then have to wait.",
      evidence: "Try entering the wrong password a few times — does it eventually block you?",
      rubric: [
        "No lockout — keeps letting you try forever.",
        "Locks out only after 50+ failed attempts.",
        "Locks out after about 10–20 tries.",
        "Locks out after fewer than 10 and warns you.",
        "Locks out, warns you, and notifies the account owner."
      ]
    },
    A5: {
      id: "A5", category: "C2", name: "Encrypted connection",
      academicName: "Encryption in Transit",
      question: "Does the device scramble (encrypt) your data while it's being sent over the internet?",
      help: "Without encryption, anyone on the same WiFi (a coffee shop, a flatmate, a hacker on your network) can read what your device is sending. Encryption is the padlock you see in your browser.",
      evidence: "The maker's privacy or security page usually says whether they use TLS or HTTPS.",
      rubric: [
        "Sends data in plain text — anyone can read it.",
        "Sometimes encrypts, sometimes doesn't.",
        "Always encrypts but uses old, weak methods.",
        "Always encrypts properly with modern methods (TLS 1.2 or 1.3).",
        "Always encrypts AND verifies it's really talking to the right server (certificate pinning)."
      ]
    },
    A6: {
      id: "A6", category: "C2", name: "Stored data is encrypted",
      academicName: "Encryption at Rest",
      question: "Is the data stored on the device itself (recordings, settings, your account info) encrypted?",
      help: "If your device is stolen or someone takes it apart, encrypted data is unreadable. Unencrypted data — like camera recordings on a memory card — is wide open.",
      evidence: "Check the maker's security FAQ or technical documentation.",
      rubric: [
        "Everything is stored as plain text — fully readable.",
        "Passwords are encrypted but recordings/data aren't.",
        "Most things are encrypted, with some gaps.",
        "Everything sensitive is encrypted using software methods.",
        "Everything is encrypted and protected by a hardware security chip."
      ]
    },
    A7: {
      id: "A7", category: "C2", name: "Encryption keys",
      academicName: "Key Management",
      question: "If someone broke the encryption on one device, would all other devices be at risk too?",
      help: "Each device should have its own unique encryption keys. If they all share the same key, breaking one breaks all of them — that's how huge breaches happen.",
      evidence: "This is technical — usually only mentioned in the maker's security whitepaper.",
      rubric: [
        "Same key on every single device — one break compromises all.",
        "Each device has its own key, but they never change.",
        "Each device has its own key, and you can change it manually.",
        "Each device has its own key with regular automatic rotation.",
        "Each device has its own hardware-protected key with automatic rotation."
      ]
    },
    A8: {
      id: "A8", category: "C3", name: "Open ports",
      academicName: "Open Ports and Services",
      question: "Does the device leave a lot of 'doors' open to the internet (like Telnet or FTP)?",
      help: "Every open port is a potential way in for an attacker. Good devices only open the bare minimum they need to work.",
      evidence: "You can check this with a free tool called Nmap, or look at independent reviews.",
      rubric: [
        "Lots of doors open, including outdated and dangerous ones.",
        "Several doors open, including ones that aren't needed.",
        "A reasonable number of doors — only one or two questionable.",
        "Minimal — only what's needed for the device to work.",
        "Single secured door, everything else locked down."
      ]
    },
    A9: {
      id: "A9", category: "C3", name: "Works without internet",
      academicName: "Cloud Dependency",
      question: "Does the device still work if your internet goes down or the maker's servers go offline?",
      help: "Some smart devices stop working entirely without the maker's cloud — meaning if the company shuts down, your device becomes a brick. Local-first devices keep working no matter what.",
      evidence: "Try unplugging your router for a minute — does the device still work?",
      rubric: [
        "Doesn't work at all without the cloud.",
        "Mostly broken without the cloud — only basic indicators work.",
        "Works partially — main features lost.",
        "Most things work; cloud is just for remote access.",
        "Fully works on its own; cloud is optional."
      ]
    },
    A10: {
      id: "A10", category: "C3", name: "Works on a separate network",
      academicName: "Network Segmentation Support",
      question: "Will the device work properly if you put it on a separate WiFi network from your phone and laptop?",
      help: "Putting smart devices on a guest WiFi or IoT network protects your real computers if the smart device gets hacked. Some devices won't work this way, which is bad.",
      evidence: "Check the maker's setup guide — does it mention guest networks or VLANs?",
      rubric: [
        "Refuses to work without full access to your main network.",
        "Mostly broken on a separate network — many features lost.",
        "Works on a separate network with caveats — not officially supported.",
        "Officially supports running on a separate IoT network.",
        "Comes with full step-by-step guidance for separate-network setup."
      ]
    },
    A11: {
      id: "A11", category: "C4", name: "Gets security updates",
      academicName: "Update Mechanism",
      question: "Does the device get security updates automatically?",
      help: "Security flaws are constantly being discovered. A device that updates itself stays protected. A device that never updates becomes more dangerous over time.",
      evidence: "Check the device's settings or app — is there an update history? Or check the maker's site.",
      rubric: [
        "No way to update it at all.",
        "You have to download and install updates manually.",
        "Updates automatically but not securely (could be tampered with).",
        "Updates automatically and is signed (verified by the maker).",
        "Auto-updates with full verification and rollback if an update breaks things."
      ]
    },
    A12: {
      id: "A12", category: "C4", name: "How fast bugs are fixed",
      academicName: "Patch Cadence",
      question: "When a serious security bug is reported, how quickly does the maker fix it?",
      help: "There's a public database of known security bugs (CVEs). You can search for the device name there to see how the maker has handled past problems.",
      evidence: "Search for the device or maker name on cve.mitre.org or nvd.nist.gov.",
      rubric: [
        "Bugs go ignored — never fixed.",
        "Critical bugs take 6+ months to fix.",
        "Critical bugs typically fixed within 90 days.",
        "Critical bugs typically fixed within 60 days.",
        "Critical bugs fixed within 30 days, with a published commitment."
      ]
    },
    A13: {
      id: "A13", category: "C4", name: "Out-of-date components",
      academicName: "Outdated Components",
      question: "Is the device built using out-of-date software components with known problems?",
      help: "Smart devices are built from many software pieces. If those pieces aren't kept current, the whole device inherits their bugs. This is technical — most users won't be able to check it directly.",
      evidence: "Look for security audit reports, or 'I'm guessing' if unknown.",
      rubric: [
        "Multiple known-bad components built in.",
        "Several components badly out of date (12+ months stale).",
        "Mostly current, with one or two stale parts.",
        "Components actively maintained, minor lag.",
        "Everything current with a published software-bill-of-materials."
      ]
    },
    A14: {
      id: "A14", category: "C4", name: "How long it'll be supported",
      academicName: "Support Lifetime",
      question: "Has the maker promised how many years they'll keep providing security updates?",
      help: "A device without long-term support becomes unsafe over time. Look for an explicit support window (e.g. 'security updates until 2030').",
      evidence: "Check the product page or the maker's support policy.",
      rubric: [
        "No commitment — or already discontinued.",
        "Vague language without specific dates.",
        "Promised under 2 years.",
        "Promised 2–3 years with an end date.",
        "Promised 4+ years with an explicit end date."
      ]
    },
    A15: {
      id: "A15", category: "C5", name: "Privacy policy clarity",
      academicName: "Data Collection Transparency",
      question: "Does the maker clearly explain what information the device collects about you?",
      help: "A vague or missing privacy policy is a red flag. Good policies list specific things — 'we collect X, Y, and Z, for these reasons, kept for this long'.",
      evidence: "Read the privacy policy on the maker's site or in the app.",
      rubric: [
        "No privacy policy, or it's impossible to find.",
        "Generic boilerplate text without specifics.",
        "Some specifics, but with gaps.",
        "Clearly lists categories of data collected.",
        "Lists everything in plain English with examples and how long they keep it."
      ]
    },
    A16: {
      id: "A16", category: "C5", name: "Sharing with third parties",
      academicName: "Third-Party Sharing",
      question: "Does the maker share your data with advertisers or other companies — and can you stop them?",
      help: "Some 'smart' devices are basically data collection machines. They sell what they learn about you to advertisers, analytics companies, and others.",
      evidence: "The privacy policy will say. Look for words like 'partners', 'advertisers', 'analytics'.",
      rubric: [
        "Shares lots of data with third parties — and doesn't admit it.",
        "Shares data, admits it, but you can't opt out.",
        "Shares data with limited opt-out controls.",
        "Shares data with detailed opt-out controls.",
        "Doesn't share at all, or only with explicit opt-in consent."
      ]
    },
    A17: {
      id: "A17", category: "C5", name: "Your control over your data",
      academicName: "User Data Controls",
      question: "Can you see what data is held about you, download it, and delete it?",
      help: "Under GDPR you have the right to your data. Good makers make this easy. Bad ones make it impossible or require paperwork.",
      evidence: "Check the app's privacy settings, or search the maker's site for 'data request'.",
      rubric: [
        "No way to access or delete your data.",
        "Have to email customer service — no self-service option.",
        "Self-service deletion, but no data export.",
        "Self-service deletion AND basic export.",
        "Full GDPR rights honoured directly in the app."
      ]
    },
    A18: {
      id: "A18", category: "C5", name: "Only collects what's needed",
      academicName: "Data Minimisation",
      question: "Does the device only collect what it actually needs to work — or does it grab everything it can?",
      help: "A smart bulb doesn't need your contacts. A camera doesn't need your microphone history. Good devices stick to what they need.",
      evidence: "Look at what permissions the app asks for, and what the privacy policy lists.",
      rubric: [
        "Collects far more than it needs.",
        "Collects significantly more than needed, no opt-out.",
        "Some extra collection beyond function, with limits.",
        "Mostly function-tied, with optional extras.",
        "Strict — only collects what it strictly needs."
      ]
    },
    A19: {
      id: "A19", category: "C6", name: "Tamper resistance",
      academicName: "Tamper Resistance",
      question: "Can someone open the device with a regular screwdriver, or is it sealed?",
      help: "If a thief can pop open your smart lock or camera in seconds, it's not really secure. Good devices are sealed and show evidence if opened.",
      evidence: "Look at the device — visible screws? Sealed seams? Tamper stickers?",
      rubric: [
        "Falls open with a basic screwdriver.",
        "Easy to open with light effort, no tamper evidence.",
        "Sealed, with some signs if opened.",
        "Sealed and includes tamper-evidence stickers.",
        "Sealed with active tamper detection that reports to the user."
      ]
    },
    A20: {
      id: "A20", category: "C6", name: "Hidden debug ports",
      academicName: "Debug Interface Protection",
      question: "Does the device have hidden ports inside that someone could plug into to bypass security?",
      help: "Manufacturers leave debug ports (UART, JTAG) inside devices for testing. If they leave them active in the final product, an attacker with physical access can use them to break in. Hard for non-experts to check.",
      evidence: "This usually requires a teardown report from a security researcher. Use 'I'm guessing' if unknown.",
      rubric: [
        "Open shell access via a debug port — no password needed.",
        "Debug ports work with default credentials.",
        "Debug ports are present but require effort to access.",
        "Debug ports disabled in the released device.",
        "Debug ports physically removed from the released device."
      ]
    },
    A21: {
      id: "A21", category: "C6", name: "Secure first-time setup",
      academicName: "Secure Onboarding",
      question: "When you first paired the device with your phone, was the connection secure?",
      help: "Some devices broadcast in plain text during setup, meaning anyone nearby can intercept your WiFi password as you type it in.",
      evidence: "Look at the setup process — is it via Bluetooth, a hotspot, a QR code? Any of these can be done badly.",
      rubric: [
        "Plain text setup — anyone nearby can grab your WiFi password.",
        "Encrypted but doesn't verify it's really your device.",
        "Encrypted with one-way verification.",
        "Encrypted with two-way verification.",
        "Encrypted, two-way verified, hardware-backed."
      ]
    },
    A22: {
      id: "A22", category: "C7", name: "Reports security issues",
      academicName: "Vulnerability Disclosure Policy",
      question: "If a security researcher finds a problem, does the maker have a clear way for them to report it?",
      help: "Good companies invite security researchers to find problems. Bad companies threaten or ignore them. Look for a 'security.txt' file or a bug bounty programme.",
      evidence: "Check the maker's site for /security.txt or a 'report a vulnerability' page.",
      rubric: [
        "No policy and no security contact.",
        "Generic security email address but no policy.",
        "Has a published policy with a stated process.",
        "Published policy with a named security contact.",
        "Published policy, named contact, and active bug-bounty programme."
      ]
    },
    A23: {
      id: "A23", category: "C7", name: "Track record",
      academicName: "Reputation and Track Record",
      question: "Does the maker have a history of fixing security problems openly and quickly?",
      help: "Look up the brand. Have they had breaches? How did they handle them? Did they communicate clearly, or hide what happened?",
      evidence: "Search the brand name on Google with 'breach' or 'hack' — see what comes up and how they responded.",
      rubric: [
        "Repeatedly breached, never acknowledged.",
        "Past incidents poorly handled or denied.",
        "Past incidents handled acceptably.",
        "Past incidents handled openly and promptly.",
        "Strong track record and proactive about communicating about security."
      ]
    }
  },

  // Three reference device profiles -----------------------------------------
  archetypes: {
    premium: {
      id: "premium",
      name: "High-end smart camera",
      shortName: "High-end",
      device: "High-end Smart Camera (example)",
      summary: "Forces a strong password at setup, supports two-factor login, encrypts everything end-to-end, and the maker has a public bug-bounty programme.",
      friendlyDescription: "What a really well-made smart camera looks like.",
      scores: {
        A1: 4, A2: 4, A3: 4, A4: 3, A5: 4, A6: 4, A7: 4, A8: 4, A9: 3, A10: 4,
        A11: 4, A12: 4, A13: 4, A14: 3, A15: 4, A16: 3, A17: 4, A18: 3, A19: 4, A20: 4,
        A21: 4, A22: 4, A23: 4
      },
      tiers: {
        A1: 1, A2: 1, A3: 2, A4: 1, A5: 1, A6: 2, A7: 2, A8: 1, A9: 1, A10: 2,
        A11: 2, A12: 2, A13: 2, A14: 3, A15: 3, A16: 1, A17: 3, A18: 2, A19: 3, A20: 3,
        A21: 1, A22: 3, A23: 3
      }
    },
    midmarket: {
      id: "midmarket",
      name: "Mid-range smart camera",
      shortName: "Mid-range",
      device: "Mid-range Smart Camera (example)",
      summary: "Encrypts your data well but relies heavily on the maker's cloud, has weak password rules, and has had a few minor incidents that were okay-but-not-great about handling.",
      friendlyDescription: "What a typical mid-priced smart device looks like.",
      scores: {
        A1: 3, A2: 2, A3: 3, A4: 2, A5: 4, A6: 3, A7: 3, A8: 3, A9: 1, A10: 3,
        A11: 4, A12: 3, A13: 2, A14: 3, A15: 3, A16: 2, A17: 3, A18: 2, A19: 2, A20: 3,
        A21: 3, A22: 3, A23: 3
      },
      tiers: {
        A1: 1, A2: 1, A3: 2, A4: 1, A5: 1, A6: 2, A7: 2, A8: 1, A9: 1, A10: 3,
        A11: 2, A12: 2, A13: 3, A14: 3, A15: 3, A16: 2, A17: 3, A18: 2, A19: 3, A20: 3,
        A21: 1, A22: 3, A23: 3
      }
    },
    lowcost: {
      id: "lowcost",
      name: "Cheap unbranded smart camera",
      shortName: "Cheap/no-brand",
      device: "Cheap unbranded Smart Camera (example)",
      summary: "Comes with a default password printed on the box, no two-factor login at all, leaves Telnet open, makes no support promises, and ships with hidden debug ports active.",
      friendlyDescription: "What a cheap unbranded smart device often looks like — please be careful with these.",
      scores: {
        A1: 1, A2: 0, A3: 0, A4: 1, A5: 2, A6: 1, A7: 0, A8: 1, A9: 0, A10: 1,
        A11: 1, A12: 0, A13: 1, A14: 1, A15: 1, A16: 0, A17: 1, A18: 1, A19: 1, A20: 0,
        A21: 1, A22: 0, A23: 1
      },
      tiers: {
        A1: 1, A2: 1, A3: 1, A4: 1, A5: 1, A6: 3, A7: 3, A8: 1, A9: 1, A10: 3,
        A11: 2, A12: 3, A13: 3, A14: 3, A15: 3, A16: 1, A17: 3, A18: 1, A19: 3, A20: 3,
        A21: 1, A22: 3, A23: 3
      }
    }
  },

  // Action recommendations ----------------------------------------------------
  // After evaluation, surface concrete prioritised actions in plain English.
  actions: {
    A1: {
      title: "Change the default password right now",
      priority: 1,
      time: "3 minutes",
      what: "If your device came with a password on a sticker, anyone who finds your IP address online can try logging in with it. Changing it is the single most important thing you can do.",
      how: [
        "Open the device's app or web interface",
        "Find the account or security settings",
        "Choose 'Change password'",
        "Make a unique password — at least 12 characters, mix of letters, numbers and symbols",
        "Use a password manager (free options: Bitwarden, 1Password, Apple Keychain) so you don't have to remember it"
      ]
    },
    A2: {
      title: "Pick a strong password",
      priority: 2,
      time: "5 minutes",
      what: "If you used something like '12345' or your birthday, change it. Hackers run programs that try millions of common passwords per second.",
      how: [
        "Use 12+ characters",
        "Don't use your name, birthday, pet's name, or common words",
        "Better: use a random phrase like 'Purple-Cabbage-Fights-Tuesday-7'",
        "Best: let a password manager generate it for you"
      ]
    },
    A3: {
      title: "Turn on two-factor authentication (2FA)",
      priority: 1,
      time: "5 minutes",
      what: "2FA means even if someone steals your password, they still can't get in without a code from your phone. It's the single biggest improvement you can make.",
      how: [
        "Open the device's app",
        "Go to Account or Security settings",
        "Look for 'Two-factor authentication', '2FA' or '2-step verification'",
        "Choose the app option (Google Authenticator, Authy) over SMS — it's more secure",
        "Save the backup codes somewhere safe (not your phone)"
      ]
    },
    A4: {
      title: "Watch for repeated login attempts",
      priority: 3,
      time: "Ongoing",
      what: "If the device doesn't lock out after wrong passwords, you should keep an eye on your account. Most apps have a login history.",
      how: [
        "Check the app's login history regularly",
        "Enable login notifications if available",
        "If you see logins you don't recognise, change your password immediately"
      ]
    },
    A5: {
      title: "Use a VPN if your data isn't encrypted",
      priority: 2,
      time: "10 minutes",
      what: "If the device doesn't encrypt its data, anyone on your WiFi can read it. A VPN adds an encryption layer.",
      how: [
        "Set up a VPN on your home router (advanced)",
        "Or run a free VPN on individual devices (Cloudflare WARP, ProtonVPN free tier)",
        "Better: replace the device with one that encrypts properly"
      ]
    },
    A6: {
      title: "Don't store sensitive things on this device",
      priority: 2,
      time: "Ongoing",
      what: "If the device's storage isn't encrypted, anyone who steals it can read everything. Don't trust it with private things.",
      how: [
        "Avoid using its built-in storage for personal recordings",
        "If it's a camera, position it so it doesn't capture sensitive areas",
        "Use the maker's cloud storage if it's encrypted (check first)"
      ]
    },
    A7: {
      title: "Treat this device as low-trust",
      priority: 3,
      time: "Ongoing",
      what: "If encryption keys aren't managed properly, this device could be a stepping stone for an attacker into the rest of your network.",
      how: [
        "Don't share network passwords through it",
        "Keep it on a separate WiFi network (see action below)",
        "Limit what other devices it can talk to"
      ]
    },
    A8: {
      title: "Block unnecessary connections at your router",
      priority: 2,
      time: "20 minutes",
      what: "If the device has lots of open ports, you can close the ones it doesn't need at your home router.",
      how: [
        "Log into your router (usually 192.168.1.1 in your browser)",
        "Find 'Port forwarding' or 'Firewall' settings",
        "Block any port forwards you didn't explicitly set up",
        "If you don't know how, ask your ISP's support — they often help with this"
      ]
    },
    A9: {
      title: "Plan for the day this device stops working",
      priority: 3,
      time: "5 minutes to plan",
      what: "Cloud-only devices die when the maker shuts down their service. Treat this as a temporary device, not a permanent one.",
      how: [
        "Don't pay extra for cloud-dependent features",
        "Save important data (recordings, settings) somewhere outside the device",
        "Set a calendar reminder to check the maker's news every 6 months",
        "Consider replacing with a device that works locally"
      ]
    },
    A10: {
      title: "Put smart devices on a separate WiFi network",
      priority: 1,
      time: "30 minutes",
      what: "If a smart device gets hacked, the attacker can usually reach everything else on your WiFi — your laptop, your phone, your files. Putting smart devices on a separate network blocks that.",
      how: [
        "Most modern routers have a 'Guest network' option — turn it on",
        "Connect all your smart devices to the guest network only",
        "Keep your laptop, phone, and computer on the main network",
        "Better: ask your router maker if it supports 'IoT VLAN' for proper isolation"
      ]
    },
    A11: {
      title: "Check for and apply updates manually",
      priority: 2,
      time: "10 minutes",
      what: "If the device doesn't update itself automatically, you have to remember to do it. Out-of-date software is the #1 way devices get hacked.",
      how: [
        "Open the device's app monthly and check for updates",
        "Or check the maker's website for new firmware",
        "Set a calendar reminder if you're forgetful",
        "If the device hasn't had an update in over a year, that's a red flag"
      ]
    },
    A12: {
      title: "Watch out for end of support",
      priority: 3,
      time: "Ongoing",
      what: "If the maker is slow to fix bugs, your device is exposed for longer. Plan to replace it sooner than you might otherwise.",
      how: [
        "Check the maker's support history",
        "Subscribe to their security advisories if they have any",
        "Replace the device if it's been over a year without updates"
      ]
    },
    A13: {
      title: "Replace older smart devices proactively",
      priority: 3,
      time: "Ongoing",
      what: "Older smart devices accumulate security problems over time. Don't wait for something bad to happen — replace them on a schedule.",
      how: [
        "Replace smart devices every 4–5 years even if they still work",
        "Check the maker's announced support window before buying",
        "Avoid devices with no support window stated"
      ]
    },
    A14: {
      title: "Plan for end-of-life now",
      priority: 2,
      time: "5 minutes",
      what: "If the maker hasn't promised long-term support, this device will become unsafe at some point. Note when, and plan ahead.",
      how: [
        "Find the support end date (or note that there isn't one — that's worse)",
        "Set a calendar reminder 6 months before that date",
        "Replace before, not after, support ends"
      ]
    },
    A15: {
      title: "Read the privacy policy properly",
      priority: 3,
      time: "20 minutes",
      what: "If you can't tell what the device collects, you can't make an informed choice. Spend the time once.",
      how: [
        "Find the privacy policy on the maker's site or in the app",
        "Search it for 'collect', 'share', and 'third party'",
        "If it's vague or missing — don't trust the device with anything sensitive"
      ]
    },
    A16: {
      title: "Block advertiser tracking at your router",
      priority: 2,
      time: "30 minutes",
      what: "If the device is sending data to advertisers and analytics companies, you can block that traffic at your home network.",
      how: [
        "Set up Pi-hole on a Raspberry Pi (advanced) — blocks ads network-wide",
        "Or use NextDNS (easier — just change DNS in your router)",
        "Or use a privacy-focused router like one running OpenWRT"
      ]
    },
    A17: {
      title: "Request a copy of your data",
      priority: 3,
      time: "30 minutes",
      what: "Under GDPR (UK/EU) you have the right to see what's held about you. Use it.",
      how: [
        "Email the maker: 'I'd like to make a Subject Access Request under UK GDPR'",
        "They have 30 days to respond",
        "Look at what they have — if it surprises you, consider switching products"
      ]
    },
    A18: {
      title: "Disable optional data collection",
      priority: 2,
      time: "10 minutes",
      what: "Most apps default to collecting more than they need. Turn off the optional stuff.",
      how: [
        "Open the app's privacy settings",
        "Turn off 'analytics', 'marketing', 'usage data', 'personalisation' — anything not strictly required",
        "Turn off ad personalisation in your phone's OS settings as well"
      ]
    },
    A19: {
      title: "Put it somewhere physically secure",
      priority: 2,
      time: "5 minutes",
      what: "If someone could open the device with a screwdriver, they could bypass its security. Position matters.",
      how: [
        "Mount cameras and devices high up, out of easy reach",
        "Put indoor devices in rooms only you can access",
        "Don't leave them in public-accessible areas (entryways, gardens)"
      ]
    },
    A20: {
      title: "Don't deploy this device anywhere sensitive",
      priority: 3,
      time: "Ongoing",
      what: "Hidden debug ports mean anyone with physical access could break in. Treat the device as untrusted.",
      how: [
        "Don't put it in places where strangers could touch it",
        "Don't pair it with your most sensitive accounts",
        "If possible, choose a different brand"
      ]
    },
    A21: {
      title: "Set up devices on a private network",
      priority: 2,
      time: "10 minutes",
      what: "If the setup process isn't secure, someone nearby could intercept your WiFi password. Do the first-time setup somewhere safe.",
      how: [
        "Don't pair smart devices on public WiFi",
        "Don't pair them when neighbours might be on your network",
        "Pair them at home with the door closed"
      ]
    },
    A22: {
      title: "Subscribe to the maker's security feed",
      priority: 3,
      time: "5 minutes",
      what: "If the maker has a vulnerability disclosure policy, they probably also publish security advisories. Subscribe.",
      how: [
        "Look on the maker's site for a 'Security advisories' or RSS feed",
        "If they have one — subscribe so you hear about issues fast",
        "If they don't have one — this is a quality signal; consider it next time you buy"
      ]
    },
    A23: {
      title: "Reconsider for sensitive use",
      priority: 3,
      time: "Ongoing",
      what: "A maker with a poor track record will probably continue to have problems. Don't trust them with the most important things.",
      how: [
        "Don't put sensitive things on this device",
        "Plan to migrate away over time",
        "Next time you buy: check the maker's history first"
      ]
    }
  },

  // General security advice always shown -----------------------------------
  generalAdvice: [
    {
      icon: "🔑",
      title: "Use a password manager",
      what: "It generates strong unique passwords and remembers them for you. Free options work fine.",
      examples: ["Bitwarden (free)", "Apple Keychain (free, Apple devices)", "Google Password Manager (free)", "1Password (paid)"]
    },
    {
      icon: "⬆️",
      title: "Turn on automatic updates everywhere",
      what: "Your phone, computer, router, and every smart device. Updates fix security problems before attackers can use them.",
      examples: ["Phone: Settings → System Updates → Automatic", "Computer: Settings → Update", "Router: log in and check for an 'auto-update' option"]
    },
    {
      icon: "📡",
      title: "Use a guest WiFi network for smart devices",
      what: "If a smart device gets hacked, it can't reach your laptop or phone if they're on a different network.",
      examples: ["Most routers have a Guest WiFi option", "Connect smart devices there only", "Keep computers and phones on your main network"]
    },
    {
      icon: "📅",
      title: "Replace devices when they stop getting updates",
      what: "An unsupported device gets more dangerous over time as new flaws are found and never fixed.",
      examples: ["Check support windows before buying", "Replace devices that haven't been updated in 12+ months", "Don't buy from no-name brands without support commitments"]
    }
  ]
};

// =============================================================================
// Pure scoring functions - identical math to the academic version
// =============================================================================

function calculateCategoryScore(scores, categoryId) {
  const category = FRAMEWORK.categories.find(c => c.id === categoryId);
  if (!category) return null;
  const indicatorScores = category.indicators
    .map(id => scores[id])
    .filter(s => typeof s === "number");
  if (indicatorScores.length === 0) return null;
  const sum = indicatorScores.reduce((a, b) => a + b, 0);
  return sum / indicatorScores.length;
}

function calculateDRS(scores) {
  let drs = 0;
  let totalWeight = 0;
  for (const category of FRAMEWORK.categories) {
    const catScore = calculateCategoryScore(scores, category.id);
    if (catScore !== null) {
      drs += catScore * category.weight;
      totalWeight += category.weight;
    }
  }
  if (totalWeight === 0) return null;
  return drs / totalWeight;
}

function getBand(drs) {
  if (drs === null || drs === undefined) return null;
  return FRAMEWORK.bands.find(b => drs >= b.min && drs <= b.max) || null;
}

function getCompletionPercent(scores) {
  const totalIndicators = Object.keys(FRAMEWORK.indicators).length;
  const scored = Object.values(scores).filter(s => typeof s === "number").length;
  return Math.round((scored / totalIndicators) * 100);
}

function getTopRisks(scores, count = 3) {
  const indicatorEntries = Object.entries(scores)
    .filter(([, score]) => typeof score === "number")
    .map(([id, score]) => {
      const indicator = FRAMEWORK.indicators[id];
      const category = FRAMEWORK.categories.find(c => c.id === indicator.category);
      return { id, score, indicator, categoryWeight: category.weight };
    })
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return b.categoryWeight - a.categoryWeight;
    });
  return indicatorEntries.slice(0, count);
}

// Get prioritised action plan from low-scoring indicators
function getActionPlan(scores) {
  const low = Object.entries(scores)
    .filter(([id, score]) => typeof score === "number" && score <= 2)
    .map(([id, score]) => {
      const action = FRAMEWORK.actions[id];
      if (!action) return null;
      const indicator = FRAMEWORK.indicators[id];
      const category = FRAMEWORK.categories.find(c => c.id === indicator.category);
      return { id, score, action, indicator, categoryWeight: category.weight };
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a.action.priority !== b.action.priority) {
        return a.action.priority - b.action.priority;
      }
      if (a.score !== b.score) return a.score - b.score;
      return b.categoryWeight - a.categoryWeight;
    });
  return low;
}

if (typeof window !== "undefined") {
  window.FRAMEWORK = FRAMEWORK;
  window.calculateCategoryScore = calculateCategoryScore;
  window.calculateDRS = calculateDRS;
  window.getBand = getBand;
  window.getCompletionPercent = getCompletionPercent;
  window.getTopRisks = getTopRisks;
  window.getActionPlan = getActionPlan;
}
