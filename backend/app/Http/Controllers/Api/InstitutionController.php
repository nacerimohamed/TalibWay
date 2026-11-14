<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Institution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InstitutionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $institutions = Institution::query()
            ->where('is_active', true)
            ->when($request->filled('city'), function ($query) use ($request) {
                $query->where('city', $request->city);
            })
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->where('institution_type', $request->type);
            })
            ->when($request->filled('sector'), function ($query) use ($request) {
                $query->where('sector', $request->sector);
            })
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%' . $request->search . '%');
            })
            ->withCount('formations')
            ->orderBy('name')
            ->paginate(20);

        return response()->json($institutions);
    }

    public function show(string $slug): JsonResponse
    {
        $institution = Institution::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['formations' => function ($query) {
                $query->where('is_active', true);
            }])
            ->firstOrFail();

        return response()->json($institution);
    }
}
