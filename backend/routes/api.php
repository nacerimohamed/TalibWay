
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\FormationController;
use App\Http\Controllers\Api\RecommendationController;

Route::get('/formations', [FormationController::class, 'index']);
Route::get('/formations/{slug}', [FormationController::class, 'show']);

Route::post('/recommendations', [RecommendationController::class, 'recommend']);
