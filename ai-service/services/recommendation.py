
import unicodedata

from schemas.student import StudentProfile
from schemas.formation import Formation


def normalize(value: str) -> str:
    value = value.strip().lower()
    value = unicodedata.normalize("NFD", value)

    return "".join(
        char for char in value
        if unicodedata.category(char) != "Mn"
    )


def recommend_formations(
    student: StudentProfile,
    formations: list[Formation]
) -> list[dict]:

    recommendations = []

    student_stream = normalize(student.bac_stream)

    student_fields = {
        normalize(field)
        for field in student.preferred_fields
    }

    student_interests = {
        normalize(interest)
        for interest in student.interests
    }

    student_diploma = (
        normalize(student.diploma_type)
        if student.diploma_type else None
    )

    student_specialization = (
        normalize(student.specialization)
        if student.specialization else None
    )

    for formation in formations:
        score = 0
        reasons = []
        warnings = []
        failed_conditions = []
        missing_information = []

        # 1. Education level compatibility (40 points)
        level_match = (
            student.education_level in formation.education_levels
        )

        if level_match:
            score += 40
            reasons.append("Niveau d'études compatible")
        else:
            failed_conditions.append(
                "Niveau d'études non accepté par la formation."
            )

        # 2. Bac stream compatibility (30 points)
        accepted_streams = {
            normalize(stream)
            for stream in formation.accepted_streams
        }

        stream_match = student_stream in accepted_streams

        if stream_match:
            score += 30
            reasons.append("Filière du baccalauréat compatible")
        else:
            failed_conditions.append(
                "Filière du baccalauréat non acceptée."
            )

        # 3. Preferred fields compatibility (20 points)
        formation_fields = {
            normalize(field)
            for field in formation.fields
        }

        matching_fields = student_fields.intersection(
            formation_fields
        )

        if student_fields:
            score += (
                len(matching_fields) / len(student_fields)
            ) * 20

        if matching_fields:
            reasons.append(
                "Domaines souhaités : "
                + ", ".join(sorted(matching_fields))
            )

        # 4. Interests compatibility (10 points)
        matching_interests = student_interests.intersection(
            formation_fields
        )

        if student_interests:
            score += (
                len(matching_interests) / len(student_interests)
            ) * 10

        if matching_interests:
            reasons.append(
                "Correspondance avec les centres d'intérêt"
            )

        # 5. Minimum average
        average_ok = (
            formation.minimum_average is None
            or (
                student.average is not None
                and student.average >= formation.minimum_average
            )
        )

        if not average_ok:
            failed_conditions.append(
                f"Moyenne minimale requise : "
                f"{formation.minimum_average}/20."
            )
        elif formation.minimum_average is not None:
            reasons.append("Moyenne minimale respectée")
        else:
            missing_information.append(
                "Aucune moyenne minimale officielle renseignée."
            )

        # 6. Diploma compatibility
        if student.education_level == "bac_plus_2":

            if not student_diploma:
                missing_information.append(
                    "Type de diplôme non renseigné."
                )

            elif not formation.accepted_diplomas:
                missing_information.append(
                    "Les diplômes Bac+2 acceptés ne sont pas renseignés."
                )

            else:
                accepted_diplomas = {
                    normalize(diploma)
                    for diploma in formation.accepted_diplomas
                }

                if student_diploma not in accepted_diplomas:
                    failed_conditions.append(
                        "Type de diplôme non accepté selon les données disponibles."
                    )
                else:
                    reasons.append("Type de diplôme compatible")

            # 7. Specialization compatibility
            if not student_specialization:
                missing_information.append(
                    "Spécialisation du diplôme non renseignée."
                )

            elif not formation.accepted_specializations:
                missing_information.append(
                    "Les spécialités acceptées ne sont pas renseignées."
                )

            else:
                accepted_specializations = {
                    normalize(specialization)
                    for specialization in formation.accepted_specializations
                }

                if student_specialization not in accepted_specializations:
                    failed_conditions.append(
                        "Spécialisation non acceptée selon les données disponibles."
                    )
                else:
                    reasons.append(
                        "Spécialisation compatible"
                    )

        # 8. Final eligibility status
        if failed_conditions:
            eligibility = "not_eligible"

        elif missing_information:
            eligibility = "needs_verification"

        else:
            eligibility = "potentially_eligible"

        warnings.extend(failed_conditions)
        warnings.extend(missing_information)

        if formation.admission_conditions:
            warnings.append(
                "Vérifier les conditions complémentaires d'admission."
            )
        else:
            warnings.append(
                "Les conditions détaillées doivent être vérifiées "
                "auprès de l'établissement."
            )

        recommendations.append({
            "formation": formation.model_dump(mode="json"),
            "score": round(score, 2),
            "eligibility": eligibility,
            "reasons": reasons,
            "warnings": warnings
        })

    recommendations.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return recommendations
