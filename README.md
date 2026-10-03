# DoAide Budget

**Free Personal Budget & Expense Tracker** — [budget.doaide.com](https://budget.doaide.com)

Track income, expenses, set budgets, split bills, calculate EMIs, set savings goals, and more. No login required. All data stored locally in your browser.

## Features

- **Dashboard** — Overview of income, expenses, balance with spending breakdown pie chart
- **Transactions** — Add/edit/delete income & expenses with categories, notes, and recurring support
- **Budget Manager** — Set monthly budget limits per category with progress tracking
- **Analytics** — Daily/monthly spending charts and 6-month trends (powered by Recharts)
- **Bill Splitter** — Split bills with tip calculation, share results
- **EMI Calculator** — Loan EMI with amortization schedule (Indian banks, INR)
- **Savings Goals** — Set targets with progress tracking and deadlines
- **Currency Converter** — INR to USD/EUR/GBP with live exchange rates
- **Export** — Download transactions as CSV or PDF report
- **Dark/Light Mode** — Toggle between themes

## Tech Stack

- React 18 + Vite
- Recharts for interactive charts
- jsPDF for PDF export
- localStorage for data persistence
- No backend required

## Development

```bash
npm install
npm run dev
```

Runs at `http://172.18.0.1:3065`

## Deployment

```bash
npm run build
npm run preview
```

### systemd Service

```bash
cp doaide-budget.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now doaide-budget
```

## License

MIT
