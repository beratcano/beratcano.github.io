/* ============================================================
   Accounting Study Hub — shared site script
   Injects nav + footer, builds TOC, theme toggle, progress.
   Storage keys are namespaced "acc-" so it never collides with
   the ERP study site on the same github.io origin.
   ============================================================ */
(function () {
  "use strict";

  const PAGES = [
    { id: "home",        path: "index.html",                    nav: "Home",            short: "Home" },
    { id: "intro",       path: "pages/01-intro-managerial.html",nav: "1 · Intro",       short: "Intro to Managerial" },
    { id: "classification",path:"pages/02-cost-classification.html",nav:"2 · Cost Terms",short:"Cost Classification" },
    { id: "cogm",        path: "pages/03-cost-of-goods.html",   nav: "3 · COGM",        short: "Cost of Goods Mfd" },
    { id: "relevant",    path: "pages/04-relevant-costs.html",  nav: "4 · Relevant",    short: "Relevant Costs" },
    { id: "decisions",   path: "pages/05-decision-making.html", nav: "5 · Decisions",   short: "Decision Making" },
    { id: "practice",    path: "pages/06-practice-problems.html",nav:"Practice",        short: "Practice Problems" },
    { id: "cheatsheets", path: "pages/07-cheatsheets.html",     nav: "Cheat Sheets",    short: "Cheat Sheets" },
    { id: "exam",        path: "pages/08-exam-practice.html",   nav: "Exam Practice",   short: "Exam Practice" }
  ];
  const STUDY_IDS = ["intro","classification","cogm","relevant","decisions","practice"];

  const root = document.body.getAttribute("data-root") || "";
  const pageId = document.body.getAttribute("data-page") || "home";
  const LS = window.localStorage;

  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = t === "dark" ? "☀" : "☾";
  }
  const savedTheme = LS.getItem("acc-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  function buildHeader() {
    const links = PAGES.map(p => {
      const href = root + p.path;
      const active = p.id === pageId ? " class=\"active\"" : "";
      return `<a href="${href}"${active}>${p.nav}</a>`;
    }).join("");

    const header = document.createElement("header");
    header.className = "nav";
    header.innerHTML = `
      <div class="nav-inner">
        <a class="brand" href="${root}index.html">
          <span class="logo">A+</span>
          <span class="full">Accounting Study Hub</span>
        </a>
        <button class="icon-btn menu-toggle" id="menu-btn" aria-label="Menu">☰</button>
        <nav class="nav-links" id="nav-links">${links}</nav>
        <div class="nav-tools">
          <button class="icon-btn" id="theme-btn" title="Toggle light/dark" aria-label="Toggle theme">☾</button>
        </div>
      </div>`;
    const mount = document.getElementById("site-header");
    if (mount) mount.replaceWith(header); else document.body.prepend(header);

    applyTheme(document.documentElement.getAttribute("data-theme"));
    document.getElementById("theme-btn").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme");
      const next = cur === "dark" ? "light" : "dark";
      LS.setItem("acc-theme", next); applyTheme(next);
    });
    const mb = document.getElementById("menu-btn");
    mb && mb.addEventListener("click", () => document.getElementById("nav-links").classList.toggle("open"));
  }

  function buildFooter() {
    const f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML = `<div class="footer-inner">
      <span>Accounting Study Hub · built entirely from the course slides, reading &amp; problem sets.</span>
      <span>Good luck on the exam 🍀 · <a href="${root}pages/08-exam-practice.html">Test yourself →</a></span>
    </div>`;
    const mount = document.getElementById("site-footer");
    if (mount) mount.replaceWith(f); else document.body.appendChild(f);
  }

  function slugify(s){return s.toLowerCase().replace(/[^\w\s-]/g,"").trim().replace(/\s+/g,"-").slice(0,50);}
  function buildTOC() {
    const tocMount = document.getElementById("toc");
    const main = document.querySelector("main");
    if (!tocMount || !main) return;
    const heads = Array.from(main.querySelectorAll("h2"));
    if (!heads.length) { tocMount.remove(); document.querySelector(".page").classList.add("no-toc"); return; }
    const seen = {};
    const items = heads.map(h => {
      let id = h.id || slugify(h.textContent);
      if (seen[id]) { id = id + "-" + (++seen[id]); } else { seen[id] = 1; }
      h.id = id;
      return `<a href="#${id}">${h.textContent}</a>`;
    }).join("");
    tocMount.innerHTML = `<h4>On this page</h4>${items}`;

    const tocLinks = Array.from(tocMount.querySelectorAll("a"));
    const map = new Map(tocLinks.map(a => [a.getAttribute("href").slice(1), a]));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(a => a.classList.remove("active"));
          const a = map.get(e.target.id); if (a) a.classList.add("active");
        }
      });
    }, { rootMargin: "-80px 0px -70% 0px", threshold: 0 });
    heads.forEach(h => obs.observe(h));
  }

  function buildPager() {
    const mount = document.getElementById("pager");
    if (!mount) return;
    const idx = PAGES.findIndex(p => p.id === pageId);
    if (idx === -1) return;
    const prev = PAGES[idx - 1], next = PAGES[idx + 1];
    const prevHTML = prev
      ? `<a href="${root}${prev.path}"><div class="dir">← Previous</div><div class="ttl">${prev.short}</div></a>`
      : `<a class="disabled"><div class="dir">← Previous</div><div class="ttl">—</div></a>`;
    const nextHTML = next
      ? `<a class="next" href="${root}${next.path}"><div class="dir">Next →</div><div class="ttl">${next.short}</div></a>`
      : `<a class="next disabled"><div class="dir">Next →</div><div class="ttl">—</div></a>`;
    mount.className = "pager";
    mount.innerHTML = prevHTML + nextHTML;
  }

  function getDone(){ try { return JSON.parse(LS.getItem("acc-progress") || "{}"); } catch(e){ return {}; } }
  function setDone(o){ LS.setItem("acc-progress", JSON.stringify(o)); }

  function buildStudyToggle() {
    const mount = document.getElementById("study-toggle");
    if (!mount || !STUDY_IDS.includes(pageId)) { if (mount) mount.remove(); return; }
    const render = () => {
      const done = getDone()[pageId];
      mount.innerHTML = `<button class="btn ${done ? "ok" : "ghost"}" id="mark-btn">
        ${done ? "✓ Marked as studied" : "Mark this chapter as studied"}</button>
        <span class="muted small">Saved in your browser only.</span>`;
      document.getElementById("mark-btn").addEventListener("click", () => {
        const d = getDone(); d[pageId] = !d[pageId]; setDone(d); render();
      });
    };
    render();
  }

  window.ACC = {
    PAGES, STUDY_IDS, root,
    getProgress: getDone,
    resetProgress: () => { setDone({}); }
  };

  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    buildFooter();
    buildTOC();
    buildPager();
    buildStudyToggle();
    if (typeof window.onPageReady === "function") window.onPageReady();
  });
})();
