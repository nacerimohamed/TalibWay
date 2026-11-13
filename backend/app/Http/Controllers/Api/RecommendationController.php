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
        // 1. Get the authenticated student's saved profile
        $profile = $request->user()->studentProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Veuillez compléter votre profil étudiant avant de demander des recommandations.',
            ], 422);
        }

        // 2. Check that formations are available
        $formations = Formation::where('is_active', true)->get();

        if ($formations->isEmpty()) {
            return response()->json([
                'message' => 'Aucune formation disponible.',
                'recommendations' => [],
            ]);
        }

        // 3. Convert the saved profile into the Python API format
        $fields = $profile->fields ?? [];

        $student = [
            'education_level' => $profile->education_level,
            'bac_stream' => $profile->bac_stream,
            'city' => $profile->city,

            'interests' => $fields,
            'preferred_fields' => $fields,

            'preferred_language' => 'fr',

            'diploma_type' => $profile->diploma,
            'specialization' => $profile->specialization,
        ];

        // Bac+2 requires exactly four semester averages
        if ($profile->education_level === 'bac_plus_2') {
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
            // Bac and Bac+3 require an overall average
            $student['average'] = null;

            return response()->json([
                'message' => 'Le calcul des recommandations pour ce niveau nécessite une moyenne générale.',
            ], 422);
        }

        // 4. Send the profile and formations to FastAPI
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
