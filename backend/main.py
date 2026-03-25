from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import logging

from runner import run_simulation
from analyzer import analyze_with_params
from report import generate_report

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Epidemic Simulator API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class SimulationRequest(BaseModel):
    population: int
    beta: float
    gamma: float
    days: int
    network: str  # "random" or "small_world"

# Response model
class SimulationResponse(BaseModel):
    timeseries: List[Dict[str, Any]]
    stats: Dict[str, Any]
    report: str

@app.get("/")
async def root():
    return {"message": "Epidemic Simulator API", "status": "running"}

@app.post("/simulate", response_model=SimulationResponse)
async def simulate(request: SimulationRequest):
    """
    Run epidemic simulation with given parameters.
    
    Returns:
        - timeseries: Daily data for S, E, I, R compartments
        - stats: Statistical analysis including correlation with CDC data
        - report: AI-generated analysis from Claude
    """
    # Validate inputs
    if request.population <= 0:
        raise HTTPException(status_code=400, detail="Population must be positive")
    if request.beta <= 0 or request.beta >= 1:
        raise HTTPException(status_code=400, detail="Beta must be between 0 and 1")
    if request.gamma <= 0 or request.gamma >= 1:
        raise HTTPException(status_code=400, detail="Gamma must be between 0 and 1")
    if request.days <= 0:
        raise HTTPException(status_code=400, detail="Days must be positive")
    if request.network not in ["random", "small_world"]:
        raise HTTPException(status_code=400, detail="Network must be 'random' or 'small_world'")
    
    logger.info(f"Starting simulation with params: {request.dict()}")
    
    try:
        # Step 1: Run simulation
        logger.info("Running C++ simulator...")
        timeseries = run_simulation(request.dict())
        logger.info(f"Simulation completed with {len(timeseries)} days")
        
        # Step 2: Analyze results
        logger.info("Analyzing simulation results...")
        stats = analyze_with_params(timeseries, request.beta, request.gamma)
        logger.info(f"Analysis complete. Correlation: {stats['correlation']:.3f}")
        
        # Step 3: Generate report
        logger.info("Generating AI report...")
        report = generate_report(stats)
        logger.info("Report generated successfully")
        
        # Return only the fields expected by the response model
        return {
            "timeseries": timeseries,
            "stats": stats,
            "report": report
        }
        
    except FileNotFoundError as e:
        logger.error(f"File error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Simulator binary not found: {str(e)}. Make sure to compile the C++ code first."
        )
    except RuntimeError as e:
        logger.error(f"Runtime error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Simulation error: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Unexpected error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

# Optional: Add endpoint for health check
@app.get("/health")
async def health():
    return {"status": "healthy"}

# For running directly with uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)