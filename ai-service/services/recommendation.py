
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


def normalize_diploma(value: str) -> str:
    value = normalize(value)

    aliases = {
        "dts": "dts",
        "diplome de technicien specialise": "dts",
        "brevet de technicien specialise": "dts",
        "bts": "bts",
        "dut": "dut",
        "deug": "deug",
        "deust": "deust",
    }

    return aliases.get(value, value)


def recommend_formations(
    student: StudentProfile,
    formations: list[Formation]
) -> list[dict]:

    recommendations = []

    student_fields = {
        normalize(field)
        for field in student.preferred_fields
    }

    student_interests = {
        normalize(interest)
        for interest in student.interests
    }

    student_diploma = (
        normalize_diploma(student.diploma_type)
        if student.diploma_type else None
    )

    student_specialization = (
        normalize(student.specialization)
        if student.specialization else None
    )

    for formation in formations:
        score = 0
        possible_score = 0

        reasons = []
        warnings = []
        failed_conditions = []
        missing_information = []

        # 1. Niveau d'études : 40 points
        possible_score += 40

        if student.education_level in formation.education_levels:
            score += 40
            reasons.append("Niveau d'études compatible")
        else:
            failed_conditions.append(
                "Niveau d'études non accepté par la formation."
            )

        # 2. Filière du Bac : uniquement si elle est pertinente
        # et explicitement renseignée par l'établissement.
        if (
            student.education_level == "bac"
            and formation.accepted_streams
        ):
            possible_score += 30

            accepted_streams = {
                normalize(stream)
                for stream in formation.accepted_streams
            }

            student_stream = normalize(student.bac_stream)

            if student_stream in accepted_streams:
                score += 30
                reasons.append("Filière du baccalauréat compatible")
            else:
                failed_conditions.append(
                    "Filière du baccalauréat non acceptée."
                )

        elif student.education_level == "bac":
            warnings.append(
                "Les filières du baccalauréat acceptées "
                "ne sont pas précisées."
            )

        # 3. Domaines souhaités : 20 points
        if student_fields:
            possible_score += 20

            formation_fields = {
                normalize(field)
                for field in formation.fields
            }

            matching_fields = student_fields.intersection(
                formation_fields
            )

            score += (
                len(matching_fields) / len(student_fields)
            ) * 20

            if matching_fields:
                reasons.append(
                    "Domaines souhaités correspondants : "
                    + ", ".join(sorted(matching_fields))
                )

        # 4. Centres d'intérêt : 10 points
        if student_interests:
            possible_score += 10

            formation_fields = {
                normalize(field)
                for field in formation.fields
            }

            matching_interests = student_interests.intersection(
                formation_fields
            )

            score += (
                len(matching_interests) / len(student_interests)
            ) * 10

            if matching_interests:
                reasons.append(
                    "Correspondance avec les centres d'intérêt"
                )

        # 5. Moyenne minimale
        if formation.minimum_average is not None:
            if student.average is None:
                missing_information.append(
                    "Moyenne de l'étudiant non renseignée."
                )
            elif student.average < formation.minimum_average:
                failed_conditions.append(
                    f"Moyenne minimale requise : "
                    f"{formation.minimum_average}/20."
                )
            else:
                reasons.append("Moyenne minimale respectée")

        # 6. Compatibilité du diplôme Bac+2
        if student.education_level == "bac_plus_2":

            if not student_diploma:
                missing_information.append(
                    "Type de diplôme non renseigné."
                )

            elif not formation.accepted_diplomas:
                missing_information.append(
                    "Les diplômes Bac+2 acceptés ne sont pas précisés."
                )

            else:
                accepted_diplomas = {
                    normalize_diploma(diploma)
                    for diploma in formation.accepted_diplomas
                }

                if student_diploma in accepted_diplomas:
                    reasons.append("Type de diplôme compatible")
                else:
                    failed_conditions.append(
                        "Type de diplôme non accepté selon "
                        "les conditions renseignées."
                    )

            # 7. Compatibilité de la spécialisation
            if not student_specialization:
                missing_information.append(
                    "Spécialisation du diplôme non renseignée."
                )

            elif not formation.accepted_specializations:
                missing_information.append(
                    "Les spécialités acceptées ne sont pas précisées."
                )

            else:
                accepted_specializations = {
                    normalize(item)
                    for item in formation.accepted_specializations
                }

                if student_specialization in accepted_specializations:
                    reasons.append("Spécialisation compatible")
                else:
                    # Une différence de formulation ne prouve
                    # pas automatiquement une inéligibilité.
                    missing_information.append(
                        "L'équivalence de la spécialisation "
                        "doit être confirmée par l'établissement."
                    )

        # 8. Vérification de la source
        if formation.verification_status != "verified":
            missing_information.append(
                "Les informations de cette formation "
                "nécessitent une vérification officielle."
            )

        # 9. Score normalisé sur 100
        final_score = (
            round((score / possible_score) * 100, 2)
            if possible_score > 0
            else 0
        )

        # 10. Statut d'éligibilité
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
                "Vérifier les conditions complémentaires "
                "et les modalités de sélection."
            )
        else:
            warnings.append(
                "Les conditions détaillées doivent être vérifiées "
                "auprès de l'établissement."
            )

        recommendations.append({
            "formation": formation.model_dump(mode="json"),
            "score": final_score,
            "eligibility": eligibility,
            "reasons": reasons,
            "warnings": warnings
        })

    recommendations.sort(
        key=lambda item: item["score"],
        reverse=True
    )

    return recommendations
