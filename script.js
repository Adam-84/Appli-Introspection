// ── Constants ───────────────────────────────────────────────────────────────
// Must match the flying card CSS dimensions.
const CARD_W = 320;
const CARD_H = 460;

// ── State ───────────────────────────────────────────────────────────────────
let remainingQuestions = [];
let totalQuestions     = 0;
let isAnimating        = false;
let isOpen             = false;
let flyingCard         = null;
let overlayEl          = null;
let ongletActif        = localStorage.getItem("onglet-actif") || "general";

// ── DOM references ──────────────────────────────────────────────────────────
const deckStack  = document.getElementById("deckStack");
const progressEl = document.getElementById("progressText");
const resetBtn   = document.getElementById("resetBtn");

// Questions loaded from questions.js as QUESTIONS global.

// ── Utilities ───────────────────────────────────────────────────────────────

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Actual rendered card size, accounting for CSS max-width / max-height clamps.
function effectiveCardSize() {
  return {
    w: Math.min(CARD_W, window.innerWidth - 32),
    h: Math.min(CARD_H, window.innerHeight - 80),
  };
}

// Flying card position: top/left anchored at viewport center, offset by tx/ty, scaled by s.
// At tx=0, ty=0, s=1 the card is exactly centered.
function applyFlyTransform(el, tx, ty, s) {
  el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(${s})`;
}

// ── Draw (unchanged logic) ──────────────────────────────────────────────────

function drawQuestion() {
  if (remainingQuestions.length === 0) return null;
  return remainingQuestions.pop();
}

function updateProgress() {
  const drawn = totalQuestions - remainingQuestions.length;
  progressEl.textContent = `${drawn}\u202f/\u202f${totalQuestions}`;
}

// ── Overlay ─────────────────────────────────────────────────────────────────

function createOverlay() {
  const el = document.createElement("div");
  el.className = "overlay";
  el.addEventListener("click", () => {
    if (!isAnimating && isOpen) closeCard();
  });
  document.body.appendChild(el);
  return el;
}

function showOverlay() {
  overlayEl.style.display = "block";
  overlayEl.style.opacity = "0";
  overlayEl.style.transition = "none";
  // Force reflow so the opacity:0 is painted before we transition.
  void overlayEl.offsetWidth;
  overlayEl.style.transition = "opacity 200ms ease";
  overlayEl.style.opacity = "1";
}

function hideOverlay() {
  overlayEl.style.transition = "opacity 200ms ease";
  overlayEl.style.opacity = "0";
  // Remove from layout after fade.
  setTimeout(() => { overlayEl.style.display = "none"; }, 210);
}

// ── Build flying card element ───────────────────────────────────────────────

function buildFlyingCard(question, drawnIndex) {
  const el = document.createElement("div");
  el.className = "flying-card";
  el.innerHTML = `
    <div class="card-scene">
      <div class="card-inner">
        <div class="card-back">
          <span class="back-logo">I</span>
        </div>
        <div class="card-front">
          <div class="card-front-header">
            <button class="card-close-btn" aria-label="Fermer la carte">&times;</button>
            <span class="card-badge">${drawnIndex}\u202f/\u202f${totalQuestions}</span>
          </div>
          <p class="card-question">${question}</p>
        </div>
      </div>
    </div>
  `;

  el.querySelector(".card-close-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    if (!isAnimating && isOpen) closeCard();
  });

  return el;
}

// ── Open animation ──────────────────────────────────────────────────────────

async function openCard() {
  if (isAnimating || isOpen || remainingQuestions.length === 0) return;
  isAnimating = true;

  // Draw question before animation so progress is accurate on the badge.
  const question = drawQuestion();
  if (!question) { isAnimating = false; return; }
  updateProgress();

  const topCard = deckStack.querySelector(".stack-card--top");
  const rect    = topCard.getBoundingClientRect();

  // Scale that makes the flying card appear exactly as big as the deck card.
  const { w: fw } = effectiveCardSize();
  const s0  = rect.width / fw;
  const tx0 = (rect.left + rect.width / 2) - window.innerWidth / 2;
  const ty0 = (rect.top  + rect.height / 2) - window.innerHeight / 2;

  // Build and inject flying card at deck-card position (no transition yet).
  const drawn = totalQuestions - remainingQuestions.length;
  flyingCard = buildFlyingCard(question, drawn);
  flyingCard.style.transition = "none";
  applyFlyTransform(flyingCard, tx0, ty0, s0);
  document.body.appendChild(flyingCard);

  // Hide original top card so the flying card replaces it visually.
  topCard.style.opacity = "0";
  topCard.style.pointerEvents = "none";

  // Fade in overlay.
  showOverlay();

  // Commit initial styles before animating.
  void flyingCard.offsetWidth;

  // ── Phase 1: Lift (150ms) ──────────────────────────────────────────────
  flyingCard.style.transition = "transform 150ms ease-out";
  applyFlyTransform(flyingCard, tx0, ty0 - 10, s0 * 1.05);
  await wait(160);

  // ── Phase 2: Fly to center + grow (350ms) ─────────────────────────────
  flyingCard.style.transition = "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)";
  applyFlyTransform(flyingCard, 0, 0, 1);
  await wait(360);

  // ── Phase 3: Flip back→front (400ms) ──────────────────────────────────
  const inner = flyingCard.querySelector(".card-inner");
  inner.style.transition = "transform 400ms ease";
  inner.classList.add("flipped");
  flyingCard.style.cursor = "default";
  await wait(410);

  isAnimating = false;
  isOpen = true;
}

// ── Close (instantaneous) ───────────────────────────────────────────────────

function closeCard() {
  if (!isOpen || !flyingCard || isAnimating) return;
  isOpen = false;

  const topCard = deckStack.querySelector(".stack-card--top");

  overlayEl.style.transition = "none";
  overlayEl.style.opacity    = "0";
  overlayEl.style.display    = "none";
  flyingCard.remove();
  flyingCard = null;

  if (remainingQuestions.length === 0) {
    deckStack.classList.add("empty");
    topCard.innerHTML = '<span class="empty-label">Paquet vide</span>';
    topCard.removeAttribute("tabindex");
    topCard.removeAttribute("role");
    topCard.removeAttribute("aria-label");
    topCard.style.opacity      = "1";
    topCard.style.pointerEvents = "";
  } else {
    topCard.style.opacity      = "1";
    topCard.style.pointerEvents = "";
  }
}

// ── Render stack ────────────────────────────────────────────────────────────

function renderStack() {
  deckStack.classList.remove("empty");
  deckStack.innerHTML = `
    <div class="stack-card stack-card--back2" aria-hidden="true"></div>
    <div class="stack-card stack-card--back1" aria-hidden="true"></div>
    <div class="stack-card stack-card--top"
         role="button"
         tabindex="0"
         aria-label="Piocher une carte">
      <span class="back-logo" aria-hidden="true">I</span>
    </div>
  `;

  const topCard = deckStack.querySelector(".stack-card--top");

  topCard.addEventListener("click", () => {
    if (!isAnimating && !isOpen) openCard();
  });

  topCard.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && !isAnimating && !isOpen) {
      e.preventDefault();
      openCard();
    }
  });
}

// ── Reset (unchanged logic) ─────────────────────────────────────────────────

function resetSession() {
  // Abort any in-progress animation cleanly.
  if (flyingCard) {
    flyingCard.remove();
    flyingCard = null;
  }
  overlayEl.style.display = "none";
  overlayEl.style.opacity = "0";
  isAnimating = false;
  isOpen = false;

  remainingQuestions = [...QUESTIONS[ongletActif]];
  shuffle(remainingQuestions);
  totalQuestions = remainingQuestions.length;
  renderStack();
  updateProgress();
}

// ── Global keyboard handler ─────────────────────────────────────────────────

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isOpen && !isAnimating) closeCard();
});

resetBtn.addEventListener("click", resetSession);

// ── Init ────────────────────────────────────────────────────────────────────
overlayEl = createOverlay();
resetSession();

// ── Tabs ─────────────────────────────────────────────────────────────────────

function applyActiveTab() {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    const active = btn.dataset.tab === ongletActif;
    btn.classList.toggle("tab-btn--active", active);
    btn.setAttribute("aria-selected", active);
  });
}

document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.dataset.tab === ongletActif) return;
    ongletActif = btn.dataset.tab;
    localStorage.setItem("onglet-actif", ongletActif);
    applyActiveTab();
    resetSession();
  });
});

applyActiveTab();

// ── Theme toggle ─────────────────────────────────────────────────────────────
const themeToggle = document.getElementById("themeToggle");

if (document.documentElement.classList.contains("dark")) {
  themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  themeToggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", isDark ? "dark" : "light");
});
