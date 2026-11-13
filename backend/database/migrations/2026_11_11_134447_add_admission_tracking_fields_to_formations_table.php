
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->string('academic_year', 9)->nullable();

            $table->string('verification_status', 30)
                ->default('needs_review');

            $table->string('application_status', 30)
                ->default('not_announced');

            $table->date('application_start_date')->nullable();

            $table->date('application_end_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('formations', function (Blueprint $table) {
            $table->dropColumn([
                'academic_year',
                'verification_status',
                'application_status',
                'application_start_date',
                'application_end_date',
            ]);
        });
    }
};
