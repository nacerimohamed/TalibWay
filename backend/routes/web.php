<?php

use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/', function () {
    return view('welcome');
});

// Email verification
Route::get('/email/verify/{id}/{hash}', function (
    string $id,
    string $hash
) {
    $user = User::findOrFail($id);

    // Verify that the email hash belongs to this user
    if (!hash_equals(
        sha1($user->getEmailForVerification()),
        $hash
    )) {
        abort(403, 'Invalid email verification link.');
    }

    // Verify email if not already verified
    if (!$user->hasVerifiedEmail()) {
        $user->markEmailAsVerified();
    }

    return response(
        '<h1>Email verified successfully!</h1>
        <p>Your TalibWay account is now active.</p>
        <p>You can close this page and log in to TalibWay.</p>'
    );
})->middleware('signed')->name('verification.verify');
