<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class RecommendationController extends Controller
{
    public function recommend(Request $request)
    {
        // 1. Récupérer le profil de l'étudiant connecté
        $profile = $request->user()->studentProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Veuillez compléter votre profil étudiant avant de demander des recommandations.',
            ], 422);
        }

        // 2. Vérifier le parcours Collège
        if (
            $profile->education_level === 'college'
            && !in_array($profile->college_stream, ['lettres', 'sciences'], true)
        ) {
            return response()->json([
                'message' => 'Veuillez choisir un parcours : Lettres ou Sciences.',
            ], 422);
        }

        // 3. Récupérer les formations actives
        $formations = Formation::where('is_active', true)->get();

        if ($formations->isEmpty()) {
            return response()->json([
                'message' => 'Aucune formation disponible pour le moment.',
                'recommendations' => [],
            ]);
        }

        // 4. Préparer les informations de l'étudiant
        $fields = $profile->fields ?? [];

        $student = [
            'education_level' => $profile->education_level,
            'bac_stream' => $profile->bac_stream,
            'college_stream' => $profile->college_stream,
            'city' => $profile->city,

            'interests' => $fields,
            'preferred_fields' => $fields,

            'preferred_language' => 'fr',

            'diploma_type' => $profile->diploma,
            'specialization' => $profile->specialization,
        ];

        // 5. Gérer les moyennes selon le niveau d'études
        if ($profile->education_level === 'college') {

            // Pas de moyenne générale obligatoire pour Collège.
            $student['average'] = null;

        } elseif ($profile->education_level === 'bac_plus_2') {

            $semesterAverages = [
                $profile->s1,
                $profile->s2,
                $profile->s3,
                $profile->s4,
            ];

            if (in_array(null, $semesterAverages, true)) {
                return response()->json([
                    'message' => 'Les quatre moyennes semestrielles sont nécessaires pour générer les recommandations.',
                ], 422);
            }

            $student['semester_averages'] = array_map(
                fn ($average) => (float) $average,
                $semesterAverages
            );

        } else {

            // Le modèle actuel ne possède pas encore de colonne
            // pour enregistrer la moyenne générale de Bac et Bac+3.
            return response()->json([
                'message' => 'Le stockage de la moyenne générale pour ce niveau doit être configuré avant de générer les recommandations.',
            ], 422);
        }

        // 6. Envoyer les données au service Python
        try {
            $response = Http::timeout(30)->post(
                'http://127.0.0.1:8001/recommendations',
                [
                    'student' => $student,

                    'formations' => $formations->map(function ($formation) {
                        return [
                            'name' => $formation->name,
                            'institution' => $formation->institution,
                            'institution_type' => $formation->institution_type ?? 'unknown',
                            'city' => $formation->city,

                            'education_levels' => $formation->education_levels,
                            'accepted_streams' => $formation->accepted_streams,

                            'accepted_diplomas' => $formation->accepted_diplomas ?? [],
                            'accepted_specializations' => $formation->accepted_specializations ?? [],

                            'fields' => $formation->fields,
                            'admission_conditions' => $formation->admission_conditions ?? [],
                            'admission_method' => $formation->admission_method ?? 'unknown',

                            'minimum_average' => $formation->minimum_average,

                            'official_url' => $formation->official_url,
                            'source_name' => $formation->source_name,
                            'last_verified' => $formation->last_verified?->format('Y-m-d'),

                            'academic_year' => $formation->academic_year,
                            'verification_status' => $formation->verification_status,

                            'application_status' => $formation->application_status,
                            'application_start_date' => $formation->application_start_date?->format('Y-m-d'),
                            'application_end_date' => $formation->application_end_date?->format('Y-m-d'),
                        ];
                    })->values()->all(),
                ]
            );

            // 7. Vérifier la réponse Python
            if ($response->failed()) {
                return response()->json([
                    'message' => 'AI service returned an error.',
                    'details' => $response->json(),
                ], 502);
            }

            return response()->json($response->json());

        } catch (\Illuminate\Http\Client\ConnectionException $e) {

            return response()->json([
                'message' => 'AI service is unavailable. Make sure FastAPI is running.',
            ], 503);
        }
    }
}
