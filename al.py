# Epidemic-Simulator
## Overview
A full-stack epidemic modeling platform that combines stochastic agent-based simulation with deterministic SEIR differential equation models to analyse and predict disease spread.

The system dynamically selects the appropriate modeling approach based on population size:
- **Agent-Based Simulation** for small population (<5,000) to capture stochastic, individual-level interactions.
- **SEIR ODE Model** for large populations (≥5,000) to ensure computational efficiency and smooth epidemic curves.
The platform also supports configurable network topologies (Erdős–Rényi and Watts–Strogatz graphs), integrates real-world CDC flu data, and generates AI-driven epidemiological insights.

## Key Features
- **Hybrid Simulation Engine**
  - Automatically switches between agent-based and ODE-based models
  - Balances realism and performance without user intervention
- **Parallel Agent Simulation**
  - Multi-threaded execution using pthreads
  - Thread-safe stochastic behavior via per-thread RNGs
- **Network-Based Contact Modeling**
  - Random Graph (Erdős–Rényi) for uniform mixing
  - Small-World Graph (Watts–Strogatz) for realistic clustering and short path lengths
- **Real-Time Visualisation**
  - Interactive React dashboard with live-updating S/E/I/R curves
  - Hover tooltips and dynamic parameter adjustments
- **CDC Data Collection**
  - Compares simulated outbreaks with historical flu data
  - Pearson correlation quantifies model accuracy
- **AI-Powered Analysis**
  - Automated epidemiological reports using Claude API
  - Interprets trends, peaks, and parameter sensitivity

## System Architecture
The platform follows a decoupled three-layer architecture:
- Simulation Engine (C++)
  - Implements:
      - SEIR ODE model using 4th-order Runge-Kutta (RK4)
      - Agent-based simulation with configurable networks
  - Automatic model selection based on population size
  - Thread pool for parallel agent updates
  - Outputs time-series data in CSV format
- Backend API (Python / FastAPI)
  - Orchestrates simulation runs
  - Launches C++ engine via subprocess
  - Processes simulation outputs and performs statistical analysis
  - Computes Pearson correlation against CDC data
  - Integrates with Claude API for generating insights
- Frontend Dashboard (React)
  - Built with React 18 + Vite + Tailwind CSS
  - Interactive controls:
    - Population size
    - Infection rate (β)
    - Recovery rate (γ)
    - Simulation duration
    - Network topology
  - Visualization:
    - Real-time S/E/I/R curves (Recharts)
    - Statistical summaries
    - AI-generated reports

## Tech Stack
| Layer                | Technology                                    |
|----------------------|-----------------------------------------------|
| Simulation Engine    | Python, FastAPI, SQLAlchemy, WebSockets       |
| Backend              | React 18, Vite, Tailwind CSS, Zustand         |
| Frontend             | PostgreSQL                                    |
| Data Analysis        | Redis                                         |
| AI Integration       | sentence-transformers, FAISS, Gemini API      |

## Getting Started
Prerequisites :
- CMake ≥ 3.10
- C++17-compatible compiler
- Python ≥ 3.8
- Node.js ≥ 16

1. **Build Simulation Engine**
   ```
   cd engine
   mkdir build && cd build
   cmake ..
   cmake --build . --config Release
   ```
2. **Setup Backend**
   ```
   cd backend
   python -m venv venv

   # Activate environment
   venv\Scripts\activate       # Windows
   # source venv/bin/activate  # Mac/Linux

   pip install -r requirements.txt
   python main.py
   ```
3. **Setup Environment**
   ```
   cd frontend
   npm install
   npm run dev
   ```
4. **Run Application**
   ```
   http://localhost:5173
   ```
