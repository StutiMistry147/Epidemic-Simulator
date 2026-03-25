# 🦠 Epidemic Simulator

## Overview

A full-stack epidemic modeling platform that combines **stochastic agent-based simulation** with **deterministic SEIR differential equation models** to analyze and predict disease spread.

The system dynamically selects the appropriate modeling approach based on population size:

* **Agent-Based Simulation** for small populations (< 5,000)
* **SEIR ODE Model** for large populations (≥ 5,000)

It also supports configurable **network topologies**, integrates **CDC flu data**, and generates **AI-driven epidemiological insights**.

---

## Key Features

* Hybrid simulation engine (Agent-based + ODE)
* Multi-threaded agent simulation using `pthreads`
* Network-based contact modeling (random + small-world)
* Real-time React dashboard with epidemic curves
* CDC data correlation using Pearson coefficient
* AI-generated outbreak analysis (Claude API)

---

## Sample Output

### Dashboard (S/E/I/R Curves)

<img width="1919" height="1079" alt="image" src="https://github.com/user-attachments/assets/6d28475b-3f34-41d8-af2c-25d60be6a981" />

### AI-Generated Epidemiological Report

<img width="451" height="530" alt="image" src="https://github.com/user-attachments/assets/9f39e8db-3263-4782-bed3-a6d8b51dd96e" />

---

### Rationale

* **Agent-Based Model**: Captures stochastic interactions but scales poorly
* **ODE Model**: Efficient for large populations but lacks individual variability

This threshold balances **accuracy vs performance**.

---

## System Architecture

### Simulation Engine (C++)

* SEIR ODE model using RK4 integration
* Agent-based simulation with configurable networks
* Thread pool for parallel agent updates
* Outputs CSV time-series data

---

### Backend API (Python / FastAPI)

* Runs simulation engine via subprocess
* Parses CSV outputs
* Performs statistical analysis (Pearson correlation)
* Generates AI reports using Claude API

---

### Frontend Dashboard (React)

* Interactive parameter controls (β, γ, population, etc.)
* Real-time epidemic curve visualization
* Displays statistical metrics + AI insights

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

## Future Improvements

* Vaccination & immunity modeling
* Mobility + spatial spread
* Parameter calibration (MLE/Bayesian)
* GPU acceleration
* Multi-disease simulation
If you want next step:
I can turn this into **resume bullets + recruiter pitch** (this project is actually strong enough to carry interviews).
