<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->validate([
            'education_level' => 'sometimes|string',
            'city' => 'sometimes|string|max:100',
            'field' => 'sometimes|string|max:100',
            'stream' => 'sometimes|string|max:100',
            'institution_type' => 'sometimes|string|max:100',
            'search' => 'sometimes|string|max:150',
        ]);

        $query = Formation::where('is_active', true);

        // Filter by education level
        if (!empty($filters['education_level'])) {
            $query->whereJsonContains(
                'education_levels',
                $filters['education_level']
            );
        }

        // Filter by city
        if (!empty($filters['city'])) {
            $query->where('city', $filters['city']);
        }

        // Filter by field
        if (!empty($filters['field'])) {
            $query->whereJsonContains(
                'fields',
                $filters['field']
            );
        }

        // Filter by accepted Bac stream
        if (!empty($filters['stream'])) {
            $query->whereJsonContains(
                'accepted_streams',
                $filters['stream']
            );
        }

        // Filter by institution type
        if (!empty($filters['institution_type'])) {
            $query->where(
                'institution_type',
                $filters['institution_type']
            );
        }

        // Search by name, institution or city
        if (!empty($filters['search'])) {
            $search = $filters['search'];

            $query->where(function ($q) use ($search) {
                $q->where('name', 'LIKE', "%{$search}%")
                    ->orWhere('institution', 'LIKE', "%{$search}%")
                    ->orWhere('city', 'LIKE', "%{$search}%");
            });
        }

        $formations = $query
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return response()->json($formations);
    }

    public function show(string $slug)
    {
        $formation = Formation::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return response()->json($formation);
    }
}
