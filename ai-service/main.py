from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas.recommendation import RecommendationRequest
from services.recommendation import recommend_formations


from schemas.student import StudentProfile

app = FastAPI(
    title="TalibWay AI API",
    description="AI recommendation service for Moroccan students",
    version="0.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to TalibWay AI Service",
        "status": "running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "talibway-ai"
    }


@app.post("/students/profile")
def create_student_profile(profile: StudentProfile):
    return {
        "message": "Student profile received successfully",
        "student": profile.model_dump()
    }

@app.post("/recommendations")
def get_recommendations(request: RecommendationRequest):

    recommendations = recommend_formations(
        student=request.student,
        formations=request.formations
    )

    return {
        "message": "Recommendations generated successfully",
        "total": len(recommendations),
        "recommendations": recommendations
    }