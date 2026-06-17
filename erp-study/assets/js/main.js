/* ============================================================
   ERP Study Hub — shared site script
   Injects nav + footer, builds TOC, theme toggle, progress.
   ============================================================ */
(function () {
  "use strict";

  // Single source of truth for site structure & order.
  // `path` is relative to the site root (where index.html lives).
  const PAGES = [
    { id: "home",       path: "index.html",                 nav: "Home",            short: "Home" },
    { id: "foundations",path: "pages/01-foundations.html",  nav: "1 · Foundations", short: "Foundations" },
    { id: "processes",  path: "pages/02-processes-bpmn.html",nav: "2 · Processes",  short: "Processes & BPMN" },
    { id: "masterdata", path: "pages/03-master-data.html",  nav: "3 · Master Data", short: "Master Data" },
    { id: "finance",    path: "pages/04-finance-fico.html", nav: "4 · FI/CO",       short: "Finance (FI/CO)" },
    { id: "hr",         path: "pages/05-hr-hcm.html",       nav: "5 · HCM",         short: "HR & Payroll" },
    { id: "mm",         path: "pages/06-supply-chain-mm.html",nav: "6 · MM",        short: "Supply Chain (MM)" },
    { id: "ppsd",       path: "pages/07-pp-sd.html",        nav: "7 · PP/SD",       short: "Production & Sales" },
    { id: "impl",       path: "pages/08-implementation.html",nav: "8 · Implement",  short: "Implementation" },
    { id: "successfail",path: "pages/09-success-failure.html",nav: "9 · Success/Fail",short: "Success & Failure" },
    { id: "cheatsheets",path: "pages/10-cheatsheets.html",  nav: "Cheat Sheets",    short: "Cheat Sheets" },
    { id: "exam",       path: "pages/11-exam-practice.html",nav: "Exam Practice",   short: "Exam Practice" }
  ];
  // Pages that count toward the "studied" progress meter (the 9 study chapters).
  const STUDY_IDS = ["foundations","processes","masterdata","finance","hr","mm","ppsd","impl","successfail"];

  const root = document.body.getAttribute("data-root") || "";   // "" at root, "../" inside /pages
  const pageId = document.body.getAttribute("data-page") || "home";
  const LS = window.localStorage;

  /* ---------- Theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    const btn = document.getElementById("theme-btn");
    if (btn) btn.textContent = t === "dark" ? "☀" : "☾";
  }
  const savedTheme = LS.getItem("erp-theme") || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  applyTheme(savedTheme);

  /* ---------- Build top nav ---------- */
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
          <span class="logo">ERP</span>
          <span class="full">Study Hub</span>
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
      LS.setItem("erp-theme", next); applyTheme(next);
    });
    const mb = document.getElementById("menu-btn");
    mb && mb.addEventListener("click", () => document.getElementById("nav-links").classList.toggle("open"));
  }

  /* ---------- Build footer ---------- */
  function buildFooter() {
    const f = document.createElement("footer");
    f.className = "footer";
    f.innerHTML = `<div class="footer-inner">
      <span>ERP Study Hub · built entirely from the course PDFs &amp; readings.</span>
      <span>Good luck on the exam 🍀 · <a href="${root}pages/11-exam-practice.html">Test yourself →</a></span>
    </div>`;
    const mount = document.getElementById("site-footer");
    if (mount) mount.replaceWith(f); else document.body.appendChild(f);
  }

  /* ---------- Auto TOC + scrollspy ---------- */
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

  /* ---------- Prev / Next pager ---------- */
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

  /* ---------- Progress tracking ---------- */
  function getDone(){ try { return JSON.parse(LS.getItem("erp-progress") || "{}"); } catch(e){ return {}; } }
  function setDone(o){ LS.setItem("erp-progress", JSON.stringify(o)); }

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

  // Exposed so index.html can render the dashboard.
  window.ERP = {
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
