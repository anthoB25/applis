"use strict";

/* ============================================================
   Carnet de Muscu — appli hors-ligne (PWA)
   Données stockées localement (localStorage) sur le téléphone.
   ============================================================ */

const STORE = {
  ex: "cm_exercises",
  sessions: "cm_sessions",
  draft: "cm_draft",
  settings: "cm_settings",
  programs: "cm_programs",
  measures: "cm_measures",
};

/* Mensurations suivies (ordre d'affichage) */
const METRICS = [
  { key: "poids", label: "Poids", unit: "kg" },
  { key: "masseGrasse", label: "Masse grasse", unit: "%" },
  { key: "epaule", label: "Épaules", unit: "cm" },
  { key: "pectoraux", label: "Pectoraux", unit: "cm" },
  { key: "bras", label: "Bras", unit: "cm" },
  { key: "taille", label: "Tour de taille", unit: "cm" },
  { key: "cuisse", label: "Tour de cuisse", unit: "cm" },
  { key: "mollet", label: "Mollet", unit: "cm" },
];

const DEFAULT_EXERCISES = [
  { name: "Développé couché", muscle: "Pectoraux" },
  { name: "Développé incliné haltères", muscle: "Pectoraux" },
  { name: "Écarté poulie", muscle: "Pectoraux" },
  { name: "Tractions", muscle: "Dos" },
  { name: "Rowing barre", muscle: "Dos" },
  { name: "Tirage vertical", muscle: "Dos" },
  { name: "Soulevé de terre", muscle: "Dos" },
  { name: "Développé militaire", muscle: "Épaules" },
  { name: "Élévations latérales", muscle: "Épaules" },
  { name: "Curl biceps barre", muscle: "Biceps" },
  { name: "Curl haltères", muscle: "Biceps" },
  { name: "Extension triceps poulie", muscle: "Triceps" },
  { name: "Dips", muscle: "Triceps" },
  { name: "Squat", muscle: "Jambes" },
  { name: "Presse à cuisses", muscle: "Jambes" },
  { name: "Fentes", muscle: "Jambes" },
  { name: "Leg curl", muscle: "Jambes" },
  { name: "Mollets debout", muscle: "Jambes" },
  { name: "Gainage", muscle: "Abdos" },
  { name: "Relevé de jambes", muscle: "Abdos" },
];

const MUSCLE_ORDER = ["Pectoraux", "Dos", "Épaules", "Biceps", "Triceps", "Jambes", "Abdos", "Autre"];

/* Modèles de séances muscu par défaut (issus du programme Upper/Lower) */
const DEFAULT_PROGRAMS = [
  {
    name: "Upper A", type: "muscu",
    exercises: [
      { name: "Développé incliné", muscle: "Pectoraux", sets: ["4-6", "6-8", "8-10"], rest: 150, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Tractions lestées", muscle: "Dos", sets: ["4-6", "6-8", "8-10"], rest: 120, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Élévations frontales", muscle: "Épaules", sets: ["10-15", "10-15", "10-15"], rest: 90, comment: "Pic de contraction 2 s en haut" },
      { name: "Curl incliné haltères", muscle: "Biceps", sets: ["8-12", "8-12", "8-12"], rest: 90, comment: "" },
      { name: "Élévations latérales", muscle: "Épaules", sets: ["15-20", "10-15", "8-10 + upright row"], rest: 60, comment: "Raptor set : dernière série en dégressive mécanique" },
    ],
  },
  {
    name: "Lower", type: "muscu",
    exercises: [
      { name: "Squat", muscle: "Jambes", sets: ["6-10", "6-10", "6-10"], rest: 120, comment: "" },
      { name: "Deadlift jambes tendues", muscle: "Jambes", sets: ["10-15", "10-15", "10-15"], rest: 90, comment: "" },
      { name: "Leg curl + leg extension", muscle: "Jambes", sets: ["8-12", "8-12", "8-12"], rest: 30, comment: "Superset : se reposer 30 s entre chaque exercice" },
      { name: "Extensions mollets", muscle: "Jambes", sets: ["12-15", "8-12", "6-10 + AMRAP dégressive"], rest: 60, comment: "Tempo 1-2-2-1" },
      { name: "Upright row penché", muscle: "Épaules", sets: ["15-20", "10-15", "6-10 + AMRAP dégressive"], rest: 60, comment: "Augmenter le poids à chaque série" },
    ],
  },
  {
    name: "Upper B", type: "muscu",
    exercises: [
      { name: "Overhead press", muscle: "Épaules", sets: ["4-6", "6-8", "8-10"], rest: 150, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Développé couché", muscle: "Pectoraux", sets: ["4-6", "6-8", "8-10"], rest: 120, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Tractions neutres focus bras", muscle: "Dos", sets: ["8-12", "8-12", "8-12"], rest: 90, comment: "Tirer avec les bras, pas avec le dos" },
      { name: "Oiseau assis prise neutre", muscle: "Épaules", sets: ["10-15", "10-15", "10-15"], rest: 60, comment: "Coudes perpendiculaires au corps" },
      { name: "Upright row", muscle: "Épaules", sets: ["12-15", "8-12", "6-10 + AMRAP dégressive"], rest: 60, comment: "Augmenter le poids à chaque série" },
    ],
  },
  {
    name: "Séance A", type: "muscu",
    exercises: [
      { name: "Développé incliné", muscle: "Pectoraux", sets: ["4-6", "6-8", "8-10"], rest: 150, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Tractions lestées prise neutre", muscle: "Dos", sets: ["4-6", "6-8", "8-10"], rest: 120, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "ATG split squat", muscle: "Jambes", sets: ["10-15", "10-15", "10-15"], rest: 45, comment: "45 s de repos par côté" },
      { name: "Upright row", muscle: "Épaules", sets: ["10-15", "10-15", "10-15"], rest: 60, comment: "" },
      { name: "Curl incliné", muscle: "Biceps", sets: ["10-15", "4-6", "4-6", "4-6"], rest: 10, comment: "Méga série : 10-15 puis +4-6, +4-6, +4-6 (10 s entre chaque)" },
    ],
  },
  {
    name: "Séance B", type: "muscu",
    exercises: [
      { name: "Dips lestés", muscle: "Triceps", sets: ["4-6", "6-8", "8-10"], rest: 150, comment: "Top set puis -10 % du poids à chaque série" },
      { name: "Rowing bucheron", muscle: "Dos", sets: ["4-6", "6-8", "8-10"], rest: 60, comment: "Top set puis -10 % du poids à chaque série · 1 min par côté" },
      { name: "Romanian deadlift", muscle: "Jambes", sets: ["10-15", "10-15", "10-15"], rest: 90, comment: "" },
      { name: "Upright row", muscle: "Épaules", sets: ["10-15", "10-15", "10-15"], rest: 60, comment: "" },
      { name: "Extension triceps nuque", muscle: "Triceps", sets: ["10-15", "4-6", "4-6", "4-6"], rest: 10, comment: "Méga série : 10-15 puis +4-6, +4-6, +4-6 (10 s entre chaque)" },
    ],
  },
];

/* Minuteurs par défaut (exemples) */
const DEFAULT_TIMERS = [
  { name: "EMOM 10 min", type: "timer", mode: "emom", cfg: { interval: 60, rounds: 10 } },
  { name: "Tabata abdos", type: "timer", mode: "tabata", cfg: { work: 20, rest: 10, rounds: 8 } },
];

/* Paliers de force (niveau par exercice) */
const TIER_NAMES = ["Silver", "Gold", "Platine", "Diamant", "Master", "Grand Master", "Challenger"];
const STRENGTH_STANDARDS = [
  { label: "Développé couché", reps: 5, match: ["developpe couche"], tiers: [60, 80, 100, 120, 140, 160, 180] },
  { label: "Développé incliné", reps: 5, match: ["developpe incline"], tiers: [60, 75, 90, 105, 120, 135, 150] },
  { label: "Développé militaire", reps: 10, match: ["militaire", "overhead", "ohp"], tiers: [50, 60, 70, 80, 90, 95, 100] },
  { label: "Tractions lestées", reps: 5, match: ["lest"], tiers: [0, 10, 20, 30, 40, 50, 60] },
  { label: "Squat", reps: 8, match: ["squat"], tiers: [60, 80, 100, 120, 140, 160, 180] },
  { label: "Deadlift jambes tendues", reps: 5, match: ["jambes tendues", "romanian", "stiff"], tiers: [100, 120, 140, 160, 180, 200, 220] },
];
function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, ""); }
function standardFor(name) { const n = norm(name); return STRENGTH_STANDARDS.find((st) => st.match.some((m) => n.includes(norm(m)))); }
/* Niveau à partir du poids + reps de la 1re série (normalisé sur reps de référence, Epley) */
function computeLevel(st, wStr, rStr) {
  if (wStr === "" || wStr == null || rStr === "" || rStr == null) return null;
  const w = Number(wStr), r = Number(rStr);
  if (isNaN(w) || isNaN(r) || r <= 0 || w < 0) return null;
  const est1rm = w * (1 + r / 30);
  const equiv = est1rm / (1 + st.reps / 30); // poids équivalent au nb de reps de référence
  let idx = -1;
  for (let i = 0; i < st.tiers.length; i++) if (equiv + 0.001 >= st.tiers[i]) idx = i;
  return { idx, equiv, name: idx >= 0 ? TIER_NAMES[idx] : null, next: idx < st.tiers.length - 1 ? st.tiers[idx + 1] : null };
}
function rankBadgeHtml(st, lvl) {
  if (!lvl) return `<span class="rank none">🏅 Niveau : —</span>`;
  if (lvl.idx < 0) return `<span class="rank bronze">🥉 Bronze</span><span class="rank-next"> · Silver à ${st.tiers[0]}kg × ${st.reps}</span>`;
  const nextTxt = lvl.next != null ? ` · ${TIER_NAMES[lvl.idx + 1]} à ${lvl.next}kg` : " · palier max 🔥";
  return `<span class="rank tier-${lvl.idx}">🏅 ${lvl.name}</span><span class="rank-next">${nextTxt}</span>`;
}
/* Petit badge de niveau (nom seul) pour les listes/journal */
function rankChip(lvl) {
  if (!lvl) return `<span class="rank none">—</span>`;
  if (lvl.idx < 0) return `<span class="rank bronze">🥉 Bronze</span>`;
  return `<span class="rank tier-${lvl.idx}">🏅 ${lvl.name}</span>`;
}
/* Niveau actuel d'un exercice, calculé sur la 1re série de sa dernière séance */
function currentLevel(exId) {
  const ex = exById(exId);
  const st = ex && standardFor(ex.name);
  if (!st) return null;
  const en = lastEntry(exId);
  if (!en || !en.sets.length) return { st, lvl: null };
  return { st, lvl: computeLevel(st, en.sets[0].weight, en.sets[0].reps) };
}

/* ---------- Stockage ---------- */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}
function save(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); }
  catch (e) { toast("Erreur de sauvegarde (mémoire pleine ?)"); }
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

/* ---------- État ---------- */
let state = {
  exercises: load(STORE.ex, null),
  sessions: load(STORE.sessions, []),
  draft: load(STORE.draft, null),
  settings: load(STORE.settings, { rest: 90, unit: "kg" }),
  programs: load(STORE.programs, null),
  measures: load(STORE.measures, []),
  view: "seance",
  progExercise: null,
  progMode: "perf",     // "perf" | "mensu"
  measureMetric: "poids",
};

// Amorçage des exercices par défaut la première fois
if (!state.exercises) {
  state.exercises = DEFAULT_EXERCISES.map((e) => ({ id: uid(), ...e }));
  save(STORE.ex, state.exercises);
}

// Amorçage des modèles + minuteurs par défaut la première fois
if (!state.programs) {
  DEFAULT_PROGRAMS.forEach((p) => p.exercises.forEach((pe) => findOrCreateExercise(pe.name, pe.muscle)));
  state.programs = [...DEFAULT_PROGRAMS, ...DEFAULT_TIMERS].map((p) => ({ id: uid(), ...deepCopy(p) }));
  save(STORE.programs, state.programs);
}

// Migration : retirer les jours en préfixe des titres de séances ("Lundi — Upper A" -> "Upper A")
if (!state.settings.migDayNames) {
  const dayRe = /^(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)\s*[—–-]\s*/i;
  state.programs.forEach((p) => { if (p.name) p.name = p.name.replace(dayRe, "").trim(); });
  state.settings.migDayNames = true;
  save(STORE.programs, state.programs);
  save(STORE.settings, state.settings);
}

// Migration : renommer les exos de la séance Lower (Squat / Deadlift jambes tendues)
if (!state.settings.migLowerExos) {
  const rn = { "high bar squat ou deadlift": "Squat", "romanian deadlift ou fentes": "Deadlift jambes tendues" };
  const relabel = (name) => rn[String(name).toLowerCase()] || name;
  state.programs.forEach((p) => (p.exercises || []).forEach((ex) => { ex.name = relabel(ex.name); }));
  state.exercises.forEach((e) => { e.name = relabel(e.name); });

  // Dédupliquer la bibliothèque par nom (repointer séances/brouillon vers l'exemplaire conservé)
  const byName = {}, remap = {};
  state.exercises.forEach((e) => {
    const k = e.name.toLowerCase();
    if (byName[k]) remap[e.id] = byName[k]; else byName[k] = e.id;
  });
  state.exercises = state.exercises.filter((e) => !remap[e.id]);
  const fix = (entries) => (entries || []).forEach((en) => { if (remap[en.exerciseId]) en.exerciseId = remap[en.exerciseId]; });
  state.sessions.forEach((s) => fix(s.entries));
  if (state.draft) fix(state.draft.entries);

  state.settings.migLowerExos = true;
  save(STORE.programs, state.programs);
  save(STORE.ex, state.exercises);
  save(STORE.sessions, state.sessions);
  save(STORE.settings, state.settings);
}

// Migration : ajouter les modèles "Séance A" et "Séance B"
if (!state.settings.migSeanceAB) {
  ["Séance A", "Séance B"].forEach((name) => {
    if (state.programs.some((p) => p.name === name)) return;
    const def = DEFAULT_PROGRAMS.find((p) => p.name === name);
    if (!def) return;
    def.exercises.forEach((pe) => findOrCreateExercise(pe.name, pe.muscle));
    state.programs.push({ id: uid(), ...deepCopy(def) });
  });
  state.settings.migSeanceAB = true;
  save(STORE.programs, state.programs);
  save(STORE.ex, state.exercises);
  save(STORE.settings, state.settings);
}

/* ---------- Utilitaires ---------- */
function deepCopy(o) { return JSON.parse(JSON.stringify(o)); }
function exById(id) { return state.exercises.find((e) => e.id === id); }
function findOrCreateExercise(name, muscle) {
  let ex = state.exercises.find((e) => e.name.toLowerCase() === String(name).toLowerCase());
  if (!ex) {
    ex = { id: uid(), name: name, muscle: muscle || "Autre" };
    state.exercises.push(ex);
    save(STORE.ex, state.exercises);
  }
  return ex;
}
function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function fmtDateShort(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
function sessionVolume(sess) {
  let vol = 0, sets = 0;
  sess.entries.forEach((en) => en.sets.forEach((s) => {
    if (s.done) { vol += (Number(s.weight) || 0) * (Number(s.reps) || 0); sets++; }
  }));
  return { vol: Math.round(vol), sets };
}
function esc(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function mmss(sec) {
  sec = Math.max(0, Math.round(sec));
  const m = String(Math.floor(sec / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return `${m}:${s}`;
}

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2200);
}

/* ---------- Modal ---------- */
function openModal(html) {
  document.getElementById("modalBox").innerHTML = html;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
  document.getElementById("modalBox").innerHTML = "";
}
document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target.id === "modal") closeModal();
});

/* ============================================================
   Navigation
   ============================================================ */
const VIEW_TITLES = {
  seance: "Séance", modeles: "Modèles", historique: "Journal",
  progression: "Progression", exercices: "Exercices", reglages: "Réglages",
};
function switchView(view) {
  state.view = view;
  document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
  document.getElementById("view-" + view).classList.remove("hidden");
  // Modèles et Exercices n'ont plus d'onglet : on surligne Réglages (leur "parent")
  const activeTab = (view === "modeles" || view === "exercices") ? "reglages" : view;
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === activeTab));
  document.getElementById("viewTitle").textContent = VIEW_TITLES[view];
  document.getElementById("main").scrollTop = 0;
  window.scrollTo(0, 0);
  render();
}
document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => switchView(t.dataset.view));
});

function render() {
  if (state.view === "seance") renderSeance();
  else if (state.view === "modeles") renderModeles();
  else if (state.view === "historique") renderHistorique();
  else if (state.view === "progression") renderProgression();
  else if (state.view === "exercices") renderExercices();
  else if (state.view === "reglages") renderReglages();
}

/* ============================================================
   VUE : Séance en cours
   ============================================================ */
function renderSeance() {
  const el = document.getElementById("view-seance");
  const d = state.draft;

  if (!d) {
    el.innerHTML = `
      <div class="empty">
        <div class="big">🏋️</div>
        <p>Aucune séance en cours.</p>
      </div>
      <button class="btn btn-primary btn-block" id="chooseModel">🗂️ Choisir un modèle</button>
      <div class="spacer"></div>
      <button class="btn btn-block" id="startBtn">＋ Séance vide</button>
      ${lastSessionHint()}
    `;
    document.getElementById("chooseModel").onclick = () => switchView("modeles");
    document.getElementById("startBtn").onclick = () => startSession();
    return;
  }

  const totals = sessionVolume(d);
  let html = `
    <div class="card">
      <div class="card-h">
        <div>
          <div style="font-weight:800;font-size:17px">${esc(d.name || "Séance du jour")}</div>
          <div class="small muted">${fmtDate(d.date)}</div>
        </div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm" id="timerBtn">⏱ Minuteur</button>
          <button class="btn btn-sm btn-ghost" id="renameBtn">✎</button>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="v">${totals.sets}</div><div class="l">séries faites</div></div>
        <div class="stat"><div class="v">${totals.vol}</div><div class="l">volume (kg)</div></div>
        <div class="stat"><div class="v">${d.entries.length}</div><div class="l">exercices</div></div>
      </div>
    </div>
  `;

  d.entries.forEach((en, ei) => {
    const ex = exById(en.exerciseId);
    const prev = lastPerf(en.exerciseId, d.id);
    const meta = [ex ? esc(ex.muscle) : "", en.rest ? "repos " + mmss(en.rest) : "", prev ? "dernier : " + prev : ""].filter(Boolean).join(" · ");
    const st = ex ? standardFor(ex.name) : null;
    const badge = st ? `<div class="rank-badge" id="rank-${ei}">${rankBadgeHtml(st, computeLevel(st, en.sets[0] ? en.sets[0].weight : "", en.sets[0] ? en.sets[0].reps : ""))}</div>` : "";
    html += `
      <div class="ex-block" data-ei="${ei}">
        <div class="ex-head">
          <div>
            <div class="name">${esc(ex ? ex.name : "Exercice supprimé")}</div>
            <div class="muscle">${meta}</div>
            ${badge}
          </div>
          <button class="btn btn-sm btn-ghost del-ex" data-ei="${ei}">🗑</button>
        </div>
        <div class="ex-body">
          ${en.comment ? `<div class="ex-comment">💬 ${esc(en.comment)}</div>` : ""}
          <div class="set-row head"><span>#</span><span>Poids (${state.settings.unit})</span><span>Reps</span><span>✓</span></div>
          ${en.sets.map((s, si) => setRowHtml(ei, si, s)).join("")}
          <div class="ex-actions">
            <button class="btn btn-sm add-set" data-ei="${ei}">＋ Série</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `
    <button class="btn btn-block" id="addExBtn">＋ Ajouter un exercice</button>
    <div class="spacer"></div>
    <div class="row">
      <button class="btn btn-danger" id="cancelBtn">Annuler</button>
      <button class="btn btn-green" id="finishBtn">✓ Terminer</button>
    </div>
    <div class="spacer"></div>
  `;
  el.innerHTML = html;
  bindSeance();
}

function setRowHtml(ei, si, s) {
  const ph = s.target ? esc(s.target) : "reps";
  const g = s.ghost ? " ghost" : "";
  return `
    <div class="set-row set-done ${s.done ? "done" : ""}" data-ei="${ei}" data-si="${si}">
      <span class="idx">${si + 1}</span>
      <div class="in-cell">
        <input type="number" inputmode="decimal" class="in-weight${g}" value="${s.weight ?? ""}" placeholder="${state.settings.unit}" />
        <span class="hint">&nbsp;</span>
      </div>
      <div class="in-cell">
        <input type="number" inputmode="numeric" class="in-reps${g}" value="${s.reps ?? ""}" placeholder="${ph}" title="${ph}" />
        <span class="hint">${s.target ? "🎯 " + esc(s.target) : "&nbsp;"}</span>
      </div>
      <button class="check ${s.done ? "on" : ""}">✓</button>
    </div>
  `;
}

function bindSeance() {
  const d = state.draft;
  const q = (sel, all) => all ? document.querySelectorAll(sel) : document.querySelector(sel);

  const renameBtn = q("#renameBtn");
  if (renameBtn) renameBtn.onclick = () => {
    const name = prompt("Nom de la séance :", d.name || "Séance du jour");
    if (name !== null) { d.name = name.trim() || "Séance du jour"; save(STORE.draft, d); render(); }
  };
  const timerBtn = q("#timerBtn");
  if (timerBtn) timerBtn.onclick = openTimerPicker;

  q("#addExBtn").onclick = () => openExercisePicker((exId) => {
    d.entries.push({ exerciseId: exId, comment: "", rest: state.settings.rest, sets: [suggestedSet(exId, 0, null)] });
    save(STORE.draft, d); render();
  });

  q("#cancelBtn").onclick = () => {
    if (confirm("Annuler cette séance ? Les données non enregistrées seront perdues.")) {
      state.draft = null; localStorage.removeItem(STORE.draft); render();
    }
  };

  q("#finishBtn").onclick = finishSession;

  q(".del-ex", true).forEach((b) => b.onclick = () => {
    d.entries.splice(Number(b.dataset.ei), 1); save(STORE.draft, d); render();
  });

  q(".add-set", true).forEach((b) => b.onclick = () => {
    const ei = Number(b.dataset.ei);
    const en = d.entries[ei];
    en.sets.push(copySet(en.sets[en.sets.length - 1]));
    save(STORE.draft, d); render();
  });

  const unghost = (r) => {
    const set = d.entries[+r.dataset.ei].sets[+r.dataset.si];
    if (set.ghost) { set.ghost = false; r.querySelectorAll("input").forEach((x) => x.classList.remove("ghost")); }
  };
  q(".in-weight", true).forEach((inp) => inp.oninput = () => {
    const r = inp.closest(".set-row");
    unghost(r);
    d.entries[+r.dataset.ei].sets[+r.dataset.si].weight = inp.value;
    save(STORE.draft, d);
    if (+r.dataset.si === 0) updateRank(+r.dataset.ei);
  });
  q(".in-reps", true).forEach((inp) => inp.oninput = () => {
    const r = inp.closest(".set-row");
    unghost(r);
    d.entries[+r.dataset.ei].sets[+r.dataset.si].reps = inp.value;
    save(STORE.draft, d);
    if (+r.dataset.si === 0) updateRank(+r.dataset.ei);
  });

  q(".set-done .check", true).forEach((btn) => btn.onclick = () => {
    const r = btn.closest(".set-row");
    const ei = +r.dataset.ei;
    const si = +r.dataset.si;
    const set = d.entries[ei].sets[si];
    set.done = !set.done;
    if (set.done) set.ghost = false; // cocher valide la suggestion
    save(STORE.draft, d);
    const rest = (d.entries[ei].rest != null ? d.entries[ei].rest : state.settings.rest);
    if (set.done) { evaluatePerf(ei, si); if (rest > 0) startRest(rest); }
    render();
  });
}

/* Objectif de reps : plus grand nombre trouvé dans la cible ("6-8" -> 8) */
function parseTopReps(target) {
  const nums = String(target || "").match(/\d+/g);
  return nums ? Math.max(...nums.map(Number)) : "";
}
/* Dernière fois que cet exercice a été fait (entrée complète) */
function lastEntry(exId) {
  for (const sess of state.sessions) {
    const en = sess.entries.find((e) => e.exerciseId === exId);
    if (en && en.sets.length) return en;
  }
  return null;
}
/* Série pré-remplie en gris (poids de la dernière fois + objectif de reps) */
function suggestedSet(exId, index, target) {
  const en = lastEntry(exId);
  let w = "", r = "";
  if (en) {
    const s = en.sets[index] || en.sets[en.sets.length - 1];
    if (s) { w = s.weight != null ? s.weight : ""; r = s.reps != null ? s.reps : ""; }
  }
  if (r === "") r = parseTopReps(target);
  const ghost = w !== "" || r !== "";
  return { weight: w, reps: r, done: false, target: target || null, ghost };
}
/* Copie de la série précédente en gris (pour le bouton "+ Série") */
function copySet(prev) {
  if (!prev) return { weight: "", reps: "", done: false, target: null, ghost: false };
  return { weight: prev.weight ?? "", reps: prev.reps ?? "", done: false, target: prev.target || null, ghost: true };
}
/* Sons de performance à la validation d'une série (record / moins bien) */
function evaluatePerf(ei, si) {
  if (state.settings.sounds === false) return;
  const en = state.draft && state.draft.entries[ei];
  if (!en) return;
  const set = en.sets[si];
  if (set.weight === "" || set.weight == null || set.reps === "" || set.reps == null) return;
  const w = Number(set.weight), r = Number(set.reps);
  if (isNaN(w) || isNaN(r) || r <= 0 || w < 0) return;
  const e1 = w * (1 + r / 30);

  // Record de tous les temps (séances passées uniquement)
  let allBest = 0, hasHist = false;
  state.sessions.forEach((s) => s.entries.forEach((entry) => {
    if (entry.exerciseId === en.exerciseId) entry.sets.forEach((x) => {
      const xr = Number(x.reps) || 0;
      if (xr > 0) { hasHist = true; const xe = (Number(x.weight) || 0) * (1 + xr / 30); if (xe > allBest) allBest = xe; }
    });
  }));
  if (hasHist && e1 > allBest + 0.01) {
    if (!state._prPlayed) state._prPlayed = {};
    if (!state._prPlayed[en.exerciseId]) {
      state._prPlayed[en.exerciseId] = true;
      playPR(); toast("🏆 Nouveau record !");
      return;
    }
  }

  // Comparaison à la même série de la dernière séance
  const last = lastEntry(en.exerciseId);
  const ls = last && last.sets[si];
  if (ls) {
    const lw = Number(ls.weight), lr = Number(ls.reps);
    if (!isNaN(lw) && !isNaN(lr) && lr > 0) {
      // "moins bien" : charge PAS augmentée ET reps inférieures
      if (w <= lw && r < lr) { playWorse(); return; }
      // amélioration : plus de charge, ou même charge avec plus de reps
      if (w > lw || (w === lw && r > lr)) { playBetter(); return; }
    }
  }
}

/* Recalcule le badge de niveau d'un exercice (1re série) sans tout redessiner */
function updateRank(ei) {
  const el = document.getElementById("rank-" + ei);
  if (!el || !state.draft) return;
  const en = state.draft.entries[ei];
  const ex = en && exById(en.exerciseId);
  const st = ex && standardFor(ex.name);
  if (!st) return;
  el.innerHTML = rankBadgeHtml(st, computeLevel(st, en.sets[0] ? en.sets[0].weight : "", en.sets[0] ? en.sets[0].reps : ""));
}

function startSession() {
  state.draft = { id: uid(), date: new Date().toISOString(), name: "Séance du jour", entries: [] };
  state._prPlayed = {};
  save(STORE.draft, state.draft);
  switchView("seance");
}

/* Démarrer depuis un modèle */
function startFromProgram(prog) {
  if (prog.type === "timer") { openTimer(prog); return; }
  const begin = () => {
    const draft = {
      id: uid(), date: new Date().toISOString(), name: prog.name,
      entries: prog.exercises.map((pe) => {
        const ex = findOrCreateExercise(pe.name, pe.muscle);
        const targets = pe.sets && pe.sets.length ? pe.sets : ["8-12"];
        return {
          exerciseId: ex.id, comment: pe.comment || "", rest: pe.rest != null ? pe.rest : state.settings.rest,
          sets: targets.map((t, i) => suggestedSet(ex.id, i, t)),
        };
      }),
    };
    state.draft = draft;
    state._prPlayed = {};
    save(STORE.draft, draft);
    switchView("seance");
    toast("Séance chargée 💪");
  };
  if (state.draft) {
    if (confirm("Une séance est déjà en cours. La remplacer par ce modèle ?")) begin();
  } else begin();
}

function finishSession() {
  const d = state.draft;
  const doneEntries = d.entries
    .map((en) => ({ ...en, sets: en.sets.filter((s) => s.done && (s.weight !== "" || s.reps !== "")) }))
    .filter((en) => en.sets.length > 0);

  if (doneEntries.length === 0) {
    if (!confirm("Aucune série cochée. Enregistrer quand même une séance vide ? (Annuler pour continuer)")) return;
  }
  const sess = { id: d.id, date: d.date, name: d.name, entries: doneEntries.length ? doneEntries : d.entries, note: "" };
  state.sessions.unshift(sess);
  save(STORE.sessions, state.sessions);
  state.draft = null; localStorage.removeItem(STORE.draft);
  stopRest();
  toast("Séance enregistrée 💪");
  switchView("historique");
}

function lastPerfSet(exId, excludeId) {
  for (const sess of state.sessions) {
    if (sess.id === excludeId) continue;
    const en = sess.entries.find((e) => e.exerciseId === exId);
    if (en && en.sets.length) {
      const best = en.sets.reduce((a, b) => (Number(b.weight) || 0) >= (Number(a.weight) || 0) ? b : a);
      return best;
    }
  }
  return null;
}
function lastPerf(exId, excludeId) {
  const s = lastPerfSet(exId, excludeId);
  return s ? `${s.weight || 0}${state.settings.unit} × ${s.reps || 0}` : null;
}
function lastSessionHint() {
  if (!state.sessions.length) return `<p class="small muted" style="text-align:center;margin-top:18px">Astuce : choisis un de tes modèles pour démarrer une séance pré-remplie.</p>`;
  const last = state.sessions[0];
  return `<div class="card" style="margin-top:18px"><div class="small muted">Dernière séance</div><div style="font-weight:700">${esc(last.name || "Séance")} · ${fmtDateShort(last.date)}</div><div class="small muted">${last.entries.map((e) => esc(exById(e.exerciseId)?.name || "?")).join(", ")}</div></div>`;
}

/* ============================================================
   Sélecteur d'exercice (modal)
   ============================================================ */
function openExercisePicker(onPick) {
  const render = (filter = "") => {
    const f = filter.toLowerCase().trim();
    const list = state.exercises
      .filter((e) => !f || e.name.toLowerCase().includes(f) || e.muscle.toLowerCase().includes(f))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    const items = list.map((e) => `
      <div class="lib-item" data-id="${e.id}">
        <div><div style="font-weight:600">${esc(e.name)}</div><div class="tiny muted">${esc(e.muscle)}</div></div>
        <button class="add" data-id="${e.id}">＋</button>
      </div>`).join("") || `<p class="muted small">Aucun exercice. Crée-en un ci-dessous.</p>`;
    document.getElementById("modalBox").innerHTML = `
      <h2>Choisir un exercice</h2>
      <input class="search" id="pickSearch" placeholder="Rechercher…" value="${esc(filter)}" />
      <div style="max-height:46vh;overflow-y:auto">${items}</div>
      <div class="spacer"></div>
      <button class="btn btn-block" id="newExInline">＋ Créer un nouvel exercice</button>
    `;
    const s = document.getElementById("pickSearch");
    s.oninput = () => render(s.value);
    document.querySelectorAll("#modalBox .lib-item, #modalBox .add").forEach((node) => {
      node.onclick = (ev) => { ev.stopPropagation(); closeModal(); onPick(node.dataset.id); };
    });
    document.getElementById("newExInline").onclick = () => {
      openExerciseForm(null, (created) => { closeModal(); onPick(created.id); });
    };
  };
  document.getElementById("modal").classList.remove("hidden");
  render("");
}

/* ============================================================
   VUE : Modèles (séances muscu + minuteurs)
   ============================================================ */
function renderModeles() {
  const el = document.getElementById("view-modeles");
  const muscu = state.programs.filter((p) => p.type === "muscu");
  const timers = state.programs.filter((p) => p.type === "timer");

  let html = `
    <button class="btn btn-ghost btn-block back-btn" id="backReglages">‹ Retour aux réglages</button>
    <div class="spacer"></div>
    <div class="row" style="margin-bottom:14px">
      <button class="btn btn-primary" id="newMuscu">＋ Séance</button>
      <button class="btn" id="newTimer">＋ Minuteur</button>
    </div>
    <div class="section-title">Séances muscu</div>
  `;
  html += muscu.length ? muscu.map(programCard).join("") : `<p class="muted small">Aucun modèle. Crée ta première séance.</p>`;
  html += `<div class="section-title">Minuteurs (EMOM, AMRAP, Tabata…)</div>`;
  html += timers.length ? timers.map(programCard).join("") : `<p class="muted small">Aucun minuteur.</p>`;
  el.innerHTML = html;

  document.getElementById("backReglages").onclick = () => switchView("reglages");
  document.getElementById("newMuscu").onclick = () => openMuscuBuilder(null);
  document.getElementById("newTimer").onclick = () => openTimerBuilder(null);
  el.querySelectorAll(".prog-start").forEach((b) => b.onclick = () => startFromProgram(state.programs.find((p) => p.id === b.dataset.id)));
  el.querySelectorAll(".prog-edit").forEach((b) => b.onclick = () => {
    const p = state.programs.find((x) => x.id === b.dataset.id);
    p.type === "timer" ? openTimerBuilder(p) : openMuscuBuilder(p);
  });
  el.querySelectorAll(".prog-del").forEach((b) => b.onclick = () => {
    const p = state.programs.find((x) => x.id === b.dataset.id);
    if (confirm(`Supprimer le modèle « ${p.name} » ?`)) {
      state.programs = state.programs.filter((x) => x.id !== b.dataset.id);
      save(STORE.programs, state.programs); render();
    }
  });
}

function programCard(p) {
  let summary;
  if (p.type === "timer") summary = timerSummary(p);
  else summary = `${p.exercises.length} exercice${p.exercises.length > 1 ? "s" : ""} · ${p.exercises.map((e) => esc(e.name)).join(", ")}`;
  return `
    <div class="card">
      <div class="card-h">
        <div style="font-weight:700">${p.type === "timer" ? "⏱ " : ""}${esc(p.name)}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-ghost prog-edit" data-id="${p.id}">✎</button>
          <button class="btn btn-sm btn-ghost prog-del" data-id="${p.id}">🗑</button>
        </div>
      </div>
      <div class="small muted" style="margin-bottom:10px">${summary}</div>
      <button class="btn ${p.type === "timer" ? "btn-primary" : "btn-green"} btn-block btn-sm prog-start" data-id="${p.id}">
        ${p.type === "timer" ? "▶ Lancer le minuteur" : "▶ Démarrer la séance"}
      </button>
    </div>`;
}

/* ---------- Constructeur de séance muscu ---------- */
let mb = null; // modèle en cours d'édition
function openMuscuBuilder(existing) {
  mb = existing ? deepCopy(existing) : { id: uid(), name: "", type: "muscu", exercises: [] };
  if (!mb.exercises.length) mb.exercises.push(blankBuildEx());
  renderMuscuBuilder();
}
function blankBuildEx() { return { name: "", muscle: "Pectoraux", sets: ["8-12"], rest: 90, comment: "" }; }

function renderMuscuBuilder() {
  const muscles = MUSCLE_ORDER;
  const exHtml = mb.exercises.map((ex, i) => `
    <div class="build-ex" data-ex="${i}">
      <div class="card-h">
        <b>Exercice ${i + 1}</b>
        <button class="btn btn-sm btn-ghost" data-rmex="${i}">🗑</button>
      </div>
      <div class="field"><input data-ex="${i}" data-f="name" list="exNames" autocomplete="off" value="${esc(ex.name)}" placeholder="Nom (choisis ou tape le tien)" /></div>
      <div class="row">
        <div class="field" style="margin:0"><label>Muscle</label>
          <select data-ex="${i}" data-f="muscle">${muscles.map((m) => `<option ${ex.muscle === m ? "selected" : ""}>${m}</option>`).join("")}</select>
        </div>
        <div class="field" style="margin:0"><label>Repos (s)</label>
          <input type="number" inputmode="numeric" data-ex="${i}" data-f="rest" value="${ex.rest}" />
        </div>
      </div>
      <label class="small muted" style="display:block;margin:8px 0 4px">Séries (objectif de reps)</label>
      <div class="build-sets">
        ${ex.sets.map((t, si) => `<div class="build-set"><input data-ex="${i}" data-set="${si}" value="${esc(t)}" placeholder="8-12" /><button class="mini" data-rmset="${i}_${si}">✕</button></div>`).join("")}
        <button class="btn btn-sm add-bset" data-ex="${i}">＋ Série</button>
      </div>
      <div class="field" style="margin-top:10px"><input data-ex="${i}" data-f="comment" value="${esc(ex.comment || "")}" placeholder="Commentaire (facultatif)" /></div>
    </div>
  `).join("");

  openModal(`
    <h2>${mb.name ? "Modifier la séance" : "Nouvelle séance"}</h2>
    <div class="field"><label>Nom du modèle</label><input id="mbName" value="${esc(mb.name)}" placeholder="Ex : Lundi — Upper A" /></div>
    <datalist id="exNames">${state.exercises.slice().sort((a, b) => a.name.localeCompare(b.name, "fr")).map((e) => `<option value="${esc(e.name)}"></option>`).join("")}</datalist>
    <div id="mbExercises">${exHtml}</div>
    <button class="btn btn-block" id="mbAddEx">＋ Ajouter un exercice</button>
    <div class="spacer"></div>
    <div class="row">
      <button class="btn btn-ghost" id="mbCancel">Annuler</button>
      <button class="btn btn-primary" id="mbSave">Enregistrer</button>
    </div>
  `);
  bindMuscuBuilder();
}

function syncMuscuFromDOM() {
  const nameEl = document.getElementById("mbName");
  if (nameEl) mb.name = nameEl.value;
  mb.exercises.forEach((ex, i) => {
    const g = (f) => document.querySelector(`[data-ex="${i}"][data-f="${f}"]`);
    if (g("name")) ex.name = g("name").value;
    if (g("muscle")) ex.muscle = g("muscle").value;
    if (g("rest")) ex.rest = parseInt(g("rest").value) || 0;
    if (g("comment")) ex.comment = g("comment").value;
    ex.sets = ex.sets.map((t, si) => {
      const el = document.querySelector(`[data-ex="${i}"][data-set="${si}"]`);
      return el ? el.value : t;
    });
  });
}

function bindMuscuBuilder() {
  document.getElementById("mbCancel").onclick = closeModal;
  // Quand on choisit/tape un exo déjà connu, remplir son groupe musculaire
  document.querySelectorAll('[data-f="name"]').forEach((inp) => inp.onchange = () => {
    const i = +inp.dataset.ex;
    const found = state.exercises.find((e) => e.name.toLowerCase() === inp.value.trim().toLowerCase());
    if (found) {
      mb.exercises[i].muscle = found.muscle;
      const sel = document.querySelector(`[data-ex="${i}"][data-f="muscle"]`);
      if (sel) sel.value = found.muscle;
    }
  });
  document.getElementById("mbAddEx").onclick = () => { syncMuscuFromDOM(); mb.exercises.push(blankBuildEx()); renderMuscuBuilder(); };
  document.querySelectorAll("[data-rmex]").forEach((b) => b.onclick = () => {
    syncMuscuFromDOM(); mb.exercises.splice(+b.dataset.rmex, 1);
    if (!mb.exercises.length) mb.exercises.push(blankBuildEx());
    renderMuscuBuilder();
  });
  document.querySelectorAll(".add-bset").forEach((b) => b.onclick = () => {
    syncMuscuFromDOM(); mb.exercises[+b.dataset.ex].sets.push("8-12"); renderMuscuBuilder();
  });
  document.querySelectorAll("[data-rmset]").forEach((b) => b.onclick = () => {
    syncMuscuFromDOM();
    const [ei, si] = b.dataset.rmset.split("_").map(Number);
    mb.exercises[ei].sets.splice(si, 1);
    if (!mb.exercises[ei].sets.length) mb.exercises[ei].sets.push("8-12");
    renderMuscuBuilder();
  });
  document.getElementById("mbSave").onclick = () => {
    syncMuscuFromDOM();
    if (!mb.name.trim()) { toast("Donne un nom au modèle"); return; }
    mb.exercises = mb.exercises.filter((e) => e.name.trim());
    if (!mb.exercises.length) { toast("Ajoute au moins un exercice"); return; }
    mb.exercises.forEach((e) => findOrCreateExercise(e.name.trim(), e.muscle));
    const idx = state.programs.findIndex((p) => p.id === mb.id);
    if (idx >= 0) state.programs[idx] = mb; else state.programs.push(mb);
    save(STORE.programs, state.programs);
    closeModal(); render(); toast("Modèle enregistré");
  };
}

/* ---------- Constructeur de minuteur ---------- */
const TIMER_MODES = {
  emom: "EMOM (toutes les X)", amrap: "AMRAP (compte à rebours)",
  tabata: "Tabata", interval: "Intervalles", chrono: "Chrono (compte en avant)",
};
let tb = null;
function openTimerBuilder(existing) {
  tb = existing ? deepCopy(existing) : { id: uid(), name: "", type: "timer", mode: "emom", cfg: { interval: 60, rounds: 10 } };
  renderTimerBuilder();
}
function timerFields() {
  const c = tb.cfg;
  if (tb.mode === "emom") return `
    <div class="row">
      <div class="field"><label>Intervalle (s)</label><input type="number" id="c_interval" value="${c.interval ?? 60}" /></div>
      <div class="field"><label>Nb de rounds</label><input type="number" id="c_rounds" value="${c.rounds ?? 10}" /></div>
    </div>`;
  if (tb.mode === "amrap") return `
    <div class="field"><label>Durée (minutes)</label><input type="number" id="c_min" value="${(c.duration ?? 600) / 60}" /></div>`;
  if (tb.mode === "tabata" || tb.mode === "interval") return `
    <div class="row">
      <div class="field"><label>Travail (s)</label><input type="number" id="c_work" value="${c.work ?? (tb.mode === "tabata" ? 20 : 40)}" /></div>
      <div class="field"><label>Repos (s)</label><input type="number" id="c_rest" value="${c.rest ?? (tb.mode === "tabata" ? 10 : 20)}" /></div>
    </div>
    <div class="field"><label>Nb de rounds</label><input type="number" id="c_rounds" value="${c.rounds ?? 8}" /></div>`;
  return `<p class="small muted">Chrono simple : compte le temps qui monte jusqu'à ce que tu l'arrêtes.</p>`;
}
function renderTimerBuilder() {
  openModal(`
    <h2>${tb.name ? "Modifier le minuteur" : "Nouveau minuteur"}</h2>
    <div class="field"><label>Nom</label><input id="tbName" value="${esc(tb.name)}" placeholder="Ex : EMOM 12 min" /></div>
    <div class="field"><label>Type</label>
      <select id="tbMode">${Object.entries(TIMER_MODES).map(([k, v]) => `<option value="${k}" ${tb.mode === k ? "selected" : ""}>${v}</option>`).join("")}</select>
    </div>
    <div id="tbFields">${timerFields()}</div>
    <div class="spacer"></div>
    <div class="row">
      <button class="btn btn-ghost" id="tbCancel">Annuler</button>
      <button class="btn btn-primary" id="tbSave">Enregistrer</button>
    </div>
  `);
  document.getElementById("tbCancel").onclick = closeModal;
  document.getElementById("tbMode").onchange = (e) => {
    syncTimerName();
    tb.mode = e.target.value; tb.cfg = {};
    document.getElementById("tbFields").innerHTML = timerFields();
  };
  document.getElementById("tbSave").onclick = () => {
    syncTimerName();
    tb.cfg = readTimerCfg();
    if (!tb.name.trim()) { toast("Donne un nom au minuteur"); return; }
    const idx = state.programs.findIndex((p) => p.id === tb.id);
    if (idx >= 0) state.programs[idx] = tb; else state.programs.push(tb);
    save(STORE.programs, state.programs);
    closeModal(); render(); toast("Minuteur enregistré");
  };
}
function syncTimerName() { const n = document.getElementById("tbName"); if (n) tb.name = n.value; }
function readTimerCfg() {
  const val = (id, d) => { const el = document.getElementById(id); return el ? (parseInt(el.value) || 0) : d; };
  if (tb.mode === "emom") return { interval: Math.max(5, val("c_interval", 60)), rounds: Math.max(1, val("c_rounds", 10)) };
  if (tb.mode === "amrap") return { duration: Math.max(10, val("c_min", 10) * 60) };
  if (tb.mode === "tabata" || tb.mode === "interval") return { work: Math.max(1, val("c_work", 20)), rest: Math.max(0, val("c_rest", 10)), rounds: Math.max(1, val("c_rounds", 8)) };
  return {};
}
function timerSummary(p) {
  const c = p.cfg || {};
  if (p.mode === "emom") return `EMOM · ${c.rounds} × ${mmss(c.interval)}`;
  if (p.mode === "amrap") return `AMRAP · ${mmss(c.duration)}`;
  if (p.mode === "tabata") return `Tabata · ${c.rounds} × (${c.work}s / ${c.rest}s)`;
  if (p.mode === "interval") return `Intervalles · ${c.rounds} × (${c.work}s / ${c.rest}s)`;
  return "Chrono";
}

/* ============================================================
   MINUTEUR plein écran (EMOM / AMRAP / Tabata / Intervalles / Chrono)
   ============================================================ */
let T = null;
let audioCtx = null;
function tone(freq, dur, vol) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.frequency.value = freq; o.type = "sine"; o.connect(g); g.connect(audioCtx.destination);
    const t0 = audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.15));
    o.start(t0); o.stop(t0 + (dur || 0.15) + 0.02);
  } catch (e) { /* audio indispo */ }
}
function vibe(p) { if (navigator.vibrate) navigator.vibrate(p); }

/* ---- Sons de performance (records / moins bien) ---- */
function ensureAudio() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  } catch (e) { return null; }
}
function scheduleTone(freq, at, dur, vol, type) {
  const c = audioCtx;
  const o = c.createOscillator(), g = c.createGain();
  o.type = type || "square"; o.frequency.setValueAtTime(freq, at);
  o.connect(g); g.connect(c.destination);
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(vol, at + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
  o.start(at); o.stop(at + dur + 0.03);
}
function playMelody(notes, type) {
  const c = ensureAudio();
  if (!c) return;
  const t0 = c.currentTime + 0.03;
  notes.forEach((n) => scheduleTone(n.f, t0 + n.t, n.d, n.v == null ? 0.3 : n.v, n.type || type));
}
function playPR() {
  playMelody([
    { f: 523.25, t: 0, d: 0.12 }, { f: 659.25, t: 0.10, d: 0.12 }, { f: 783.99, t: 0.20, d: 0.12 },
    { f: 1046.5, t: 0.30, d: 0.26 }, { f: 1046.5, t: 0.60, d: 0.10 }, { f: 1318.5, t: 0.72, d: 0.34 },
  ], "square");
}
function playBetter() {
  playMelody([{ f: 659.25, t: 0, d: 0.10, v: 0.26 }, { f: 987.77, t: 0.10, d: 0.16, v: 0.26 }], "triangle");
}
function playWorse() {
  playMelody([
    { f: 392.0, t: 0, d: 0.18, v: 0.24 }, { f: 329.63, t: 0.19, d: 0.2, v: 0.24 }, { f: 261.63, t: 0.41, d: 0.36, v: 0.24 },
  ], "sawtooth");
}
/* Garde le contexte audio actif pendant le minuteur (sinon le bip final se
   perd quand une autre appli — musique — prend le focus audio) */
function startTimerAudio() {
  const c = ensureAudio();
  if (!c || !T) return;
  try {
    const o = c.createOscillator(), g = c.createGain();
    g.gain.value = 0.0001; o.frequency.value = 30;
    o.connect(g); g.connect(c.destination); o.start();
    T._ka = o;
  } catch (e) {}
}
function stopTimerAudio() {
  try { if (T && T._ka) { T._ka.stop(); T._ka.disconnect(); T._ka = null; } } catch (e) {}
}
/* Alerte de fin de minuteur : forte (passe par-dessus la musique) + vibration */
function playTimerEnd() {
  const c = ensureAudio();
  if (c) {
    const t0 = c.currentTime + 0.03;
    scheduleTone(1000, t0, 0.22, 0.55, "square");
    scheduleTone(1000, t0 + 0.30, 0.22, 0.55, "square");
    scheduleTone(1000, t0 + 0.60, 0.22, 0.55, "square");
    scheduleTone(1320, t0 + 0.90, 0.45, 0.55, "square");
  }
  vibe([220, 120, 220, 120, 450]);
}

/* Empêche l'écran de se verrouiller tant que l'appli est ouverte (au 1er plan).
   Le verrou est libéré par le navigateur quand la page passe en arrière-plan
   et re-demandé automatiquement au retour. */
let wakeLock = null;
async function ensureWakeLock() {
  try {
    if (!("wakeLock" in navigator) || document.visibilityState !== "visible" || wakeLock) return;
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch (e) { wakeLock = null; }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") ensureWakeLock(); });
document.addEventListener("pointerdown", ensureWakeLock, { passive: true });

function buildPhases(p) {
  const c = p.cfg || {};
  const ph = [];
  if (p.mode === "emom") {
    for (let i = 1; i <= c.rounds; i++) ph.push({ label: "EMOM", kind: "work", seconds: c.interval, round: i, rounds: c.rounds });
  } else if (p.mode === "amrap") {
    ph.push({ label: "AMRAP", kind: "work", seconds: c.duration, round: 1, rounds: 1 });
  } else if (p.mode === "tabata" || p.mode === "interval") {
    for (let i = 1; i <= c.rounds; i++) {
      ph.push({ label: "Travail", kind: "work", seconds: c.work, round: i, rounds: c.rounds });
      if (c.rest > 0 && i < c.rounds) ph.push({ label: "Repos", kind: "rest", seconds: c.rest, round: i, rounds: c.rounds });
    }
  }
  return ph;
}

/* Choix d'un minuteur à lancer à la main pendant la séance */
function openTimerPicker() {
  const timers = state.programs.filter((p) => p.type === "timer");
  const list = timers.map((p) => `
    <button class="btn btn-block" data-tid="${p.id}" style="justify-content:space-between;margin-bottom:8px">
      <span>⏱ ${esc(p.name)}</span><span class="tiny muted">${esc(timerSummary(p))}</span>
    </button>`).join("");
  openModal(`
    <h2>Lancer un minuteur</h2>
    <button class="btn btn-primary btn-block" id="quickChrono">▶ Chrono (compte en avant)</button>
    ${timers.length ? `<div class="section-title">Tes minuteurs</div>${list}` : `<p class="small muted" style="margin-top:12px">Astuce : crée des EMOM, Tabata… dans Réglages → Mes modèles.</p>`}
    <button class="btn btn-ghost btn-block" id="tpCancel" style="margin-top:8px">Fermer</button>
  `);
  document.getElementById("quickChrono").onclick = () => { closeModal(); openTimer({ name: "Chrono", mode: "chrono", cfg: {} }); };
  document.getElementById("tpCancel").onclick = closeModal;
  document.querySelectorAll("#modalBox [data-tid]").forEach((b) => b.onclick = () => {
    const p = state.programs.find((x) => x.id === b.dataset.tid);
    closeModal(); openTimer(p);
  });
}

function openTimer(prog) {
  const overlay = document.getElementById("timer");
  document.getElementById("tName").textContent = prog.name;
  overlay.classList.remove("hidden");
  ensureWakeLock();
  ensureAudio();

  if (prog.mode === "chrono") {
    T = { prog, chrono: true, startAt: Date.now(), paused: false, elapsed: 0 };
    document.getElementById("timer").dataset.kind = "work";
    document.getElementById("tPhase").textContent = "Chrono";
    document.getElementById("tRound").textContent = "";
    document.getElementById("tTotal").textContent = "";
    T.tick = setInterval(tickChrono, 100);
  } else {
    T = { prog, phases: buildPhases(prog), idx: -1, paused: false, phaseEndsAt: 0, remaining: 0, lastBeep: null, done: false };
    T.total = T.phases.reduce((s, p) => s + p.seconds, 0);
    startPhase(0);
    T.tick = setInterval(tickTimer, 100);
  }
  startTimerAudio();
  bindTimerControls();
}

function startPhase(i) {
  if (i >= T.phases.length) { finishTimer(); return; }
  T.idx = i;
  const ph = T.phases[i];
  T.phaseEndsAt = Date.now() + ph.seconds * 1000;
  T.lastBeep = null;
  document.getElementById("timer").dataset.kind = ph.kind;
  tone(ph.kind === "rest" ? 520 : 900, 0.18, 0.35);
  updateTimerUI(ph, ph.seconds);
}

function tickTimer() {
  if (T.paused || T.done) return;
  const ph = T.phases[T.idx];
  const rem = (T.phaseEndsAt - Date.now()) / 1000;
  if (rem <= 0.05) { startPhase(T.idx + 1); return; }
  const whole = Math.ceil(rem);
  if (whole <= 3 && whole !== T.lastBeep) { T.lastBeep = whole; tone(680, 0.08, 0.25); }
  updateTimerUI(ph, rem);
}

function updateTimerUI(ph, rem) {
  document.getElementById("tPhase").textContent = ph.label;
  document.getElementById("tRound").textContent = ph.rounds > 1 ? `${ph.round} / ${ph.rounds}` : "";
  document.getElementById("tClock").textContent = mmss(Math.ceil(rem));
  // progression globale
  let elapsed = 0;
  for (let k = 0; k < T.idx; k++) elapsed += T.phases[k].seconds;
  elapsed += (ph.seconds - rem);
  document.getElementById("tTotal").textContent = `Total ${mmss(elapsed)} / ${mmss(T.total)}`;
}

function tickChrono() {
  if (T.paused) return;
  T.elapsed = (Date.now() - T.startAt) / 1000;
  document.getElementById("tClock").textContent = mmss(T.elapsed);
}

function finishTimer() {
  clearInterval(T.tick);
  T.done = true;
  document.getElementById("timer").dataset.kind = "done";
  document.getElementById("tPhase").textContent = "Terminé 💪";
  document.getElementById("tRound").textContent = "";
  document.getElementById("tClock").textContent = "✓";
  stopTimerAudio();
  playTimerEnd();
  const ctrl = document.querySelector(".timer-controls");
  ctrl.innerHTML = `
    <button class="btn btn-green timer-btn" id="tLog">Enregistrer au journal</button>
    <button class="btn timer-btn" id="tClose">Fermer</button>`;
  document.getElementById("tLog").onclick = () => { logTimerSession(T.prog); closeTimer(); };
  document.getElementById("tClose").onclick = closeTimer;
}

function logTimerSession(prog) {
  state.sessions.unshift({ id: uid(), date: new Date().toISOString(), name: prog.name, entries: [], note: timerSummary(prog) });
  save(STORE.sessions, state.sessions);
  toast("Ajouté au journal");
}

function bindTimerControls() {
  const pause = document.getElementById("tPause");
  pause.textContent = "⏸ Pause";
  pause.onclick = () => {
    if (T.chrono) {
      T.paused = !T.paused;
      if (T.paused) { T.pauseAt = Date.now(); } else { T.startAt += (Date.now() - T.pauseAt); }
    } else {
      if (!T.paused) { T.remaining = T.phaseEndsAt - Date.now(); T.paused = true; }
      else { T.phaseEndsAt = Date.now() + T.remaining; T.paused = false; }
    }
    pause.textContent = T.paused ? "▶ Reprendre" : "⏸ Pause";
  };
  document.getElementById("tQuit").onclick = () => {
    if (T.done || confirm("Arrêter le minuteur ?")) closeTimer();
  };
}

function closeTimer() {
  if (T && T.tick) clearInterval(T.tick);
  stopTimerAudio();
  T = null;
  // on garde le verrou d'écran actif tant que l'appli reste ouverte
  const overlay = document.getElementById("timer");
  overlay.classList.add("hidden");
  // restaurer les contrôles par défaut
  document.querySelector(".timer-controls").innerHTML = `
    <button class="btn timer-btn" id="tPause">⏸ Pause</button>
    <button class="btn btn-danger timer-btn" id="tQuit">Quitter</button>`;
}

/* ============================================================
   VUE : Historique / Journal
   ============================================================ */
function renderHistorique() {
  const el = document.getElementById("view-historique");
  if (!state.sessions.length) {
    el.innerHTML = `<div class="empty"><div class="big">📅</div><p>Aucune séance enregistrée.<br>Termine une séance pour la voir ici.</p></div>`;
    return;
  }
  let html = "";
  state.sessions.forEach((sess) => {
    const t = sessionVolume(sess);
    const body = sess.note
      ? `<div class="small muted" style="margin-top:4px">⏱ ${esc(sess.note)}</div>`
      : `<div>${sess.entries.map((e) => `<span class="pill">${esc(exById(e.exerciseId)?.name || "?")}</span>`).join("")}</div>
         <div class="small muted" style="margin-top:6px">${t.sets} séries · ${t.vol} ${state.settings.unit} de volume</div>`;
    html += `
      <button class="card hist-item" data-id="${sess.id}">
        <div class="card-h">
          <div style="font-weight:700">${esc(sess.name || "Séance")}</div>
          <div class="small muted">${fmtDateShort(sess.date)}</div>
        </div>
        ${body}
      </button>`;
  });
  el.innerHTML = html;
  el.querySelectorAll(".hist-item").forEach((b) => b.onclick = () => showSessionDetail(b.dataset.id));
}

function showSessionDetail(id) {
  const sess = state.sessions.find((s) => s.id === id);
  if (!sess) return;
  const body = sess.entries.length ? sess.entries.map((en) => {
    const ex = exById(en.exerciseId);
    const sets = en.sets.map((s, i) => `<div class="small">Série ${i + 1} : <b>${s.weight || 0}${state.settings.unit} × ${s.reps || 0}</b></div>`).join("");
    const st = ex ? standardFor(ex.name) : null;
    const lvl = st ? computeLevel(st, en.sets[0] ? en.sets[0].weight : "", en.sets[0] ? en.sets[0].reps : "") : null;
    const badge = st && lvl ? `<div class="rank-badge" style="margin:6px 0 2px">${rankChip(lvl)}</div>` : "";
    return `<div class="card"><div style="font-weight:700">${esc(ex?.name || "?")}</div><div class="tiny muted" style="margin-bottom:4px">${esc(ex?.muscle || "")}</div>${badge}${sets}</div>`;
  }).join("") : `<p class="muted">${sess.note ? "⏱ " + esc(sess.note) : "Séance vide."}</p>`;
  openModal(`
    <h2>${esc(sess.name || "Séance")}</h2>
    <div class="small muted" style="margin-bottom:12px">${fmtDate(sess.date)}</div>
    ${body}
    <div class="row" style="margin-top:8px">
      <button class="btn btn-danger" id="delSess">Supprimer</button>
      <button class="btn" id="closeSess">Fermer</button>
    </div>
  `);
  document.getElementById("closeSess").onclick = closeModal;
  document.getElementById("delSess").onclick = () => {
    if (confirm("Supprimer définitivement cette séance ?")) {
      state.sessions = state.sessions.filter((s) => s.id !== id);
      save(STORE.sessions, state.sessions);
      closeModal(); render();
    }
  };
}

/* ============================================================
   VUE : Bibliothèque d'exercices
   ============================================================ */
function renderExercices() {
  const el = document.getElementById("view-exercices");
  const groups = {};
  state.exercises.forEach((e) => { (groups[e.muscle] = groups[e.muscle] || []).push(e); });
  const order = [...MUSCLE_ORDER.filter((m) => groups[m]), ...Object.keys(groups).filter((m) => !MUSCLE_ORDER.includes(m))];

  let html = `<button class="btn btn-ghost btn-block back-btn" id="backReglages2">‹ Retour aux réglages</button><div class="spacer"></div>
    <button class="btn btn-primary btn-block" id="newEx">＋ Nouvel exercice</button><div class="spacer"></div>`;
  order.forEach((muscle) => {
    const items = groups[muscle].sort((a, b) => a.name.localeCompare(b.name, "fr")).map((e) => `
      <div class="lib-item">
        <div style="font-weight:600">${esc(e.name)}</div>
        <div style="display:flex;gap:6px">
          <button class="btn btn-sm btn-ghost edit-ex" data-id="${e.id}">✎</button>
          <button class="btn btn-sm btn-ghost del-ex-lib" data-id="${e.id}">🗑</button>
        </div>
      </div>`).join("");
    html += `<div class="muscle-group"><h3>${esc(muscle)}</h3>${items}</div>`;
  });
  el.innerHTML = html;

  document.getElementById("backReglages2").onclick = () => switchView("reglages");
  document.getElementById("newEx").onclick = () => openExerciseForm(null, () => render());
  el.querySelectorAll(".edit-ex").forEach((b) => b.onclick = () => openExerciseForm(exById(b.dataset.id), () => render()));
  el.querySelectorAll(".del-ex-lib").forEach((b) => b.onclick = () => {
    const ex = exById(b.dataset.id);
    if (confirm(`Supprimer « ${ex.name} » ? (Tes séances passées ne sont pas modifiées)`)) {
      state.exercises = state.exercises.filter((e) => e.id !== b.dataset.id);
      save(STORE.ex, state.exercises); render();
    }
  });
}

function openExerciseForm(ex, onDone) {
  const isNew = !ex;
  const muscles = MUSCLE_ORDER;
  openModal(`
    <h2>${isNew ? "Nouvel exercice" : "Modifier l'exercice"}</h2>
    <div class="field"><label>Nom</label><input id="exName" value="${ex ? esc(ex.name) : ""}" placeholder="Ex : Développé couché" /></div>
    <div class="field"><label>Groupe musculaire</label>
      <select id="exMuscle">${muscles.map((m) => `<option ${ex && ex.muscle === m ? "selected" : ""}>${m}</option>`).join("")}</select>
    </div>
    <div class="row">
      <button class="btn btn-ghost" id="exCancel">Annuler</button>
      <button class="btn btn-primary" id="exSave">Enregistrer</button>
    </div>
  `);
  document.getElementById("exCancel").onclick = closeModal;
  document.getElementById("exSave").onclick = () => {
    const name = document.getElementById("exName").value.trim();
    const muscle = document.getElementById("exMuscle").value;
    if (!name) { toast("Donne un nom à l'exercice"); return; }
    let result;
    if (isNew) { result = { id: uid(), name, muscle }; state.exercises.push(result); }
    else { ex.name = name; ex.muscle = muscle; result = ex; }
    save(STORE.ex, state.exercises);
    closeModal(); onDone && onDone(result);
  };
}

/* ============================================================
   VUE : Progression
   ============================================================ */
function renderProgression() {
  const el = document.getElementById("view-progression");
  el.innerHTML = `
    <div class="segmented">
      <button class="seg ${state.progMode === "perf" ? "on" : ""}" data-mode="perf">🏋️ Perfs</button>
      <button class="seg ${state.progMode === "mensu" ? "on" : ""}" data-mode="mensu">📏 Mesures</button>
      <button class="seg ${state.progMode === "muscles" ? "on" : ""}" data-mode="muscles">🔥 Muscles</button>
    </div>
    <div id="progBody"></div>
  `;
  el.querySelectorAll(".seg").forEach((b) => b.onclick = () => { state.progMode = b.dataset.mode; renderProgression(); });
  const body = document.getElementById("progBody");
  if (state.progMode === "mensu") renderMensurations(body);
  else if (state.progMode === "muscles") renderMuscleMap(body);
  else renderPerf(body);
}

function renderPerf(el) {
  const usedIds = new Set();
  state.sessions.forEach((s) => s.entries.forEach((e) => usedIds.add(e.exerciseId)));
  const used = state.exercises.filter((e) => usedIds.has(e.id));

  if (!used.length) {
    el.innerHTML = `<div class="empty"><div class="big">📈</div><p>Pas encore de données.<br>Enregistre des séances pour suivre ta progression.</p></div>`;
    return;
  }
  if (!state.progExercise || !usedIds.has(state.progExercise)) state.progExercise = used[0].id;

  // Niveaux de force (exercices avec barème présents dans l'historique)
  const rankable = used.filter((e) => standardFor(e.name));
  let levelsHtml = "";
  if (rankable.length) {
    levelsHtml = `<div class="card"><div class="section-title" style="margin-top:0">🏅 Niveaux de force</div>` +
      rankable.map((e) => {
        const cl = currentLevel(e.id);
        return `<div class="level-row"><span>${esc(e.name)}</span>${rankChip(cl ? cl.lvl : null)}</div>`;
      }).join("") + `</div>`;
  }

  const options = used.map((e) => `<option value="${e.id}" ${e.id === state.progExercise ? "selected" : ""}>${esc(e.name)}</option>`).join("");
  const data = progressData(state.progExercise);
  const pr = data.reduce((m, d) => Math.max(m, d.top), 0);
  const e1rm = data.reduce((m, d) => Math.max(m, d.e1rm), 0);
  const selCl = currentLevel(state.progExercise);
  const selBadge = selCl ? `<div class="rank-badge" style="margin-top:10px">${rankBadgeHtml(selCl.st, selCl.lvl)}</div>` : "";

  el.innerHTML = `
    ${levelsHtml}
    <select class="search" id="progSel">${options}</select>
    <div class="card">
      <div class="stat-row">
        <div class="stat"><div class="v">${pr}${state.settings.unit}</div><div class="l">record (top série)</div></div>
        <div class="stat"><div class="v">${Math.round(e1rm)}${state.settings.unit}</div><div class="l">1RM estimé</div></div>
        <div class="stat"><div class="v">${data.length}</div><div class="l">séances</div></div>
      </div>
      ${selBadge}
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Poids de la meilleure série</div>
      <div class="chart-wrap">${chartSvg(data)}</div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Détail par séance</div>
      ${data.slice().reverse().map((d) => `<div class="small" style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid var(--line)"><span class="muted">${fmtDateShort(d.date)}</span><b>${d.top}${state.settings.unit} × ${d.reps}</b></div>`).join("")}
    </div>
  `;
  document.getElementById("progSel").onchange = (e) => { state.progExercise = e.target.value; render(); };
}

function progressData(exId) {
  const rows = [];
  [...state.sessions].reverse().forEach((sess) => {
    const en = sess.entries.find((e) => e.exerciseId === exId);
    if (!en || !en.sets.length) return;
    let top = 0, reps = 0, e1rm = 0;
    en.sets.forEach((s) => {
      const w = Number(s.weight) || 0, r = Number(s.reps) || 0;
      if (w > top) { top = w; reps = r; }
      const est = w * (1 + r / 30);
      if (est > e1rm) e1rm = est;
    });
    rows.push({ date: sess.date, top, reps, e1rm });
  });
  return rows;
}

function chartSvg(data) {
  const W = 320, H = 160, pad = 28;
  if (data.length < 2) return `<p class="small muted">Il faut au moins 2 séances pour tracer une courbe.</p>`;
  const ys = data.map((d) => d.top);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;
  const px = (i) => pad + (i / (data.length - 1)) * (W - pad * 2);
  const py = (v) => H - pad - ((v - minY) / rangeY) * (H - pad * 2);
  const pts = data.map((d, i) => `${px(i)},${py(d.top)}`);
  const area = `M${px(0)},${H - pad} L${pts.join(" L")} L${px(data.length - 1)},${H - pad} Z`;
  const line = `M${pts.join(" L")}`;
  const dots = data.map((d, i) => `<circle class="chart-dot" cx="${px(i)}" cy="${py(d.top)}" r="3.5" />`).join("");
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <line class="chart-axis" x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" />
      <path class="chart-area" d="${area}" />
      <path class="chart-line" d="${line}" />
      ${dots}
      <text class="chart-lbl" x="${pad}" y="${H - 8}">${fmtDateShort(data[0].date)}</text>
      <text class="chart-lbl" x="${W - pad}" y="${H - 8}" text-anchor="end">${fmtDateShort(data[data.length - 1].date)}</text>
      <text class="chart-lbl" x="4" y="${py(maxY) + 4}">${maxY}</text>
      <text class="chart-lbl" x="4" y="${py(minY) + 4}">${minY}</text>
    </svg>`;
}

/* ============================================================
   Mensurations
   ============================================================ */
function metricInfo(key) { return METRICS.find((m) => m.key === key); }
function measuresByDateDesc() { return [...state.measures].sort((a, b) => new Date(b.date) - new Date(a.date)); }

function renderMensurations(el) {
  const sorted = measuresByDateDesc();
  let html = `<button class="btn btn-primary btn-block" id="addMeasure">＋ Nouvelle mesure</button><div class="spacer"></div>`;

  if (!sorted.length) {
    el.innerHTML = html + `<div class="empty"><div class="big">📏</div><p>Aucune mesure.<br>Ajoute ta première prise de mesures.</p></div>`;
    document.getElementById("addMeasure").onclick = () => openMeasureForm(null);
    return;
  }

  const latest = sorted[0];
  const tiles = METRICS.map((m) => {
    const v = latest.values[m.key];
    if (v == null || v === "") return "";
    let pv = null;
    for (let i = 1; i < sorted.length; i++) {
      const x = sorted[i].values[m.key];
      if (x != null && x !== "") { pv = Number(x); break; }
    }
    let delta = "";
    if (pv != null) {
      const d = Number(v) - pv;
      if (Math.abs(d) >= 0.05) {
        const num = (Math.round(Math.abs(d) * 10) / 10);
        delta = `<span class="delta ${d > 0 ? "up" : "down"}">${d > 0 ? "▲" : "▼"} ${num}</span>`;
      }
    }
    return `<div class="measure-tile"><div class="mv">${v}<span class="mu">${m.unit}</span></div><div class="ml">${m.label} ${delta}</div></div>`;
  }).join("");

  html += `<div class="small muted" style="margin:2px 2px 8px">Dernière mesure · ${fmtDateShort(latest.date)}</div>
    <div class="measure-grid">${tiles}</div>`;

  // Courbe d'évolution
  const avail = METRICS.filter((m) => state.measures.some((x) => x.values[m.key] != null && x.values[m.key] !== ""));
  if (avail.length) {
    if (!avail.some((m) => m.key === state.measureMetric)) state.measureMetric = avail[0].key;
    const opts = avail.map((m) => `<option value="${m.key}" ${m.key === state.measureMetric ? "selected" : ""}>${m.label} (${m.unit})</option>`).join("");
    const info = metricInfo(state.measureMetric);
    const points = state.measures
      .filter((x) => x.values[state.measureMetric] != null && x.values[state.measureMetric] !== "")
      .map((x) => ({ date: x.date, value: Number(x.values[state.measureMetric]) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    html += `<div class="card">
      <select class="search" id="measureSel" style="margin-bottom:12px">${opts}</select>
      <div class="chart-wrap">${lineChartSvg(points, info.unit)}</div>
    </div>`;
  }

  // Historique des prises de mesures
  html += `<div class="section-title">Historique</div>`;
  html += sorted.map((entry) => {
    const parts = METRICS.filter((m) => entry.values[m.key] != null && entry.values[m.key] !== "")
      .map((m) => `<span class="pill">${m.label} ${entry.values[m.key]}${m.unit}</span>`).join("");
    return `<button class="card measure-item" data-id="${entry.id}">
      <div class="small muted" style="margin-bottom:6px">${fmtDate(entry.date)}</div>
      <div>${parts || '<span class="muted small">(vide)</span>'}</div>
    </button>`;
  }).join("");

  el.innerHTML = html;
  document.getElementById("addMeasure").onclick = () => openMeasureForm(null);
  const sel = document.getElementById("measureSel");
  if (sel) sel.onchange = () => { state.measureMetric = sel.value; render(); };
  el.querySelectorAll(".measure-item").forEach((b) => b.onclick = () => openMeasureForm(state.measures.find((m) => m.id === b.dataset.id)));
}

function openMeasureForm(existing) {
  const isNew = !existing;
  const dateVal = existing ? existing.date.slice(0, 10) : new Date().toISOString().slice(0, 10);
  const vals = existing ? existing.values : {};
  // valeur précédente comme aide de saisie
  const sorted = measuresByDateDesc();
  const lastVal = (key) => {
    for (const e of sorted) { if (e !== existing && e.values[key] != null && e.values[key] !== "") return e.values[key]; }
    return "";
  };
  const fields = METRICS.map((m) => `
    <div class="field" style="margin-bottom:10px">
      <label>${m.label} <span class="muted">(${m.unit})</span></label>
      <input type="number" inputmode="decimal" step="0.1" id="mf_${m.key}" value="${vals[m.key] ?? ""}" placeholder="${lastVal(m.key) !== "" ? lastVal(m.key) : "—"}" />
    </div>`).join("");
  openModal(`
    <h2>${isNew ? "Nouvelle mesure" : "Modifier la mesure"}</h2>
    <div class="field"><label>Date</label><input type="date" id="mf_date" value="${dateVal}" /></div>
    ${fields}
    <div class="row">
      ${isNew ? "" : '<button class="btn btn-danger" id="mfDel">Supprimer</button>'}
      <button class="btn btn-ghost" id="mfCancel">Annuler</button>
      <button class="btn btn-primary" id="mfSave">Enregistrer</button>
    </div>
  `);
  document.getElementById("mfCancel").onclick = closeModal;
  const delBtn = document.getElementById("mfDel");
  if (delBtn) delBtn.onclick = () => {
    if (confirm("Supprimer cette prise de mesures ?")) {
      state.measures = state.measures.filter((m) => m.id !== existing.id);
      save(STORE.measures, state.measures);
      closeModal(); render();
    }
  };
  document.getElementById("mfSave").onclick = () => {
    const date = document.getElementById("mf_date").value || new Date().toISOString().slice(0, 10);
    const values = {};
    let any = false;
    METRICS.forEach((m) => {
      const raw = document.getElementById("mf_" + m.key).value.trim();
      if (raw !== "") { values[m.key] = Number(raw.replace(",", ".")); any = true; }
    });
    if (!any) { toast("Renseigne au moins une mesure"); return; }
    const iso = new Date(date + "T12:00:00").toISOString();
    if (isNew) state.measures.push({ id: uid(), date: iso, values });
    else { existing.date = iso; existing.values = values; }
    save(STORE.measures, state.measures);
    closeModal(); render(); toast("Mesures enregistrées");
  };
}

/* Courbe générique (points chronologiques {date, value}) */
function lineChartSvg(points, unit) {
  const W = 320, H = 160, pad = 30;
  if (points.length < 2) return `<p class="small muted">Ajoute au moins 2 mesures pour tracer une courbe.</p>`;
  const ys = points.map((p) => p.value);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rangeY = maxY - minY || 1;
  const px = (i) => pad + (i / (points.length - 1)) * (W - pad * 2);
  const py = (v) => H - pad - ((v - minY) / rangeY) * (H - pad * 2);
  const pts = points.map((p, i) => `${px(i)},${py(p.value)}`);
  const area = `M${px(0)},${H - pad} L${pts.join(" L")} L${px(points.length - 1)},${H - pad} Z`;
  const dots = points.map((p, i) => `<circle class="chart-dot" cx="${px(i)}" cy="${py(p.value)}" r="3.5" />`).join("");
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <line class="chart-axis" x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" />
      <path class="chart-area" d="${area}" />
      <path class="chart-line" d="M${pts.join(" L")}" />
      ${dots}
      <text class="chart-lbl" x="${pad}" y="${H - 8}">${fmtDateShort(points[0].date)}</text>
      <text class="chart-lbl" x="${W - pad}" y="${H - 8}" text-anchor="end">${fmtDateShort(points[points.length - 1].date)}</text>
      <text class="chart-lbl" x="4" y="${py(maxY) + 4}">${maxY}${unit || ""}</text>
      <text class="chart-lbl" x="4" y="${py(minY) + 4}">${minY}${unit || ""}</text>
    </svg>`;
}

/* ============================================================
   Carte musculaire (sollicitation par séance / semaine / 7 jours)
   ============================================================ */
const MUSCLE_LABELS = {
  pectoraux: "Pectoraux", epaules: "Épaules", biceps: "Biceps", triceps: "Triceps",
  avantbras: "Avant-bras", abdos: "Abdos", dorsaux: "Dorsaux", trapezes: "Trapèzes",
  lombaires: "Lombaires", quadriceps: "Quadriceps", ischios: "Ischios", fessiers: "Fessiers", mollets: "Mollets",
};
const MUSCLE_KEYS = Object.keys(MUSCLE_LABELS);

/* Activation approximative par exercice (primaire ~1, secondaire ~0.3-0.7) */
const MUSCLE_RULES = [
  { kw: ["developpe couche", "bench"], m: { pectoraux: 1, triceps: 0.5, epaules: 0.4 } },
  { kw: ["developpe incline"], m: { pectoraux: 1, epaules: 0.5, triceps: 0.4 } },
  { kw: ["developpe militaire", "overhead", "ohp", "shoulder press", "developpe epaule"], m: { epaules: 1, triceps: 0.5, trapezes: 0.3 } },
  { kw: ["ecarte", "pec deck", "butterfly", "fly"], m: { pectoraux: 1 } },
  { kw: ["dips"], m: { triceps: 1, pectoraux: 0.6, epaules: 0.3 } },
  { kw: ["souleve de terre", "deadlift"], not: ["jambes tendues", "romanian", "stiff"], m: { lombaires: 1, fessiers: 0.8, ischios: 0.7, dorsaux: 0.6, trapezes: 0.5, quadriceps: 0.5 } },
  { kw: ["jambes tendues", "romanian", "stiff", "good morning"], m: { ischios: 1, fessiers: 0.8, lombaires: 0.6 } },
  { kw: ["traction", "tirage vertical", "tirage nuque", "lat pulldown", "pull up", "pullup", "pull-up"], m: { dorsaux: 1, biceps: 0.5, trapezes: 0.4, avantbras: 0.3 } },
  { kw: ["rowing", "tirage horizontal", "seal row"], m: { dorsaux: 1, trapezes: 0.6, biceps: 0.4, lombaires: 0.3 } },
  { kw: ["curl"], not: ["leg curl", "nordic"], m: { biceps: 1, avantbras: 0.4 } },
  { kw: ["triceps", "barre au front", "pushdown", "kickback", "skull"], m: { triceps: 1 } },
  { kw: ["squat", "presse", "leg press", "hack"], m: { quadriceps: 1, fessiers: 0.7, ischios: 0.4, lombaires: 0.2, abdos: 0.2 } },
  { kw: ["fente", "lunge", "split squat", "bulgare"], m: { quadriceps: 0.9, fessiers: 0.8, ischios: 0.4 } },
  { kw: ["leg curl", "ischio", "hamstring"], m: { ischios: 1 } },
  { kw: ["leg extension", "extension jambe"], m: { quadriceps: 1 } },
  { kw: ["mollet", "calf"], m: { mollets: 1 } },
  { kw: ["laterale", "lateral raise"], m: { epaules: 1 } },
  { kw: ["frontale", "front raise"], m: { epaules: 1 } },
  { kw: ["oiseau", "rear delt", "face pull", "reverse fly"], m: { epaules: 0.8, trapezes: 0.5, dorsaux: 0.3 } },
  { kw: ["upright row", "tirage menton", "menton"], m: { epaules: 0.8, trapezes: 0.8, biceps: 0.3 } },
  { kw: ["shrug", "haussement", "trapeze"], m: { trapezes: 1 } },
  { kw: ["hip thrust", "fessier", "glute", "pont"], m: { fessiers: 1, ischios: 0.4 } },
  { kw: ["gainage", "plank", "crunch", "abdo", "releve de jambe", "sit up", "oblique", "vacuum"], m: { abdos: 1 } },
];
const MUSCLE_FALLBACK = {
  "Pectoraux": { pectoraux: 1, triceps: 0.3, epaules: 0.3 },
  "Dos": { dorsaux: 1, biceps: 0.4, trapezes: 0.4, lombaires: 0.2 },
  "Épaules": { epaules: 1, trapezes: 0.3 },
  "Biceps": { biceps: 1, avantbras: 0.3 },
  "Triceps": { triceps: 1 },
  "Jambes": { quadriceps: 0.7, ischios: 0.5, fessiers: 0.6, mollets: 0.3 },
  "Abdos": { abdos: 1 },
};

function musclesForExercise(ex) {
  const n = norm(ex.name);
  const acc = {};
  let matched = false;
  MUSCLE_RULES.forEach((rule) => {
    if (rule.not && rule.not.some((k) => n.includes(norm(k)))) return;
    if (rule.kw.some((k) => n.includes(norm(k)))) {
      matched = true;
      for (const mk in rule.m) acc[mk] = Math.max(acc[mk] || 0, rule.m[mk]);
    }
  });
  if (!matched && MUSCLE_FALLBACK[ex.muscle]) {
    const fb = MUSCLE_FALLBACK[ex.muscle];
    for (const mk in fb) acc[mk] = Math.max(acc[mk] || 0, fb[mk]);
  }
  return acc;
}

function sessionsInPeriod(period) {
  if (period === "seance") {
    if (state.draft && state.draft.entries.some((en) => en.sets.some((s) => s.done))) return [state.draft];
    return state.sessions[0] ? [state.sessions[0]] : [];
  }
  const now = Date.now();
  let start;
  if (period === "7j") start = now - 7 * 864e5;
  else { const d = new Date(); const day = (d.getDay() + 6) % 7; d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - day); start = d.getTime(); }
  const list = state.sessions.filter((s) => new Date(s.date).getTime() >= start);
  if (state.draft && new Date(state.draft.date).getTime() >= start) list.push(state.draft);
  return list;
}

function muscleActivation(period) {
  const acc = {}; MUSCLE_KEYS.forEach((k) => acc[k] = 0);
  sessionsInPeriod(period).forEach((sess) => sess.entries.forEach((en) => {
    const ex = exById(en.exerciseId);
    if (!ex) return;
    const nSets = en.sets.filter((s) => s.done && (Number(s.reps) > 0 || Number(s.weight) > 0)).length;
    if (!nSets) return;
    const mm = musclesForExercise(ex);
    for (const mk in mm) acc[mk] += mm[mk] * nSets;
  }));
  return acc;
}

function heatColor(t) {
  t = Math.max(0, Math.min(1, t));
  const stops = [[0, [227, 232, 239]], [0.2, [255, 214, 90]], [0.5, [255, 140, 60]], [0.8, [240, 70, 55]], [1, [214, 40, 40]]];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const a = stops[i - 1], b = stops[i], f = (t - a[0]) / ((b[0] - a[0]) || 1);
      const c = [0, 1, 2].map((j) => Math.round(a[1][j] + (b[1][j] - a[1][j]) * f));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
  }
  return "rgb(214,40,40)";
}

var SLUG_TO_KEY = {
  CHEST: "pectoraux", OBLIQUES: "abdos", ABS: "abdos", BICEPS: "biceps", TRICEPS: "triceps",
  FRONT_DELTOIDS: "epaules", BACK_DELTOIDS: "epaules", QUADRICEPS: "quadriceps",
  CALVES: "mollets", LEFT_SOLEUS: "mollets", RIGHT_SOLEUS: "mollets", FOREARM: "avantbras",
  TRAPEZIUS: "trapezes", UPPER_BACK: "dorsaux", LOWER_BACK: "lombaires", GLUTEAL: "fessiers",
  HAMSTRING: "ischios", ABDUCTORS: "fessiers", ABDUCTOR: "fessiers",
};
function polysToSvg(list) {
  return list.map((o) => {
    const key = SLUG_TO_KEY[o.m];
    const cls = key ? "m" : "body";
    const attr = key ? ` data-m="${key}"` : "";
    return o.polys.map((p) => {
      let pts = "";
      for (let i = 0; i < p.length; i += 2) pts += p[i] + "," + p[i + 1] + " ";
      return `<polygon class="${cls}"${attr} points="${pts.trim()}"/>`;
    }).join("");
  }).join("");
}
function buildBodySvg() {
  const D = window.BODY_DATA;
  if (!D) return `<p class="small muted" style="text-align:center">Modèle indisponible.</p>`;
  return `
    <div class="body-cols">
      <div class="body-col">
        <svg class="bodymap" viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">${polysToSvg(D.front)}</svg>
        <div class="body-lbl2">Face</div>
      </div>
      <div class="body-col">
        <svg class="bodymap" viewBox="0 0 100 220" xmlns="http://www.w3.org/2000/svg">${polysToSvg(D.back)}</svg>
        <div class="body-lbl2">Dos</div>
      </div>
    </div>`;
}
function renderMuscleMap(el) {
  const ranges = [["seance", "Séance"], ["semaine", "Semaine"], ["7j", "7 jours"]];
  if (!state.muscleRange) state.muscleRange = "seance";
  const acc = muscleActivation(state.muscleRange);
  const max = Math.max(0, ...MUSCLE_KEYS.map((k) => acc[k]));
  const hasData = max > 0;
  const top = MUSCLE_KEYS.map((k) => ({ k, v: acc[k] })).filter((x) => x.v > 0).sort((a, b) => b.v - a.v);

  el.innerHTML = `
    <div class="segmented">${ranges.map(([v, l]) => `<button class="seg ${state.muscleRange === v ? "on" : ""}" data-range="${v}">${l}</button>`).join("")}</div>
    <div class="card">
      <div class="body-wrap">${buildBodySvg()}</div>
      ${hasData
        ? `<div class="heat-legend"><span>peu</span><i class="heat-bar"></i><span>beaucoup</span></div>`
        : `<p class="small muted" style="text-align:center;margin:6px 0 0">Aucune série sur cette période.</p>`}
    </div>
    ${top.length ? `<div class="card"><div class="section-title" style="margin-top:0">Muscles les plus sollicités</div>
      ${top.map((t) => `<div class="level-row"><span>${MUSCLE_LABELS[t.k]}</span><span class="muted">${Math.round(t.v / max * 100)} %</span></div>`).join("")}</div>` : ""}
    <p class="tiny muted" style="text-align:center">Activation approximative (primaire/secondaire selon l'exercice).<br>Modèle : react-body-highlighter (MIT).</p>
  `;

  MUSCLE_KEYS.forEach((k) => {
    const col = heatColor(hasData ? acc[k] / max : 0);
    el.querySelectorAll(`[data-m="${k}"]`).forEach((node) => { node.style.fill = col; });
  });
  el.querySelectorAll("[data-range]").forEach((b) => b.onclick = () => { state.muscleRange = b.dataset.range; render(); });
  el.querySelectorAll("[data-m]").forEach((node) => node.onclick = () => {
    const k = node.dataset.m, pct = hasData ? Math.round(acc[k] / max * 100) : 0;
    toast(`${MUSCLE_LABELS[k]} : ${pct} %`);
  });
}

/* ============================================================
   VUE : Réglages / sauvegarde
   ============================================================ */
function renderReglages() {
  const el = document.getElementById("view-reglages");
  el.innerHTML = `
    <button class="btn btn-block nav-card" id="goModeles">🗂️ Mes modèles de séances & minuteurs<span class="chev">›</span></button>
    <button class="btn btn-block nav-card" id="goExos">📋 Mes exercices<span class="chev">›</span></button>
    <div class="spacer"></div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Minuteur de repos</div>
      <div class="field"><label>Durée par défaut (secondes) — 0 pour désactiver</label>
        <input type="number" id="restInput" inputmode="numeric" value="${state.settings.rest}" />
      </div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Sons de performance</div>
      <label class="switch-row">
        <span>Sons en séance (record 🏆 / moins bien 👎)</span>
        <input type="checkbox" id="soundToggle" ${state.settings.sounds === false ? "" : "checked"} />
      </label>
      <button class="btn btn-sm" id="testSounds" style="margin-top:6px">🔊 Tester les sons</button>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Sauvegarde des données</div>
      <p class="small muted">Tes données sont stockées uniquement sur ce téléphone. Exporte un fichier de sauvegarde de temps en temps (surtout avant de changer de tél).</p>
      <div class="row" style="margin-bottom:8px">
        <button class="btn" id="exportBtn">⬆︎ Exporter</button>
        <button class="btn" id="importBtn">⬇︎ Importer</button>
      </div>
      <input type="file" id="importFile" accept="application/json,.json" class="hidden" />
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Statistiques</div>
      <div class="stat-row">
        <div class="stat"><div class="v">${state.sessions.length}</div><div class="l">séances</div></div>
        <div class="stat"><div class="v">${state.programs.length}</div><div class="l">modèles</div></div>
        <div class="stat"><div class="v">${state.exercises.length}</div><div class="l">exercices</div></div>
      </div>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Zone de danger</div>
      <button class="btn btn-danger btn-block" id="wipeBtn">Tout effacer</button>
    </div>
    <p class="tiny muted" style="text-align:center">Carnet de Muscu · fonctionne hors-ligne</p>
    <div class="spacer"></div>
  `;
  document.getElementById("goModeles").onclick = () => switchView("modeles");
  document.getElementById("goExos").onclick = () => switchView("exercices");
  document.getElementById("soundToggle").onchange = (e) => {
    state.settings.sounds = e.target.checked;
    save(STORE.settings, state.settings);
    if (e.target.checked) { ensureAudio(); playBetter(); }
  };
  document.getElementById("testSounds").onclick = () => {
    ensureAudio();
    playPR();
    setTimeout(playBetter, 1300);
    setTimeout(playWorse, 2100);
    toast("🏆 record · 👍 mieux · 👎 moins bien");
  };
  const restInput = document.getElementById("restInput");
  restInput.onchange = () => {
    state.settings.rest = Math.max(0, parseInt(restInput.value) || 0);
    save(STORE.settings, state.settings);
    toast("Réglage enregistré");
  };
  document.getElementById("exportBtn").onclick = exportData;
  document.getElementById("importBtn").onclick = () => document.getElementById("importFile").click();
  document.getElementById("importFile").onchange = importData;
  document.getElementById("wipeBtn").onclick = () => {
    if (confirm("Effacer TOUTES les données (séances, exercices, modèles, réglages) ? Irréversible.")) {
      if (confirm("Vraiment tout supprimer ?")) {
        Object.values(STORE).forEach((k) => localStorage.removeItem(k));
        location.reload();
      }
    }
  };
}

function exportData() {
  const data = {
    app: "carnet-muscu", version: 3, exportedAt: new Date().toISOString(),
    exercises: state.exercises, sessions: state.sessions, programs: state.programs,
    measures: state.measures, settings: state.settings,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `carnet-muscu-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  toast("Sauvegarde exportée");
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!data.exercises || !data.sessions) throw new Error("format");
      if (!confirm("Remplacer les données actuelles par cette sauvegarde ?")) return;
      state.exercises = data.exercises;
      state.sessions = data.sessions;
      if (data.programs) state.programs = data.programs;
      if (data.measures) state.measures = data.measures;
      if (data.settings) state.settings = data.settings;
      save(STORE.ex, state.exercises);
      save(STORE.sessions, state.sessions);
      save(STORE.programs, state.programs);
      save(STORE.measures, state.measures);
      save(STORE.settings, state.settings);
      toast("Données importées ✓");
      render();
    } catch (err) { toast("Fichier invalide"); }
  };
  reader.readAsText(file);
  e.target.value = "";
}

/* ============================================================
   Minuteur de repos (entre les séries)
   ============================================================ */
let restTimer = null, restEnd = 0;
function startRest(seconds) {
  restEnd = Date.now() + seconds * 1000;
  document.getElementById("restBar").classList.remove("hidden");
  tickRest();
  clearInterval(restTimer);
  restTimer = setInterval(tickRest, 250);
}
function tickRest() {
  const left = Math.max(0, Math.round((restEnd - Date.now()) / 1000));
  document.getElementById("restTime").textContent = mmss(left);
  if (left <= 0) {
    stopRest();
    tone(880, 0.4, 0.3);
    toast("Repos terminé 💥");
  }
}
function stopRest() {
  clearInterval(restTimer); restTimer = null;
  document.getElementById("restBar").classList.add("hidden");
}
document.getElementById("restStop").onclick = stopRest;
document.getElementById("restAdd").onclick = () => { restEnd += 30000; tickRest(); };

/* ============================================================
   Installation PWA
   ============================================================ */
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installBtn").classList.remove("hidden");
});
document.getElementById("installBtn").onclick = async () => {
  if (!deferredPrompt) { toast("Menu Chrome ⋮ → « Ajouter à l'écran d'accueil »"); return; }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  document.getElementById("installBtn").classList.add("hidden");
};
window.addEventListener("appinstalled", () => {
  document.getElementById("installBtn").classList.add("hidden");
  toast("Appli installée 🎉");
});

/* Service worker (mode hors-ligne) */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

/* ============================================================
   Démarrage
   ============================================================ */
switchView("seance");
ensureWakeLock();
