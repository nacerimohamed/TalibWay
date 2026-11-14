<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CatalogueClassificationController extends Controller
{
    public function classify(Request $request)
    {
        $profile = $request->user()->studentProfile;

        if (!$profile) {
            return response()->json([
                'message' => 'Veuillez compléter votre profil étudiant.'
            ], 404);
        }

        $fields = is_array($profile->fields)
            ? $profile->fields
            : [];

        if (empty($fields)) {
            return response()->json([
                'message' => 'Veuillez renseigner vos domaines préférés.'
            ], 422);
        }

        $semesterAverages = [
            $profile->s1,
            $profile->s2,
            $profile->s3,
            $profile->s4,
        ];

        $semesterAverages = array_map(
            fn ($value) => $value === null ? null : (float) $value,
            $semesterAverages
        );

        $semesterAverages = array_values(
            array_filter(
                $semesterAverages,
                fn ($value) => $value !== null
            )
        );

        $average = $profile->average ?? null;

        if ($profile->education_level === 'bac_plus_2') {
            if (count($semesterAverages) !== 4) {
                return response()->json([
                    'message' => 'Les quatre moyennes S1 à S4 sont obligatoires.'
                ], 422);
            }

            $average = round(
                array_sum($semesterAverages) / 4,
                2
            );
        }

        $student = [
            'education_level' => $profile->education_level,
            'bac_stream' => $profile->bac_stream,
            'college_stream' => $profile->college_stream ?? null,
            'average' => $average,
            'city' => $profile->city,
            'interests' => $fields,
            'preferred_fields' => $fields,
            'preferred_language' => 'fr',
            'diploma_type' => $profile->diploma,
            'specialization' => $profile->specialization,
            'semester_averages' => $semesterAverages,
        ];

        $catalogue = array_values(config('catalogue'));

        try {
            $response = Http::timeout(30)->post(
                rtrim(
                    env('AI_SERVICE_URL', 'http://127.0.0.1:8001'),
                    '/'
                ) . '/catalogue/classify',
                [
                    'student' => $student,
                    'domains' => $catalogue,
                ]
            );

            if ($response->failed()) {
                return response()->json([
                    'message' => 'Erreur lors de la classification.',
                    'details' => $response->json(),
                ], $response->status() === 422 ? 422 : 502);
            }

            return response()->json($response->json());

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Impossible de contacter le service AI.',
                'error' => $e->getMessage(),
            ], 503);
        }
    }
}
