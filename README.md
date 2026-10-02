# OS Nexus — Interactive Operating Systems Simulator

A polished, browser-based Operating Systems laboratory for visualizing classic OS algorithms.

## ✨ Modules

| Module | Algorithms / Concepts |
|---|---|
| CPU Scheduling | FCFS, SJF, Priority, Round Robin |
| Page Replacement | FIFO, LRU, Optimal |
| Disk Scheduling | FCFS, SSTF, SCAN, C-SCAN |
| Deadlock Avoidance | Banker's Algorithm, Need Matrix, Safe Sequence |

## 🚀 Run locally

No backend or database is required.

### Option 1 — Browser
Open `index.html` directly.

### Option 2 — VS Code
Open the folder in VS Code and use **Live Server**.

## 🧠 Features

- Responsive professional dashboard
- Dark / light theme with local preference
- Interactive algorithm tabs
- Demo data and clear/reset controls
- Input validation
- Gantt chart for CPU scheduling
- Frame-by-frame page replacement trace
- Disk head movement visualization
- Banker's Algorithm safety analysis
- JSON export for CPU and Banker's results
- Keyboard shortcut: `Ctrl/Cmd + K` focuses the first input
- 100% client-side — no API key or server required

## 📁 Structure

```text
OS_Simulator_Pro/
├── index.html
├── pages/
│   ├── cpu.html
│   ├── memory.html
│   ├── disk.html
│   └── deadlock.html
├── assets/
│   ├── css/style.css
│   └── js/
│       ├── app.js
│       ├── cpu.js
│       ├── memory.js
│       ├── disk.js
│       └── deadlock.js
└── README.md
```

## 🎓 Academic note

This is an **educational simulator**: it demonstrates Operating Systems algorithms in a web interface. It is not a real operating-system kernel and does not control the host computer's CPU, RAM, disk, or processes.

## 📌 Portfolio tip

For a GitHub portfolio, include screenshots/GIFs of each module, a short demo video, the algorithms used, and a section explaining what you learned.
