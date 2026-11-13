
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl


class Formation(BaseModel):
    name: str = Field(min_length=2, max_length=200)
    institution: str = Field(min_length=2, max_length=200)
    institution_type: str = Field(min_length=2, max_length=100)
    city: str = Field(min_length=2, max_length=100)

    education_levels: list[str] = Field(min_length=1)
    accepted_streams: list[str] = Field(default_factory=list)

    accepted_diplomas: list[str] = Field(default_factory=list)
    accepted_specializations: list[str] = Field(default_factory=list)

    fields: list[str] = Field(min_length=1)
    admission_conditions: list[str] = Field(default_factory=list)

    admission_method: Literal[
        "selection", "exam", "open_access", "unknown"
    ] = "unknown"

    minimum_average: float | None = Field(default=None, ge=0, le=20)

    official_url: HttpUrl | None = None
    source_name: str | None = None
    last_verified: date | None = None

    academic_year: str | None = Field(default=None, max_length=9)

    verification_status: Literal[
        "verified", "needs_review", "unverified"
    ] = "needs_review"

    application_status: Literal[
        "open", "closed", "not_announced"
    ] = "not_announced"

    application_start_date: date | None = None
    application_end_date: date | None = None
