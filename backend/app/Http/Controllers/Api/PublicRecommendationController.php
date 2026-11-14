<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Validation\Rule;

class PublicRecommendationController extends Controller
{
    public function recommend(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student.education_level' => [
                'required',
                Rule::in(['college', 'bac', 'bac_plus_2', 'bac_plus_3']),
            ],

            'student.college_stream' => [
                'nullable',
                Rule::in(['lettres', 'sciences']),
            ],

            'student.bac_stream' => ['nullable', 'string', 'max:100'],

            'student.average' => ['nullable', 'numeric', 'between:0,20'],

            'student.semester_averages' => ['nullable', 'array', 'size:4'],
            'student.semester_averages.*' => ['numeric', 'between:0,20'],

            'student.city' => ['required', 'string', 'min:2', 'max:100'],

            'student.interests' => ['required', 'array', 'min:1', 'max:10'],
            'student.interests.*' => ['string', 'max:100'],

            'student.preferred_fields' => ['required', 'array', 'min:1', 'max:10'],
            'student.preferred_fields.*' => ['string', 'max:100'],

            'student.preferred_language' => [
                'nullable',
                Rule::in(['ar', 'fr', 'en']),
            ],

            'student.diploma_type' => ['nullable', 'string', 'max:150'],
            'student.specialization' => ['nullable', 'string', 'max:150'],
        ]);

        $student = $validated['student'];

        if (
            $student['education_level'] === 'college'
            && empty($student['college_stream'])
        ) {
            return response()->json([
                'message' => 'Veuillez sélectionner Lettres ou Sciences.',
            ], 422);
        }

        if (
            $student['education_level'] === 'bac'
            && (empty($student['bac_stream']) || !isset($student['average']))
        ) {
            return response()->json([
                'message' => 'La série et la moyenne du baccalauréat sont obligatoires.',
            ], 422);
        }

        if (
            $student['education_level'] === 'bac_plus_2'
            && count($student['semester_averages'] ?? []) !== 4
        ) {
            return response()->json([
                'message' => 'Les quatre notes semestrielles sont obligatoires pour Bac+2.',
            ], 422);
        }

        if (
            $student['education_level'] === 'bac_plus_3'
            && !isset($student['average'])
        ) {
            return response()->json([
                'message' => 'La moyenne générale est obligatoire pour Bac+3.',
            ], 422);
        }

        $student['preferred_language'] = $student['preferred_language'] ?? 'fr';

        $formations = Formation::query()
            ->where('is_active', true)
            ->get()
            ->map(function ($formation) {
                return [
                    'name' => $formation->name,
                    'institution' => $formation->institution,
                    'institution_type' => $formation->institution_type,
                    'city' => $formation->city,

                    'education_levels' => $formation->education_levels ?? [],
                    'accepted_college_streams' => $formation->accepted_college_streams ?? [],
                    'accepted_streams' => $formation->accepted_streams ?? [],
                    'accepted_diplomas' => $formation->accepted_diplomas ?? [],
                    'accepted_specializations' => $formation->accepted_specializations ?? [],

                    'fields' => $formation->fields ?? [],
                    'admission_conditions' => $formation->admission_conditions ?? [],
                    'admission_method' => $formation->admission_method,
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
            })
            ->values()
            ->all();

        if (empty($formations)) {
            return response()->json([
                'message' => 'Aucune formation active n’est disponible pour le moment.',
            ], 404);
        }

        try {
            $aiUrl = rtrim(
                env('AI_SERVICE_URL', 'http://127.0.0.1:8001'),
                '/'
            );

            $response = Http::timeout(30)->post(
                $aiUrl . '/recommendations',
                [
                    'student' => $student,
                    'formations' => $formations,
                ]
            );

            if (!$response->successful()) {
                return response()->json([
                    'message' => 'Le service AI a rencontré une erreur.',
                    'details' => $response->json(),
                ], 502);
            }

            return response()->json($response->json());

        } catch (\Throwable $exception) {
            return response()->json([
                'message' => 'Impossible de contacter le service AI.',
            ], 502);
        }
    }
}
