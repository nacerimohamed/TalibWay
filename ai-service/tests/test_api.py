
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def create_student():
    return {
        "education_level": "bac_plus_2",
        "bac_stream": "Sciences Physiques",
        "average": 15.5,
        "city": "Tinghir",
        "interests": ["informatique"],
        "preferred_fields": ["informatique"],
        "preferred_language": "fr",
        "diploma_type": "DTS",
        "specialization": "Développement Digital - Web Full Stack",
        "semester_averages": [14, 15, 16, 17]
    }


def create_formation():
    return {
        "name": "Licence Informatique",
        "institution": "Université Test",
        "institution_type": "universite",
        "city": "Agadir",
        "education_levels": ["bac_plus_2"],
        "accepted_streams": ["Sciences Physiques"],
        "accepted_diplomas": ["DTS"],
        "accepted_specializations": [
            "Développement Digital - Web Full Stack"
        ],
        "fields": ["informatique"],
        "admission_conditions": [],
        "admission_method": "selection",
        "minimum_average": 12,
        "official_url": None,
        "source_name": "Test",
        "last_verified": None
    }


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_recommendations_endpoint():
    payload = {
        "student": create_student(),
        "formations": [create_formation()]
    }

    response = client.post("/recommendations", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["total"] == 1
    assert len(data["recommendations"]) == 1
    assert data["recommendations"][0]["eligibility"] == "potentially_eligible"


def test_recommendations_reject_invalid_student():
    payload = {
        "student": {
            "education_level": "invalid_level"
        },
        "formations": [create_formation()]
    }

    response = client.post("/recommendations", json=payload)

    assert response.status_code == 422
