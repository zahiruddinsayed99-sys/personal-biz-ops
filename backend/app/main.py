from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(title="BusinessHub AI")

@app.get("/api/v1/healthz")
async def health_check():
    return JSONResponse(content={"status": "OK"}, status_code=200)
