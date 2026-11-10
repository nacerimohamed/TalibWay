from pydantic import BaseModel, Field

from schemas.student import StudentProfile
from schemas.formation import Formation


class RecommendationRequest(BaseModel):
    student: StudentProfile

    formations: list[Formation] = Field(min_length=1, max_length=500)
