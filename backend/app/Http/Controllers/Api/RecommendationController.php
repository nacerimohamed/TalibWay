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
        $validated = $request->validate([
            'student.education_level' => 'required|in:bac,bac_plus_2,bac_plus_3',
            'student.bac_stream' => 'required|string|min:2|max:100',

            'student.average' => 'required_unless:student.education_level,bac_plus_2|nullable|numeric|min:0|max:20',

            'student.semester_averages' => 'required_if:student.education_level,bac_plus_2|array|size:4',
            'student.semester_averages.*' => 'numeric|min:0|max:20',

            'student.diploma_type' => 'nullable|string|max:100',
            'student.specialization' => 'nullable|string|max:150',

            'student.city' => 'required|string|min:2|max:100',

            'student.interests' => 'required|array|min:1|max:10',
            'student.interests.*' => 'string|max:100',

            'student.preferred_fields' => 'required|array|min:1|max:10',
            'student.preferred_fields.*' => 'string|max:100',

            'student.preferred_language' => 'sometimes|in:ar,fr,en',
        ]);

        $formations = Formation::where('is_active', true)->get();

        if ($formations->isEmpty()) {
            return response()->json([
                'message' => 'Aucune formation disponible.',
                'recommendations' => [],
            ]);
        }

        try {
            $response = Http::timeout(30)->post(
                'http://127.0.0.1:8001/recommendations',
                [
                    'student' => $validated['student'],

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
