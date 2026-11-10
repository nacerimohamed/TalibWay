
from schemas.student import StudentProfile
from schemas.formation import Formation
from services.recommendation import recommend_formations


def create_student():
    return StudentProfile(
        education_level="bac_plus_2",
        bac_stream="Sciences Physiques",
        average=15.5,
        city="Tinghir",
        interests=["informatique"],
        preferred_fields=["informatique"],
        diploma_type="DTS",
        specialization="Développement Digital - Web Full Stack",
        semester_averages=[14, 15, 16, 17],
    )


def create_formation(**overrides):
    data = {
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
        "last_verified": None,
    }

    data.update(overrides)

    return Formation(**data)


def test_potentially_eligible():
    student = create_student()
    formation = create_formation()

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "potentially_eligible"


def test_not_eligible_when_diploma_is_not_accepted():
    student = create_student()

    formation = create_formation(
        accepted_diplomas=["DUT"]
    )

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "not_eligible"


def test_needs_verification_when_diploma_information_is_missing():
    student = create_student()

    formation = create_formation(
        accepted_diplomas=[],
        accepted_specializations=[]
    )

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "needs_verification"


def test_not_eligible_when_average_is_below_minimum():
    student = StudentProfile(
        education_level="bac_plus_2",
        bac_stream="Sciences Physiques",
        average=10,
        city="Tinghir",
        interests=["informatique"],
        preferred_fields=["informatique"],
        diploma_type="DTS",
        specialization="Développement Digital - Web Full Stack",
        semester_averages=[8, 10, 11, 11],
    )

    formation = create_formation(minimum_average=12)

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "not_eligible"


def test_recommendations_are_sorted_by_score():
    student = create_student()

    compatible = create_formation()

    less_compatible = create_formation(
        name="Licence Mathématiques",
        fields=["mathematiques"],
    )

    results = recommend_formations(
        student,
        [less_compatible, compatible]
    )

    assert results[0]["score"] >= results[1]["score"]
def test_not_eligible_when_bac_stream_is_not_accepted():
    student = create_student()

    formation = create_formation(
        accepted_streams=["Sciences Économiques"]
    )

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "not_eligible"


def test_not_eligible_when_education_level_is_not_accepted():
    student = create_student()

    formation = create_formation(
        education_levels=["bac"]
    )

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "not_eligible"


def test_normalization_handles_accents():
    student = create_student()

    formation = create_formation(
        accepted_specializations=["Developpement Digital - Web Full Stack"]
    )

    results = recommend_formations(student, [formation])

    assert results[0]["eligibility"] == "potentially_eligible"


def test_bac_plus_2_average_is_calculated_correctly():
    student = create_student()

    assert student.average == 15.5