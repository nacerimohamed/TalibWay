
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\StudentProfileController;
use App\Http\Controllers\Api\CatalogController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/catalogue', [CatalogController::class, 'index']);
Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{slug}', [FormationController::class, 'show']);



// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    
    Route::get('/student-profile', [StudentProfileController::class, 'show']);
    Route::put('/student-profile', [StudentProfileController::class, 'update']);
    
    Route::post('/recommendations', [RecommendationController::class, 'recommend']);

});
