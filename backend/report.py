from typing import Dict, Any

def generate_report(stats: Dict[str, Any]) -> str:
    r0 = stats.get('r0', 0)
    severity = 'high' if r0 > 2 else 'moderate'
    
    return (
        f"Outbreak Report: With an R0 of {r0:.2f}, this outbreak shows {severity} transmission potential. "
        f"Each infected individual spreads the disease to approximately {r0:.1f} others on average.\n\n"
        f"Peak infection of {stats.get('peak_infected', 'N/A')} cases occurred on day "
        f"{stats.get('peak_day', 'N/A')}. Total recovered by end of simulation: "
        f"{stats.get('total_recovered', 'N/A')}.\n\n"
        f"Simulation correlation with CDC 2023 flu data: {stats.get('correlation', 0):.3f}. "
        f"Early intervention such as reducing beta through social distancing is recommended "
        f"to flatten the infection curve and reduce peak burden on healthcare systems."
    )

if __name__ == "__main__":
    test_stats = {
        "correlation": 0.85,
        "peak_infected": 2345,
        "peak_day": 42,
        "total_recovered": 8765,
        "r0": 2.5,
    }
    print(generate_report(test_stats))
