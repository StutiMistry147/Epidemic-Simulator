# Epidemic Simulator

## Overview

A full-stack epidemic modeling platform with a hybrid simulation engine, 
deterministic SEIR/RK4 for large populations, stochastic agent-based 
simulation across configurable network topologies for smaller ones. 
The engine is written in C++ with Pthreads parallelism; simulation output 
is validated against CDC 2022-23 flu surveillance data via Pearson 
correlation and analyzed through AI-generated epidemiological reports 
via the Claude API.

---

## How it works
The system selects its modeling approach based on population size:

- **< 5,000 agents** : stochastic agent-based simulation across 
  Watts-Strogatz small-world or random networks, parallelized with Pthreads
- **≥ 5,000** : deterministic SEIR model solved via RK4 integration

This threshold balances individual-level stochastic accuracy against 
computational performance.

## Sample Output

### Dashboard (S/E/I/R Curves)

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6d28475b-3f34-41d8-af2c-25d60be6a981" />

### AI-Generated Epidemiological Report

<img width="451" height="530" alt="image" src="https://github.com/user-attachments/assets/9f39e8db-3263-4782-bed3-a6d8b51dd96e" />

---

## Tech Stack

| Layer             | Technology                             |
| ----------------- | -------------------------------------- |
| Simulation Engine | C++17, pthreads, RK4                   |
| Backend           | Python, FastAPI                        |
| Frontend          | React 18, Vite, Tailwind CSS, Recharts |
| Data Analysis     | Pandas, SciPy, NumPy                   |
| AI Integration    | Claude API                             |

---

## Getting Started

### 1. Build Simulation Engine

```bash
cd engine
mkdir build && cd build
cmake ..
cmake --build . --config Release
```

### 2. Setup Backend

```bash
cd backend
python -m venv venv

venv\Scripts\activate       # Windows
# source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt

set ANTHROPIC_API_KEY=your-key-here
python main.py
```

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

### 4. Run

Open:
```
http://localhost:5173
```

## ⚠️ Known Limitations

* Agent-based simulation scales poorly beyond ~5,000 agents
* Contact modeling approximates real-world interactions
* Fixed incubation period (not dynamically modeled)
* No geographic or mobility modeling
* CDC comparison limited to a single season dataset
