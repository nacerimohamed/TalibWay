<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->unique()
                ->constrained()
                ->cascadeOnDelete();

            $table->string('education_level');
            $table->string('bac_stream')->nullable();
            $table->string('diploma')->nullable();
            $table->string('specialization')->nullable();
            $table->string('city');

            $table->decimal('s1', 4, 2)->nullable();
            $table->decimal('s2', 4, 2)->nullable();
            $table->decimal('s3', 4, 2)->nullable();
            $table->decimal('s4', 4, 2)->nullable();

            $table->json('fields')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
