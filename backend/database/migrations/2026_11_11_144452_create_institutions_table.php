
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->string('slug')->unique();
            $table->string('acronym')->nullable();

            $table->string('institution_type');
            $table->string('sector')->default('public');

            $table->string('city');
            $table->string('region')->nullable();

            $table->string('website')->nullable();
            $table->string('admissions_url')->nullable();
            $table->string('official_source_url')->nullable();

            $table->string('verification_status')->default('needs_review');
            $table->date('last_verified')->nullable();

            $table->boolean('is_active')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('institutions');
    }
};
