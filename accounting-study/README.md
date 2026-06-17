# Accounting Study Hub

A self-contained, multi-page study site for a **Management & Cost Accounting** course.
Built **entirely from the course materials** (lecture notes on managerial basics, contribution format,
job-order costing, service-department allocation and relevant costs, plus all the problem sets) —
no external content, no frameworks, no build step.

Same engine as the sibling `erp-study/` site, with a distinct emerald theme and **namespaced
`localStorage` keys** (`acc-*`) so the two sites never clash on the shared `beratcano.github.io` origin.

```
accounting-study/
├── index.html                       # Home: dashboard, course map, progress tracker
├── pages/
│   ├── 01-intro-managerial.html     # Managerial vs financial, company types, the 3 inventories
│   ├── 02-cost-classification.html  # Product/period, DM/DL/MOH, prime/conversion + 2 solved drills
│   ├── 03-cost-of-goods.html        # COGM schedule & income statement (Howell worked in full)
│   ├── 04-contribution-format.html  # Variable costing income statement, contribution margin
│   ├── 05-job-order-costing.html    # 5 accounts, 9 journal entries, FOH Control, overhead variance
│   ├── 06-service-allocation.html   # Direct & step-down methods (Collins worked in full)
│   ├── 07-relevant-costs.html       # 5-step process, relevant vs sunk, opportunity cost
│   ├── 08-decision-making.html      # Special order, make-or-buy, constraints, TOC, replacement
│   ├── 09-practice-problems.html    # All sets solved: COGM, contribution, job-order, allocation
│   ├── 10-cheatsheets.html          # Formulas, decision rules, glossary, mnemonics
│   └── 11-exam-practice.html        # Interactive 70+ question quiz
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

- All worked numeric answers were recomputed and verified — COGM problems (Howell 645/50, Medi 1,905/30,
  Mandelo 152,000/31,000), contribution format (Vega 55%, Atlas 45% / $22.50), job-order (Almeda underapplied 4,000,
  Cavitt Job 86 = 16,880, Pineapple overapplied 17,100) and service allocation (Lisa Lewis $3.75 / $3.50 per MH).
- Cost-classification answers follow the product-vs-period definitions taught in the Intro chapter.
- Chapter order follows the cost flow: classify → report (COGM/contribution) → accumulate (job-order/allocation) → decide (relevant costs).
