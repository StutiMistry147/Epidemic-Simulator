import pandas as pd
import numpy as np
from scipy.stats import pearsonr
from typing import List, Dict, Any
import os

def load_cdc_data() -> pd.DataFrame:
    data_path = os.path.join(os.path.dirname(__file__), "data", "cdc_flu_2023.csv")
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"CDC data not found at {data_path}")
    return pd.read_csv(data_path)

def normalize_curve(data: List[float]) -> np.ndarray:
    arr = np.array(data, dtype=float)
    peak = np.max(arr)
    if peak > 0:
        arr = arr / peak
    return arr

def trim_to_same_length(arr1: np.ndarray, arr2: np.ndarray) -> tuple:
    min_len = min(len(arr1), len(arr2))
    return arr1[:min_len], arr2[:min_len]

def analyze_simulation(sim_timeseries: List[Dict[str, Any]]) -> Dict[str, Any]:
    sim_days = [row["day"] for row in sim_timeseries]
    sim_infected = [row["I"] for row in sim_timeseries]

    cdc_df = load_cdc_data()
    cdc_days = cdc_df["day"].tolist()
    cdc_cases = cdc_df["cases"].tolist()

    sim_normalized = normalize_curve(sim_infected)
    cdc_normalized = normalize_curve(cdc_cases)

    sim_trimmed, cdc_trimmed = trim_to_same_length(sim_normalized, cdc_normalized)

    correlation, p_value = pearsonr(sim_trimmed, cdc_trimmed)

    peak_infected = max(sim_infected)
    peak_day = sim_days[int(np.argmax(sim_infected))]
    total_recovered = sim_timeseries[-1]["R"] if sim_timeseries else 0

    # Build CDC curve as list of {day, value} for frontend
    cdc_curve = [
        {"day": int(cdc_days[i]), "value": float(cdc_normalized[i])}
        for i in range(len(cdc_normalized))
    ]

    return {
        "correlation": float(correlation),
        "p_value": float(p_value),
        "peak_infected": int(peak_infected),
        "peak_day": int(peak_day),
        "total_recovered": int(total_recovered),
        "simulation_days": len(sim_timeseries),
        "cdc_days": len(cdc_cases),
        "cdc_curve": cdc_curve,
    }

def analyze_with_params(sim_timeseries: List[Dict[str, Any]],
                        beta: float, gamma: float) -> Dict[str, Any]:
    stats = analyze_simulation(sim_timeseries)
    stats["r0"] = beta / gamma if gamma > 0 else 0
    stats["beta"] = beta
    stats["gamma"] = gamma
    return stats

if __name__ == "__main__":
    mock_timeseries = []
    for day in range(100):
        infected = int(1000 * np.exp(-((day - 30) ** 2) / 200))
        mock_timeseries.append({
            "day": day, "S": 10000 - infected,
            "E": 0, "I": infected, "R": int(infected * 0.5)
        })

    try:
        stats = analyze_with_params(mock_timeseries, 0.3, 0.1)
        print("Analysis results:")
        for key, value in stats.items():
            if key != "cdc_curve":
                print(f"  {key}: {value}")
        print(f"  cdc_curve: [{len(stats['cdc_curve'])} points]")
    except Exception as e:
        print(f"Error: {e}")
        print("Note: Make sure data/cdc_flu_2023.csv exists")