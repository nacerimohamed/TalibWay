<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentProfileController extends Controller
{
    public function show(Request $request)
    {
        $profile = $request->user()->studentProfile;

        return response()->json([
            'profile' => $profile,
        ]);
    }

    public function update(Request $request)
{
    $validated = $request->validate([
        'education_level' => [
            'required',
            Rule::in(['college', 'bac', 'bac_plus_2', 'bac_plus_3']),
        ],

        'college_stream' => [
            'nullable',
            'required_if:education_level,college',
            Rule::in(['lettres', 'sciences']),
        ],

        'bac_stream' => [
            'nullable',
            'required_if:education_level,bac',
            'string',
            'max:255',
        ],

        'diploma' => ['nullable', 'string', 'max:255'],
        'specialization' => ['nullable', 'string', 'max:255'],
        'city' => ['required', 'string', 'max:255'],

        's1' => ['nullable', 'numeric', 'min:0', 'max:20'],
        's2' => ['nullable', 'numeric', 'min:0', 'max:20'],
        's3' => ['nullable', 'numeric', 'min:0', 'max:20'],
        's4' => ['nullable', 'numeric', 'min:0', 'max:20'],

        'fields' => ['nullable', 'array'],
        'fields.*' => ['string', 'max:255'],
    ]);

    $profile = $request->user()
        ->studentProfile()
        ->updateOrCreate(
            ['user_id' => $request->user()->id],
            $validated
        );

    return response()->json([
        'message' => 'Profil étudiant enregistré avec succès.',
        'profile' => $profile,
    ]);
}
}
