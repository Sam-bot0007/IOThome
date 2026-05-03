// =============================================================================
// Home IoT Security - Application Logic
// State management, routing, rendering, persistence.
// =============================================================================

const STORAGE_KEY = "home-iot-security-v2";

let state = {
  view: "home",
  evaluation: null,
  activeCategory: "C1",
  compareSelection: ["midmarket"],
  modal: null
};

function newEvaluation() {
  return {
    id: "eval-" + Date.now(),
    deviceName: "My device",
    manufacturer: "",
    firmware: "",
    date: new Date().toISOString().split("T")[0],
    scores: {},
    tiers: {},
    notes: {}
  };
}

// ---------- PERSISTENCE ----------
function save() {
  if (state.evaluation) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.evaluation));
  }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.deviceName !== "string") return null;
    if (!parsed.scores || typeof parsed.scores !== "object") return null;
    if (!parsed.tiers || typeof parsed.tiers !== "object") parsed.tiers = {};
    if (!parsed.notes || typeof parsed.notes !== "object") parsed.notes = {};
    return parsed;
  } catch (err) {
    console.error("Failed to load saved evaluation", err);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
    return null;
  }
}

function clearSaved() { localStorage.removeItem(STORAGE_KEY); }

// ---------- ROUTER ----------
function setView(view, opts = {}) {
  state.view = view;
  if (opts.activeCategory) state.activeCategory = opts.activeCategory;
  render();
  window.scrollTo({ top: 0, behavior: "instant" });
}

// ---------- HELPERS ----------
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === "style") node.setAttribute("style", v);
    else node.setAttribute(k, v);
  }
  if (typeof children === "string") {
    node.textContent = children;
  } else if (Array.isArray(children)) {
    children.forEach(c => {
      if (c === null || c === undefined || c === false) return;
      if (typeof c === "string" || typeof c === "number") {
        node.appendChild(document.createTextNode(String(c)));
      } else {
        node.appendChild(c);
      }
    });
  } else if (children) {
    node.appendChild(children);
  }
  return node;
}

function bandColorStyle(band) {
  return `background: ${band.color}; color: white;`;
}

function scoreColorStyle(score) {
  const lvl = FRAMEWORK.scoreLevels.find(l => l.value === score);
  return lvl ? `background: ${lvl.color};` : "";
}

function scoreColor(score) {
  const lvl = FRAMEWORK.scoreLevels.find(l => l.value === score);
  return lvl ? lvl.color : "var(--text-3)";
}

// ---------- TOPBAR ----------
function renderTopbar() {
  const evalDevice = state.evaluation
    ? state.evaluation.deviceName
    : "Welcome";

  const navBtn = (id, label) => el("button", {
    class: state.view === id ? "active" : "",
    onclick: () => setView(id)
  }, label);

  return el("div", { class: "topbar" }, [
    el("div", { class: "topbar__brand" }, [
      el("div", { class: "topbar__logo-mark" }, "🛡"),
      el("div", { class: "topbar__logo-text" }, [
        el("span", { class: "topbar__logo-name" }, "Home IoT Security")
      ])
    ]),
    el("nav", { class: "topbar__nav" }, [
      navBtn("home", "Home"),
      navBtn("assess", "Check device"),
      navBtn("report", "Result"),
      navBtn("actionplan", "Fix it"),
      navBtn("compare", "Compare"),
      navBtn("library", "Learn")
    ]),
    el("div", { class: "topbar__meta" }, evalDevice)
  ]);
}

// ---------- VIEW: HOME ----------
function renderHome() {
  const root = el("div");

  const hero = el("div", { class: "hero" }, [
    el("div", { class: "hero__badge" }, [
      el("span", {}, "🛡️"),
      el("span", {}, "Free · Private · No tech knowledge needed")
    ]),
    el("h1", { class: "hero__title", html: "Is your smart device <em>actually safe?</em>" }),
    el("p", { class: "hero__lede" },
      "Smart cameras, speakers, plugs, lights — they all connect to the internet, and many are full of security holes. Answer 23 simple questions about your device and we'll tell you what's safe, what's risky, and exactly what to do about it."
    ),
    el("div", { class: "hero__cta" }, [
      el("button", {
        class: "btn btn--primary btn--lg",
        onclick: () => startNewEvaluation()
      }, [el("span", {}, "Check my device →")]),
      state.evaluation && Object.keys(state.evaluation.scores).length > 0
        ? el("button", { class: "btn btn--lg", onclick: () => setView("assess") }, "Continue check")
        : null,
      el("button", { class: "btn btn--ghost btn--lg", onclick: () => setView("library") }, "Learn first")
    ])
  ]);
  root.appendChild(hero);

  // Value propositions
  root.appendChild(el("div", { class: "value-props" }, [
    el("div", { class: "value-prop" }, [
      el("div", { class: "value-prop__icon" }, "✓"),
      el("div", { class: "value-prop__title" }, "Plain English"),
      el("div", { class: "value-prop__body" }, "No jargon, no acronyms. Every question is something you can actually answer.")
    ]),
    el("div", { class: "value-prop" }, [
      el("div", { class: "value-prop__icon" }, "🔒"),
      el("div", { class: "value-prop__title" }, "Stays on your device"),
      el("div", { class: "value-prop__body" }, "Your answers never leave your browser. We don't track or store anything.")
    ]),
    el("div", { class: "value-prop" }, [
      el("div", { class: "value-prop__icon" }, "📋"),
      el("div", { class: "value-prop__title" }, "Step-by-step fixes"),
      el("div", { class: "value-prop__body" }, "After the check, you get exact instructions for what to fix, in order of importance.")
    ])
  ]));

  // Reference archetypes
  root.appendChild(el("div", { class: "section-header" }, [
    el("div", { class: "section-header__eyebrow" }, "Examples"),
    el("h2", { class: "section-header__title" }, "What to expect"),
    el("p", { class: "section-header__subtitle" },
      "Click any example below to see what a full report looks like. These are based on real product types — the kind of devices you'd find in any high-street shop."
    )
  ]));

  const grid = el("div", { class: "archetypes-grid archetypes-section" });
  for (const key of ["premium", "midmarket", "lowcost"]) {
    const arch = FRAMEWORK.archetypes[key];
    const drs = calculateDRS(arch.scores);
    const band = getBand(drs);

    const card = el("button", {
      class: "archetype-card",
      onclick: () => viewArchetypeReport(key)
    }, [
      el("div", { class: "archetype-card__strip", style: `background: ${band.color};` }),
      el("div", { class: "archetype-card__body" }, [
        el("div", { class: "archetype-card__header" }, [
          el("div", { class: "archetype-card__name" }, arch.shortName),
          el("div", { class: "archetype-card__drs", style: `color: ${band.color}` }, drs.toFixed(1))
        ]),
        el("div", { class: "archetype-card__band", style: bandColorStyle(band) }, band.label),
        el("div", { class: "archetype-card__title" }, arch.device),
        el("div", { class: "archetype-card__desc" }, arch.friendlyDescription)
      ])
    ]);
    grid.appendChild(card);
  }
  root.appendChild(grid);

  return root;
}

function startNewEvaluation() {
  if (state.evaluation && Object.keys(state.evaluation.scores).length > 0) {
    state.modal = {
      title: "Start a new check?",
      body: "This will discard your current check. Make sure you've saved or printed the report if you want to keep it.",
      confirmText: "Start new",
      onConfirm: () => {
        state.evaluation = newEvaluation();
        clearSaved();
        save();
        state.modal = null;
        state.activeCategory = "C1";
        setView("assess");
      }
    };
    render();
    return;
  }
  state.evaluation = newEvaluation();
  save();
  state.activeCategory = "C1";
  setView("assess");
}

function viewArchetypeReport(key) {
  const arch = FRAMEWORK.archetypes[key];
  state.evaluation = {
    ...newEvaluation(),
    id: "archetype-" + key,
    deviceName: arch.device,
    manufacturer: "Example device",
    isArchetype: true,
    archetypeKey: key,
    scores: { ...arch.scores },
    tiers: { ...arch.tiers }
  };
  setView("report");
}

// ---------- VIEW: ASSESS ----------
function renderAssess() {
  if (!state.evaluation || state.evaluation.isArchetype) {
    return el("div", { class: "card" }, [
      el("h2", {}, "No active check"),
      el("p", { style: "margin: 12px 0 16px; color: var(--text-2);" }, "Start a new check from the home page to begin."),
      el("button", { class: "btn btn--primary", onclick: () => setView("home") }, "Go home")
    ]);
  }

  const root = el("div");
  root.appendChild(renderEvaluationHeader());

  const layout = el("div", { class: "assess" }, [
    renderAssessSidebar(),
    renderAssessContent()
  ]);
  root.appendChild(layout);
  return root;
}

function renderEvaluationHeader() {
  const eval_ = state.evaluation;
  const completion = getCompletionPercent(eval_.scores);
  const drs = calculateDRS(eval_.scores);
  const band = drs !== null ? getBand(drs) : null;

  let progressMsg = "Let's get started — answer the first question below.";
  if (completion > 0 && completion < 30) progressMsg = "Great start. Keep going.";
  else if (completion >= 30 && completion < 70) progressMsg = "Nice progress — you're well on your way.";
  else if (completion >= 70 && completion < 100) progressMsg = "Almost there. A few more to go.";
  else if (completion === 100) progressMsg = "All done. Click 'See result' for your report.";

  return el("div", { class: "section-header", style: "display: grid; grid-template-columns: 1fr auto; gap: 16px; align-items: center; margin-bottom: 24px;" }, [
    el("div", {}, [
      el("div", { class: "section-header__eyebrow" }, "Checking your device"),
      el("input", {
        type: "text",
        value: eval_.deviceName,
        placeholder: "What's this device?",
        style: "background: transparent; border: none; font-size: 32px; font-weight: 800; color: var(--text-1); width: 100%; padding: 0; outline: none;",
        oninput: (e) => { eval_.deviceName = e.target.value || "My device"; save(); updateTopbar(); }
      }),
      el("p", { class: "section-header__subtitle" }, [
        progressMsg,
        drs !== null ? ` Current score: ${drs.toFixed(2)} (${band.label}).` : null
      ])
    ]),
    el("div", { style: "display: flex; gap: 8px;" }, [
      completion >= 50
        ? el("button", { class: "btn btn--primary", onclick: () => setView("report") }, "See result →")
        : null,
      el("button", { class: "btn btn--ghost", onclick: () => promptReset() }, "Reset")
    ].filter(Boolean))
  ]);
}

function updateTopbar() {
  const meta = document.querySelector(".topbar__meta");
  if (meta && state.evaluation) meta.textContent = state.evaluation.deviceName;
}

function promptReset() {
  state.modal = {
    title: "Reset this check?",
    body: "All answers will be discarded. This cannot be undone.",
    confirmText: "Reset",
    onConfirm: () => {
      state.evaluation = newEvaluation();
      save();
      state.modal = null;
      state.activeCategory = "C1";
      render();
    }
  };
  render();
}

function renderAssessSidebar() {
  const eval_ = state.evaluation;
  const completion = getCompletionPercent(eval_.scores);

  const sidebar = el("aside", { class: "assess__sidebar" }, [
    el("div", { class: "assess__progress" }, [
      el("div", { class: "progress-bar" }, [
        el("div", { class: "progress-bar__fill", style: `width: ${completion}%` })
      ]),
      el("div", { class: "progress-text" }, [
        el("span", {}, `${completion}% done`),
        el("span", {}, `${Object.keys(eval_.scores).length} of 23`)
      ])
    ])
  ]);

  const catNav = el("nav", { class: "cat-nav" });
  for (const cat of FRAMEWORK.categories) {
    const scoredInCat = cat.indicators.filter(id => typeof eval_.scores[id] === "number").length;
    const isComplete = scoredInCat === cat.indicators.length;
    const isActive = state.activeCategory === cat.id;

    const item = el("button", {
      class: "cat-nav__item" + (isActive ? " active" : ""),
      onclick: () => {
        state.activeCategory = cat.id;
        render();
      }
    }, [
      el("span", { class: "cat-nav__icon" }, cat.icon),
      el("span", { class: "cat-nav__name" }, cat.name),
      isComplete
        ? el("span", { class: "cat-nav__check" }, "✓")
        : el("span", { class: "cat-nav__progress" }, `${scoredInCat}/${cat.indicators.length}`)
    ]);
    catNav.appendChild(item);
  }
  sidebar.appendChild(catNav);

  return sidebar;
}

function renderAssessContent() {
  const cat = FRAMEWORK.categories.find(c => c.id === state.activeCategory);
  if (!cat) return el("div", {}, "Category not found");

  const wrap = el("div", { class: "assess__content" });

  // Category intro
  wrap.appendChild(el("div", { class: "cat-intro" }, [
    el("div", { class: "cat-intro__icon" }, cat.icon),
    el("div", {}, [
      el("div", { class: "cat-intro__name" }, cat.name),
      el("div", { class: "cat-intro__summary" }, cat.summary)
    ])
  ]));

  // One question card per indicator
  cat.indicators.forEach((indId, idx) => {
    wrap.appendChild(renderQuestion(indId, idx + 1, cat.indicators.length));
  });

  // Inter-category nav
  const idx = FRAMEWORK.categories.findIndex(c => c.id === cat.id);
  const prev = FRAMEWORK.categories[idx - 1];
  const next = FRAMEWORK.categories[idx + 1];
  wrap.appendChild(el("div", { class: "question__nav" }, [
    prev
      ? el("button", { class: "btn", onclick: () => { state.activeCategory = prev.id; render(); window.scrollTo({top: 0}); } }, `← ${prev.name}`)
      : el("div"),
    next
      ? el("button", { class: "btn btn--primary", onclick: () => { state.activeCategory = next.id; render(); window.scrollTo({top: 0}); } }, `${next.name} →`)
      : el("button", { class: "btn btn--primary", onclick: () => setView("report") }, "See your result →")
  ]));

  return wrap;
}

function renderQuestion(indicatorId, qNum, totalInCat) {
  const ind = FRAMEWORK.indicators[indicatorId];
  const eval_ = state.evaluation;
  const currentScore = eval_.scores[indicatorId];
  const currentTier = eval_.tiers[indicatorId];

  const card = el("div", { class: "question", id: "q-" + indicatorId }, [
    el("div", { class: "question__header" }, [
      el("div", { class: "question__counter" }, `Question ${qNum} of ${totalInCat}`),
      el("div", { class: "question__name" }, ind.name)
    ]),
    el("p", { class: "question__text" }, ind.question)
  ]);

  // Help box
  if (ind.help) {
    card.appendChild(el("div", { class: "question__help" }, [
      el("div", { class: "question__help-icon" }, "💡"),
      el("div", { class: "question__help-text" }, ind.help)
    ]));
  }

  // Evidence hint
  card.appendChild(el("div", { class: "question__evidence-hint" }, [
    el("div", { class: "question__evidence-hint-label" }, "How to check:"),
    el("div", { class: "question__evidence-hint-text" }, ind.evidence)
  ]));

  // Rubric options
  const rubric = el("div", { class: "rubric" });
  ind.rubric.forEach((desc, score) => {
    const lvl = FRAMEWORK.scoreLevels[score];
    const isSelected = currentScore === score;

    const opt = el("button", {
      class: "rubric__option" + (isSelected ? " selected" : ""),
      onclick: () => {
        eval_.scores[indicatorId] = score;
        if (!eval_.tiers[indicatorId]) eval_.tiers[indicatorId] = 2;
        save();
        render();
      }
    }, [
      el("div", { class: "rubric__score", style: scoreColorStyle(score) }, String(score)),
      el("div", { class: "rubric__body" }, [
        el("div", { class: "rubric__label" }, lvl.label),
        el("div", { class: "rubric__desc" }, desc)
      ])
    ]);
    rubric.appendChild(opt);
  });

  // "I don't know" / skip option
  const skipSelected = currentScore === undefined && eval_.notes && eval_.notes[indicatorId] === "skipped";
  rubric.appendChild(el("button", {
    class: "rubric__skip" + (skipSelected ? " selected" : ""),
    onclick: () => {
      delete eval_.scores[indicatorId];
      delete eval_.tiers[indicatorId];
      eval_.notes = eval_.notes || {};
      eval_.notes[indicatorId] = "skipped";
      save();
      render();
    }
  }, "I'm not sure — skip this for now"));

  card.appendChild(rubric);

  // Tier selector
  if (typeof currentScore === "number") {
    const tierWrap = el("div", { class: "tier-selector" }, [
      el("div", { class: "tier-selector__label" }, "How confident are you about this?"),
      el("div", { class: "tier-selector__buttons" })
    ]);
    const tierBtns = tierWrap.querySelector(".tier-selector__buttons");
    FRAMEWORK.evidenceTiers.forEach(tier => {
      const btn = el("button", {
        class: "tier-btn" + (currentTier === tier.id ? " selected" : ""),
        title: tier.description,
        onclick: () => {
          eval_.tiers[indicatorId] = tier.id;
          save();
          render();
        }
      }, tier.label);
      tierBtns.appendChild(btn);
    });
    card.appendChild(tierWrap);
  }

  return card;
}

// ---------- VIEW: REPORT ----------
function renderReport() {
  const eval_ = state.evaluation;
  if (!eval_ || Object.keys(eval_.scores).length === 0) {
    return el("div", { class: "card" }, [
      el("h2", {}, "No data yet"),
      el("p", { style: "margin: 12px 0 16px; color: var(--text-2);" }, "Answer at least one question to see your result."),
      el("button", { class: "btn btn--primary", onclick: () => setView("assess") }, "Start checking")
    ]);
  }

  const drs = calculateDRS(eval_.scores);
  const band = getBand(drs);
  const completion = getCompletionPercent(eval_.scores);

  const root = el("div");

  // Hero
  root.appendChild(el("div", { class: "report-hero" }, [
    el("div", { class: "drs-display", style: `border-color: ${band.color}; color: ${band.color};` }, [
      el("div", { class: "drs-display__label" }, "Safety score"),
      el("div", { class: "drs-display__value" }, drs.toFixed(2)),
      el("div", { class: "drs-display__band", style: bandColorStyle(band) }, band.label),
      el("div", { class: "drs-display__sub" }, `${completion}% answered  ·  out of 4`)
    ]),
    el("div", { class: "report-summary" }, [
      el("div", { class: "report-summary__device" }, eval_.deviceName),
      el("div", { class: "report-summary__meta" },
        [eval_.manufacturer, eval_.firmware, eval_.date].filter(Boolean).join(" · ")
      ),
      el("p", { class: "report-summary__action" }, band.action),
      eval_.isArchetype
        ? el("p", { style: "font-size: 12px; color: var(--brand); margin-top: 8px; font-weight: 600;" }, "📋 Example device — this is what a report looks like, not a real check.")
        : null,
      el("div", { class: "report-actions" }, [
        el("button", { class: "btn btn--primary", onclick: () => setView("actionplan") }, "What should I do? →"),
        el("button", { class: "btn", onclick: () => window.print() }, "Save as PDF"),
        el("button", { class: "btn", onclick: () => downloadJSON() }, "Download data"),
        eval_.isArchetype
          ? null
          : el("button", { class: "btn btn--ghost", onclick: () => setView("assess") }, "Edit answers")
      ].filter(Boolean))
    ])
  ]));

  // Category breakdown
  root.appendChild(el("section", { class: "report-section" }, [
    el("div", { class: "report-section__header" }, [
      el("span", { class: "report-section__num" }, "Where it scored well, and where it didn't"),
      el("h3", { class: "report-section__title" }, "Breakdown by category")
    ]),
    renderCategoryBreakdown(eval_)
  ]));

  // Top risks
  const topRisks = getTopRisks(eval_.scores, 3).filter(r => r.score <= 2);
  if (topRisks.length > 0) {
    root.appendChild(el("section", { class: "report-section" }, [
      el("div", { class: "report-section__header" }, [
        el("span", { class: "report-section__num" }, "The biggest issues"),
        el("h3", { class: "report-section__title" }, "Top things to fix"),
        el("p", { class: "report-section__intro" }, "These are the lowest-scoring checks. The 'Fix it' page will tell you exactly what to do.")
      ]),
      renderRisks(topRisks)
    ]));
  }

  // Indicator detail table
  root.appendChild(el("section", { class: "report-section" }, [
    el("div", { class: "report-section__header" }, [
      el("span", { class: "report-section__num" }, "Full breakdown"),
      el("h3", { class: "report-section__title" }, "Every check, in detail")
    ]),
    renderIndicatorTable(eval_)
  ]));

  // CTA at the bottom
  if (!eval_.isArchetype) {
    root.appendChild(el("div", { class: "card", style: "margin-top: 32px; text-align: center; padding: 32px;" }, [
      el("h3", { style: "font-size: 22px; font-weight: 800; margin-bottom: 8px;" }, "Now — what to actually do"),
      el("p", { style: "font-size: 15px; color: var(--text-2); margin-bottom: 18px; max-width: 480px; margin-left: auto; margin-right: auto;" },
        "We've turned your low scores into a step-by-step action plan. Each one tells you what to do, why it matters, and how long it takes."
      ),
      el("button", { class: "btn btn--primary btn--lg", onclick: () => setView("actionplan") }, "See my action plan →")
    ]));
  }

  return root;
}

function renderCategoryBreakdown(eval_) {
  const wrap = el("div", { class: "cat-breakdown" });
  for (const cat of FRAMEWORK.categories) {
    const score = calculateCategoryScore(eval_.scores, cat.id);
    if (score === null) continue;

    const fillPct = (score / 4) * 100;
    const lvl = FRAMEWORK.scoreLevels[Math.round(score)];

    const row = el("div", { class: "cat-row" }, [
      el("div", { class: "cat-row__icon" }, cat.icon),
      el("div", { class: "cat-row__name" }, cat.name),
      el("div", { class: "cat-row__weight" }, (cat.weight * 100).toFixed(0) + "%"),
      el("div", { class: "cat-row__bar" }, [
        el("div", {
          class: "cat-row__bar-fill",
          style: `width: ${fillPct}%; background: ${lvl.color};`
        })
      ]),
      el("div", { class: "cat-row__score", style: `color: ${lvl.color};` }, score.toFixed(2))
    ]);
    wrap.appendChild(row);
  }
  return wrap;
}

function renderRisks(risks) {
  const wrap = el("div", { class: "risk-list" });
  risks.forEach((risk, idx) => {
    const ind = risk.indicator;
    const item = el("div", {
      class: "risk-item",
      style: `border-left-color: ${scoreColor(risk.score)};`
    }, [
      el("div", { class: "risk-item__head" }, [
        el("div", {
          class: "risk-item__num",
          style: `background: ${scoreColor(risk.score)};`
        }, String(idx + 1)),
        el("div", { class: "risk-item__main" }, [
          el("div", { class: "risk-item__title" }, ind.name),
          el("div", { class: "risk-item__question" }, ind.question)
        ])
      ])
    ]);
    wrap.appendChild(item);
  });
  return wrap;
}

function renderIndicatorTable(eval_) {
  const table = el("table", { class: "indicator-table" }, [
    el("thead", {}, [
      el("tr", {}, [
        el("th", {}, "Check"),
        el("th", {}, "Category"),
        el("th", { class: "center" }, "Score"),
        el("th", {}, "Confidence"),
        el("th", {}, "Why")
      ])
    ])
  ]);

  const tbody = el("tbody");
  for (const indId of Object.keys(FRAMEWORK.indicators)) {
    const ind = FRAMEWORK.indicators[indId];
    const score = eval_.scores[indId];
    const tier = eval_.tiers[indId];
    if (typeof score !== "number") continue;

    const lvl = FRAMEWORK.scoreLevels.find(l => l.value === score);
    const cat = FRAMEWORK.categories.find(c => c.id === ind.category);
    const tierLabel = tier ? FRAMEWORK.evidenceTiers.find(t => t.id === tier).label.split(" — ")[0] : "—";

    const row = el("tr", {}, [
      el("td", { style: "font-weight: 500;" }, ind.name),
      el("td", { class: "indicator-table__tier" }, cat.icon + " " + cat.name),
      el("td", { class: "center" }, [
        el("span", {
          class: "indicator-table__score-chip",
          style: `background: ${lvl.color};`
        }, String(score))
      ]),
      el("td", { class: "indicator-table__tier" }, tierLabel),
      el("td", { style: "color: var(--text-2); font-size: 12px;" }, ind.rubric[score])
    ]);
    tbody.appendChild(row);
  }
  table.appendChild(tbody);
  return table;
}

function downloadJSON() {
  const data = JSON.stringify(state.evaluation, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = el("a", { href: url, download: `${state.evaluation.deviceName.replace(/\s+/g, "_")}_check.json` });
  a.click();
  URL.revokeObjectURL(url);
}

// ---------- VIEW: ACTION PLAN (NEW) ----------
function renderActionPlan() {
  const eval_ = state.evaluation;
  if (!eval_ || Object.keys(eval_.scores).length === 0) {
    return el("div", { class: "card" }, [
      el("h2", {}, "No data yet"),
      el("p", { style: "margin: 12px 0 16px; color: var(--text-2);" }, "Check your device first to see your personalised action plan."),
      el("button", { class: "btn btn--primary", onclick: () => setView("assess") }, "Start checking")
    ]);
  }

  const root = el("div");
  const actionPlan = getActionPlan(eval_.scores);

  // Hero
  root.appendChild(el("div", { class: "actionplan-hero" }, [
    el("div", { class: "actionplan-hero__eyebrow" }, "What to actually do"),
    el("h1", { class: "actionplan-hero__title" },
      actionPlan.length === 0
        ? "Your device looks good!"
        : "Your personalised action plan"
    ),
    el("p", { class: "actionplan-hero__lede" },
      actionPlan.length === 0
        ? "There's nothing urgent to fix on your device. Have a look at the general advice below to keep things that way."
        : `We found ${actionPlan.length} thing${actionPlan.length === 1 ? "" : "s"} you should do based on your check. They're sorted by how important they are.`
    )
  ]));

  if (actionPlan.length === 0) {
    root.appendChild(el("div", { class: "actionplan-empty" }, [
      el("div", { class: "actionplan-empty__icon" }, "🎉"),
      el("h3", { class: "actionplan-empty__title" }, "Nothing urgent to fix"),
      el("p", { class: "actionplan-empty__body" }, "Your device scored well across the board. Keep an eye on updates and follow the general advice below to maintain this level of security.")
    ]));
  } else {
    // Group by priority
    const p1 = actionPlan.filter(a => a.action.priority === 1);
    const p2 = actionPlan.filter(a => a.action.priority === 2);
    const p3 = actionPlan.filter(a => a.action.priority === 3);

    if (p1.length > 0) root.appendChild(renderPrioritySection("p1", "Do these first", p1));
    if (p2.length > 0) root.appendChild(renderPrioritySection("p2", "Then these", p2));
    if (p3.length > 0) root.appendChild(renderPrioritySection("p3", "When you have time", p3));
  }

  // General advice always shown
  root.appendChild(renderGeneralAdvice());

  return root;
}

function renderPrioritySection(priorityId, title, actions) {
  const section = el("div", { class: "priority-band" });
  section.appendChild(el("div", { class: "priority-header" }, [
    el("div", { class: `priority-badge priority-badge--${priorityId}` },
      priorityId === "p1" ? "🔥 Urgent" :
      priorityId === "p2" ? "⚡ Important" : "📌 Worth doing"
    ),
    el("span", { class: "priority-header__count" }, `${actions.length} action${actions.length === 1 ? "" : "s"}`),
    el("span", { style: "flex: 1; font-weight: 700; font-size: 18px; color: var(--text-1); margin-left: 4px;" }, title)
  ]));

  actions.forEach(a => {
    const card = el("div", { class: "action-card" }, [
      el("div", { class: "action-card__head" }, [
        el("div", { class: "action-card__title-block" }, [
          el("div", { class: "action-card__title" }, a.action.title),
          el("div", { class: "action-card__why" },
            `Because: ${a.indicator.name} (you scored this ${a.score} out of 4)`
          )
        ]),
        el("div", { class: "action-card__time" }, "⏱ " + a.action.time)
      ]),
      el("div", { class: "action-card__body" }, [
        el("div", { class: "action-card__what" }, a.action.what),
        el("div", { class: "action-card__how" }, [
          el("div", { class: "action-card__how-label" }, "How to do it:"),
          el("ol", {},
            a.action.how.map(step => el("li", {}, step))
          )
        ])
      ])
    ]);
    section.appendChild(card);
  });

  return section;
}

function renderGeneralAdvice() {
  const wrap = el("div", { class: "general-advice" }, [
    el("h2", { class: "general-advice__title" }, "General security advice"),
    el("p", { class: "general-advice__intro" },
      "These tips apply to all your smart devices, not just this one. Doing these things makes your whole home more secure."
    )
  ]);

  const grid = el("div", { class: "advice-grid" });
  FRAMEWORK.generalAdvice.forEach(a => {
    const card = el("div", { class: "advice-card" }, [
      el("div", { class: "advice-card__icon" }, a.icon),
      el("div", { class: "advice-card__title" }, a.title),
      el("div", { class: "advice-card__what" }, a.what),
      el("div", { class: "advice-card__examples" }, [
        el("div", { class: "advice-card__examples-label" }, "Try:"),
        el("ul", {}, a.examples.map(ex => el("li", {}, ex)))
      ])
    ]);
    grid.appendChild(card);
  });
  wrap.appendChild(grid);
  return wrap;
}

// ---------- VIEW: COMPARE ----------
function renderCompare() {
  const root = el("div");

  root.appendChild(el("div", { class: "section-header" }, [
    el("div", { class: "section-header__eyebrow" }, "Compare"),
    el("h2", { class: "section-header__title" }, "Compare devices side by side"),
    el("p", { class: "section-header__subtitle" },
      "See how different smart devices stack up. Pick which ones to compare."
    )
  ]));

  const controls = el("div", { class: "compare-controls" });
  const options = [
    { id: "premium", label: "🟢 High-end" },
    { id: "midmarket", label: "🟡 Mid-range" },
    { id: "lowcost", label: "🔴 Cheap/no-brand" }
  ];
  if (state.evaluation && !state.evaluation.isArchetype && Object.keys(state.evaluation.scores).length > 0) {
    options.push({ id: "current", label: "👤 My device" });
  }
  for (const opt of options) {
    const checked = state.compareSelection.includes(opt.id);
    const pill = el("label", {
      class: "compare-pill" + (checked ? " checked" : ""),
      onclick: () => toggleCompareSelection(opt.id)
    }, [
      el("span", { class: "compare-pill__dot" }),
      el("span", {}, opt.label)
    ]);
    controls.appendChild(pill);
  }
  root.appendChild(controls);

  const profiles = state.compareSelection.map(id => {
    if (id === "current") return { id: "current", name: state.evaluation.deviceName, scores: state.evaluation.scores };
    const arch = FRAMEWORK.archetypes[id];
    return { id, name: arch.shortName, scores: arch.scores };
  });

  if (profiles.length === 0) {
    root.appendChild(el("div", { class: "card" }, "Pick at least one device to compare."));
    return root;
  }

  const table = el("table", { class: "compare-table" });
  const thead = el("thead");
  const headerRow = el("tr", {}, [el("th", {}, "Check")]);
  profiles.forEach(p => headerRow.appendChild(el("th", { class: "center" }, p.name)));
  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = el("tbody");

  for (const cat of FRAMEWORK.categories) {
    const catRow = el("tr", { class: "cat-header" }, [
      el("td", { colspan: profiles.length + 1 }, `${cat.icon} ${cat.name}`)
    ]);
    tbody.appendChild(catRow);

    for (const indId of cat.indicators) {
      const ind = FRAMEWORK.indicators[indId];
      const indRow = el("tr", {}, [
        el("td", {}, [
          el("div", { class: "compare-row__indicator" }, [
            el("span", { class: "compare-row__indicator-name" }, ind.name)
          ])
        ])
      ]);
      profiles.forEach(p => {
        const score = p.scores[indId];
        if (typeof score === "number") {
          indRow.appendChild(el("td", { class: "center" }, [
            el("span", {
              class: "indicator-table__score-chip",
              style: `background: ${scoreColor(score)};`
            }, String(score))
          ]));
        } else {
          indRow.appendChild(el("td", { class: "center", style: "color: var(--text-3);" }, "—"));
        }
      });
      tbody.appendChild(indRow);
    }

    const subtotalRow = el("tr", { class: "summary-row" }, [
      el("td", {}, "Category average")
    ]);
    profiles.forEach(p => {
      const cs = calculateCategoryScore(p.scores, cat.id);
      if (cs !== null) {
        subtotalRow.appendChild(el("td", { class: "center", style: `color: ${scoreColor(Math.round(cs))};` }, cs.toFixed(2)));
      } else {
        subtotalRow.appendChild(el("td", { class: "center" }, "—"));
      }
    });
    tbody.appendChild(subtotalRow);
  }

  // DRS row
  const drsRow = el("tr", { class: "drs-row" }, [el("td", {}, "Overall safety score")]);
  profiles.forEach(p => {
    const drs = calculateDRS(p.scores);
    const band = drs !== null ? getBand(drs) : null;
    if (drs !== null) {
      drsRow.appendChild(el("td", { class: "center", style: `color: ${band.color};` }, drs.toFixed(2)));
    } else {
      drsRow.appendChild(el("td", { class: "center" }, "—"));
    }
  });
  tbody.appendChild(drsRow);

  // Band row
  const bandRow = el("tr", { class: "summary-row" }, [el("td", {}, "Verdict")]);
  profiles.forEach(p => {
    const drs = calculateDRS(p.scores);
    const band = drs !== null ? getBand(drs) : null;
    if (band) {
      bandRow.appendChild(el("td", { class: "center" }, [
        el("span", { class: "archetype-card__band", style: bandColorStyle(band) }, band.label)
      ]));
    } else {
      bandRow.appendChild(el("td", { class: "center" }, "—"));
    }
  });
  tbody.appendChild(bandRow);

  table.appendChild(tbody);
  root.appendChild(table);

  return root;
}

function toggleCompareSelection(id) {
  if (state.compareSelection.includes(id)) {
    state.compareSelection = state.compareSelection.filter(x => x !== id);
  } else {
    state.compareSelection = [...state.compareSelection, id];
  }
  render();
}

// ---------- VIEW: LIBRARY ----------
function renderLibrary() {
  const root = el("div");

  root.appendChild(el("div", { class: "section-header" }, [
    el("div", { class: "section-header__eyebrow" }, "Learn"),
    el("h2", { class: "section-header__title" }, "Understanding the 23 checks"),
    el("p", { class: "section-header__subtitle" },
      "Read through what we check and why it matters. You don't need to memorise these — the check itself walks you through every one."
    )
  ]));

  for (const cat of FRAMEWORK.categories) {
    root.appendChild(el("div", { class: "library-cat-header" }, [
      el("div", { class: "library-cat-header__icon" }, cat.icon),
      el("h3", { class: "library-cat-header__title" }, cat.name),
      el("span", { class: "library-cat-header__weight" }, `${(cat.weight * 100).toFixed(0)}% of overall score`)
    ]));

    const grid = el("div", { class: "library-grid" });
    for (const indId of cat.indicators) {
      const ind = FRAMEWORK.indicators[indId];
      const card = el("div", { class: "library-card" }, [
        el("div", { class: "library-card__name" }, ind.name),
        el("div", { class: "library-card__cat" }, "Score 0–4"),
        el("div", { class: "library-card__question" }, ind.question),
        el("div", { class: "library-card__rubric-mini" })
      ]);
      const mini = card.querySelector(".library-card__rubric-mini");
      ind.rubric.forEach((desc, score) => {
        const cell = el("div", {
          class: "library-card__rubric-mini-cell",
          style: `background: ${FRAMEWORK.scoreLevels[score].color};`,
          title: `Score ${score}: ${desc}`
        });
        mini.appendChild(cell);
      });
      grid.appendChild(card);
    }
    root.appendChild(grid);
  }

  return root;
}

// ---------- MODAL ----------
function renderModal() {
  if (!state.modal) return null;
  const m = state.modal;

  return el("div", {
    class: "modal-backdrop",
    onclick: (e) => { if (e.target.classList.contains("modal-backdrop")) { state.modal = null; render(); } }
  }, [
    el("div", { class: "modal" }, [
      el("h3", { class: "modal__title" }, m.title),
      el("p", { class: "modal__body" }, m.body),
      el("div", { class: "modal__actions" }, [
        el("button", { class: "btn btn--ghost", onclick: () => { state.modal = null; render(); } }, "Cancel"),
        el("button", { class: "btn btn--primary", onclick: () => m.onConfirm() }, m.confirmText || "Confirm")
      ])
    ])
  ]);
}

// ---------- ROOT RENDER ----------
function render() {
  const root = document.getElementById("app");
  root.innerHTML = "";

  try {
    root.appendChild(renderTopbar());

    const main = el("main", { class: "main" });
    let view;
    switch (state.view) {
      case "home":       view = renderHome(); break;
      case "assess":     view = renderAssess(); break;
      case "report":     view = renderReport(); break;
      case "actionplan": view = renderActionPlan(); break;
      case "compare":    view = renderCompare(); break;
      case "library":    view = renderLibrary(); break;
      default:           view = el("div", {}, "Unknown view");
    }
    main.appendChild(view);
    root.appendChild(main);

    const modal = renderModal();
    if (modal) root.appendChild(modal);
  } catch (err) {
    console.error("Render failed:", err);
    root.innerHTML = `
      <div style="max-width: 600px; margin: 64px auto; padding: 32px; background: white; border: 1px solid #b91c1c; border-radius: 10px; color: #0f172a; font-family: system-ui, sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
        <h1 style="font-size: 22px; margin-bottom: 12px; color: #b91c1c;">Something went wrong</h1>
        <p style="color: #475569; margin-bottom: 16px;">This is usually because of saved data from an older version. Click below to clear it and start fresh.</p>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-size: 12px; color: #ea580c; overflow: auto; margin-bottom: 16px;">${(err && err.stack) || err}</pre>
        <button onclick="localStorage.clear(); location.reload();" style="padding: 12px 22px; background: #0d9488; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Clear data and reload</button>
      </div>
    `;
  }
}

function init() {
  const saved = loadSaved();
  if (saved) state.evaluation = saved;
  render();
}

document.addEventListener("DOMContentLoaded", init);
