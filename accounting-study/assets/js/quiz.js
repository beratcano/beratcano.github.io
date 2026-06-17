/* ============================================================
   Accounting Study Hub — quiz engine
   Renders QUIZ_BANK with topic filtering, scoring & review.
   ============================================================ */
(function () {
  "use strict";
  var ALL = window.QUIZ_BANK || [];
  var topics = [];
  (function () { var seen = {}; ALL.forEach(function (q) { if (!seen[q.topic]) { seen[q.topic] = 1; topics.push(q.topic); } }); })();

  var state = { pool: [], i: 0, score: 0, wrong: [], answered: false, shuffle: true, topic: "All" };
  var el = {};

  function $(id) { return document.getElementById(id); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function buildChips() {
    var row = $("topic-chips");
    var list = ["All"].concat(topics);
    row.innerHTML = list.map(function (t) {
      var count = t === "All" ? ALL.length : ALL.filter(function (q) { return q.topic === t; }).length;
      return '<button class="chip' + (t === state.topic ? " active" : "") + '" data-topic="' + t + '">' + t + ' <span class="muted">(' + count + ')</span></button>';
    }).join("");
    Array.prototype.forEach.call(row.querySelectorAll(".chip"), function (c) {
      c.addEventListener("click", function () { state.topic = c.getAttribute("data-topic"); buildChips(); });
    });
  }

  function start(pool) {
    state.pool = state.shuffle ? shuffle(pool) : pool.slice();
    state.i = 0; state.score = 0; state.wrong = []; state.answered = false;
    $("quiz-start").style.display = "none";
    $("quiz-results").style.display = "none";
    $("quiz-live").style.display = "";
    renderQ();
  }

  function renderQ() {
    state.answered = false;
    var q = state.pool[state.i];
    var optionOrder = state.shuffle ? shuffle(q.options.map(function (_, idx) { return idx; })) : q.options.map(function (_, idx) { return idx; });
    el.meta.innerHTML = '<span>Question <strong>' + (state.i + 1) + '</strong> / ' + state.pool.length +
                        ' &nbsp;·&nbsp; <span class="tag">' + q.topic + '</span></span>' +
                        '<span id="q-score">Score: <strong>' + state.score + '</strong></span>';
    el.q.textContent = q.q;
    el.opts.innerHTML = "";
    optionOrder.forEach(function (origIdx, displayIdx) {
      var b = document.createElement("button");
      b.className = "opt";
      b.innerHTML = '<span class="mark">' + String.fromCharCode(65 + displayIdx) + '.</span> ' + q.options[origIdx];
      b.addEventListener("click", function () { choose(b, origIdx, q); });
      el.opts.appendChild(b);
    });
    el.explain.style.display = "none";
    el.explain.innerHTML = "";
    el.next.style.display = "none";
    el.progress.style.width = Math.round(state.i / state.pool.length * 100) + "%";
  }

  function choose(btn, origIdx, q) {
    if (state.answered) return;
    state.answered = true;
    var correct = origIdx === q.answer;
    var buttons = el.opts.querySelectorAll(".opt");
    Array.prototype.forEach.call(buttons, function (b) {
      b.classList.add("disabled");
      var label = b.textContent.trim().slice(3).trim();
      if (label === q.options[q.answer]) b.classList.add("correct");
    });
    if (correct) { state.score++; }
    else { btn.classList.add("wrong"); state.wrong.push(q); }
    el.explain.style.display = "";
    el.explain.innerHTML = (correct ? "✅ <strong>Correct.</strong> " : "❌ <strong>Not quite.</strong> ") + q.explain;
    var sc = document.getElementById("q-score"); if (sc) sc.innerHTML = "Score: <strong>" + state.score + "</strong>";
    el.next.style.display = "";
    el.next.textContent = state.i + 1 < state.pool.length ? "Next question →" : "See results →";
    el.next.focus();
  }

  function next() {
    if (!state.answered) return;
    state.i++;
    if (state.i < state.pool.length) renderQ(); else results();
  }

  function results() {
    $("quiz-live").style.display = "none";
    $("quiz-results").style.display = "";
    var total = state.pool.length;
    var pct = Math.round(state.score / total * 100);
    var msg = pct >= 90 ? "Outstanding — you're exam-ready. 🎯" :
              pct >= 75 ? "Strong. Review the few you missed and you're set. 💪" :
              pct >= 50 ? "Decent base — revisit the weak chapters, then retry. 📚" :
                          "Early days — re-read the chapters, then come back. You've got this. 🌱";
    var best = 0; try { best = parseInt(localStorage.getItem("acc-quiz-best") || "0", 10); } catch (e) {}
    if (pct > best) { try { localStorage.setItem("acc-quiz-best", String(pct)); } catch (e) {} best = pct; }

    var wrongHTML = state.wrong.length
      ? '<h3>Review your misses (' + state.wrong.length + ')</h3>' + state.wrong.map(function (q) {
          return '<details class="q"><summary>' + q.q + '</summary><div class="answer"><strong>Answer:</strong> ' +
                 q.options[q.answer] + '<br><span class="muted">' + q.explain + '</span></div></details>';
        }).join("")
      : '<p class="callout tip"><span class="label">Perfect run</span>No wrong answers — nice.</p>';

    $("quiz-results").innerHTML =
      '<div class="quiz-card center">' +
        '<div class="scoreboard">' + state.score + ' / ' + total + '</div>' +
        '<p class="lede" style="margin:.2em auto;">' + pct + '%</p>' +
        '<p>' + msg + '</p>' +
        '<p class="muted small">Personal best: ' + best + '%</p>' +
        '<div class="btn-row" style="justify-content:center;">' +
          '<button class="btn" id="retry-all">↻ New set</button>' +
          (state.wrong.length ? '<button class="btn ghost" id="retry-wrong">Retry my ' + state.wrong.length + ' misses</button>' : '') +
          '<button class="btn ghost" id="back-topics">Choose a topic</button>' +
        '</div>' +
      '</div>' +
      '<div style="margin-top:18px;">' + wrongHTML + '</div>';

    $("retry-all").addEventListener("click", function () { start(currentPool()); });
    var rw = $("retry-wrong"); if (rw) rw.addEventListener("click", function () { var w = state.wrong.slice(); start(w); });
    $("back-topics").addEventListener("click", function () {
      $("quiz-results").style.display = "none"; $("quiz-start").style.display = "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function currentPool() {
    return state.topic === "All" ? ALL.slice() : ALL.filter(function (q) { return q.topic === state.topic; });
  }

  window.onPageReady = function () {
    el = {
      meta: $("q-meta"), q: $("q-text"), opts: $("q-options"),
      explain: $("q-explain"), next: $("q-next"), progress: $("q-progress")
    };
    buildChips();
    var best = 0; try { best = parseInt(localStorage.getItem("acc-quiz-best") || "0", 10); } catch (e) {}
    if (best > 0) $("best-note").textContent = "Your personal best so far: " + best + "%.";

    $("shuffle-toggle").addEventListener("change", function (e) { state.shuffle = e.target.checked; });
    $("begin-btn").addEventListener("click", function () { start(currentPool()); });
    el.next.addEventListener("click", next);
    document.addEventListener("keydown", function (e) {
      if ($("quiz-live").style.display === "none") return;
      if ((e.key === "Enter" || e.key === " ") && state.answered) { e.preventDefault(); next(); }
    });
  };
})();
