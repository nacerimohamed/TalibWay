
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\CatalogController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\CatalogueClassificationController;
use App\Http\Controllers\Api\PublicRecommendationController;

// ========================================
// PUBLIC ROUTES - Sans authentification
// ========================================

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/catalogue', [CatalogController::class, 'index']);

Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{slug}', [FormationController::class, 'show']);

Route::get('/institutions', [InstitutionController::class, 'index']);
Route::get('/institutions/{slug}', [InstitutionController::class, 'show']);

// Public recommendations - No login required
Route::post(
    '/public/recommendations',
    [PublicRecommendationController::class, 'recommend']
)->middleware('throttle:20,1');


// ========================================
// PROTECTED ROUTES - Sanctum required
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post(
        '/catalogue/classify',
        [CatalogueClassificationController::class, 'classify']
    );

    Route::get('/student-profile', [StudentProfileController::class, 'show']);
    Route::put('/student-profile', [StudentProfileController::class, 'update']);

    Route::post('/recommendations', [RecommendationController::class, 'recommend']);

});
