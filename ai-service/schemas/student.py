
from typing import Literal
from pydantic import BaseModel, Field, model_validator


class StudentProfile(BaseModel):
    education_level: Literal["bac", "bac_plus_2", "bac_plus_3"]

    bac_stream: str = Field(min_length=2, max_length=100)
    average: float | None = Field(default=None, ge=0, le=20)

    city: str = Field(min_length=2, max_length=100)

    interests: list[str] = Field(min_length=1, max_length=10)
    preferred_fields: list[str] = Field(min_length=1, max_length=10)

    preferred_language: Literal["ar", "fr", "en"] = "fr"

    diploma_type: str | None = None
    specialization: str | None = None

    semester_averages: list[float] = Field(
        default_factory=list,
        max_length=4
    )

    @model_validator(mode="after")
    def calculate_average(self):
        if self.education_level == "bac_plus_2":
            if len(self.semester_averages) != 4:
                raise ValueError(
                    "Bac+2 requires exactly 4 semester averages."
                )

            if any(
                average < 0 or average > 20
                for average in self.semester_averages
            ):
                raise ValueError(
                    "Semester averages must be between 0 and 20."
                )

            # First year: S1 + S2
            # Second year: S3 + S4
            self.average = round(
                sum(self.semester_averages) / 4, 2
            )

        elif self.average is None:
            raise ValueError(
                "An average is required for this education level."
            )

        return self
