# Accounting Study Hub

A self-contained, multi-page study site for a **Management & Cost Accounting** course.
Built **entirely from the course materials** (the Intro-to-Managerial-Accounting and Relevant-Costs
chapters plus the five problem sets) — no external content, no frameworks, no build step.

Same engine as the sibling `erp-study/` site, with a distinct emerald theme and **namespaced
`localStorage` keys** (`acc-*`) so the two sites never clash on the shared `beratcano.github.io` origin.

```
accounting-study/
├── index.html                       # Home: dashboard, course map, progress tracker
├── pages/
│   ├── 01-intro-managerial.html     # Managerial vs financial, company types, the 3 inventories
│   ├── 02-cost-classification.html  # Product/period, DM/DL/MOH, prime/conversion + 2 solved drills
│   ├── 03-cost-of-goods.html        # COGM schedule & income statement (Howell worked in full)
│   ├── 04-relevant-costs.html       # 5-step process, relevant vs sunk, opportunity cost
│   ├── 05-decision-making.html      # Special order, make-or-buy, constraints, TOC, replacement
│   ├── 06-practice-problems.html    # Medi, Howell & Mandelo solved step-by-step
│   ├── 07-cheatsheets.html          # Formulas, decision rules, glossary, mnemonics
│   └── 08-exam-practice.html        # Interactive 45+ question quiz
└── assets/
    ├── css/style.css                # Emerald theme (light/dark)
    └── js/{main.js, quiz.js, quiz-data.js}
```

## Live URL

Once pushed to the `beratcano.github.io` repo it serves at
**`https://beratcano.github.io/accounting-study/`**.

Add a link from your homepage, e.g. `<a href="/accounting-study/">Accounting Study Hub</a>`.

## Run locally

```bash
cd accounting-study
python3 -m http.server 8000
# open http://localhost:8000
```

## Notes

- All worked numeric answers were recomputed and verified
  (e.g. Howell COGM 645 / op. income 50; Medi 1,905 / 30; Mandelo 152,000 / 31,000, in the problems' own units).
- Cost-classification answers follow the product-vs-period definitions taught in the Intro chapter.
