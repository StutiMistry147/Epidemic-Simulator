import subprocess
import csv
import os
from typing import List, Dict, Any

def run_simulation(params: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Run the C++ simulator with given parameters and parse output.
    
    Args:
        params: Dictionary with keys: population, beta, gamma, days, network
    
    Returns:
        List of dictionaries with keys: day, S, E, I, R
    """
    # Hardcoded path to simulator.exe in engine folder
    simulator_path = r"C:\Users\kuhum\Desktop\MyProject\Epidemic\engine\simulator.exe"
    
    if not os.path.exists(simulator_path):
        raise FileNotFoundError(f"Simulator binary not found at {simulator_path}. Make sure to compile it first.")
    
    cmd = [
        simulator_path,
        str(params["population"]),
        str(params["beta"]),
        str(params["gamma"]),
        str(params["days"]),
        params["network"]
    ]
    
    # Run the simulation
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
            timeout=300  # 5 minute timeout
        )
    except subprocess.CalledProcessError as e:
        raise RuntimeError(f"Simulator crashed with error: {e.stderr}")
    except subprocess.TimeoutExpired:
        raise RuntimeError("Simulator timed out after 5 minutes")
    
    # Parse CSV output
    if not result.stdout:
        raise RuntimeError("Simulator returned empty output")
    
    # Parse CSV
    lines = result.stdout.strip().split('\n')
    if len(lines) < 2:
        raise RuntimeError("Simulator output has insufficient data")
    
    reader = csv.DictReader(lines)
    timeseries = []
    for row in reader:
        timeseries.append({
            "day": int(row["day"]),
            "S": int(row["S"]),
            "E": int(row["E"]),
            "I": int(row["I"]),
            "R": int(row["R"])
        })
    
    return timeseries

# Standalone test
if __name__ == "__main__":
    # Test with a small simulation
    test_params = {
        "population": 1000,
        "beta": 0.3,
        "gamma": 0.1,
        "days": 30,
        "network": "random"
    }
    
    try:
        results = run_simulation(test_params)
        print(f"Simulation ran successfully with {len(results)} days")
        print("First 5 days:")
        for day in results[:5]:
            print(f"  Day {day['day']}: S={day['S']}, E={day['E']}, I={day['I']}, R={day['R']}")
        print(f"\nLast day: Day {results[-1]['day']}: I={results[-1]['I']}, R={results[-1]['R']}")
    except Exception as e:
        print(f"Error: {e}")
