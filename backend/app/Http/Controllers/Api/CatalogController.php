<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CatalogController extends Controller
{
    public function index(): JsonResponse
    {
        $catalogue = config('catalogue', []);

        return response()->json([
            'message' => 'Catalogue récupéré avec succès.',
            'total_domains' => count($catalogue),
            'total_filières' => collect($catalogue)
                ->sum(fn ($domain) => count($domain['filieres'])),
            'domains' => $catalogue,
        ]);
    }
}
