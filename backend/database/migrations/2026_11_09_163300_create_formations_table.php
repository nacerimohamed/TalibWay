
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('formations', function (Blueprint $table) {
            $table->id();

            // Formation information
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('degree')->nullable();

            // Institution information
            $table->string('institution');
            $table->string('institution_type')->nullable();
            $table->string('city');
            $table->string('region')->nullable();

            // Admission information
            $table->json('education_levels');
            $table->json('accepted_streams');
            $table->json('fields');

            $table->text('admission_conditions')->nullable();
            $table->string('admission_method')->default('unknown');
            $table->decimal('minimum_average', 4, 2)->nullable();

            // Official source information
            $table->string('official_url')->nullable();
            $table->string('source_name')->nullable();
            $table->date('last_verified')->nullable();

            // Publication status
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('city');
            $table->index('institution_type');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
