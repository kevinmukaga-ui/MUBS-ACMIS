<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('industry_evidence', function (Blueprint $table) {
            $table->id();
            $table->enum('source_type', ['job_advert', 'dit_profile', 'esco']); // Great Uganda Jobs, DIT ATP, ESCO
            $table->string('title'); // e.g. "Software Engineer", "Mobile Applications Developer ATP"
            $table->string('organization')->nullable(); // e.g. "SafeBoda Uganda", "Directorate of Industrial Training"
            $table->date('publication_date')->nullable();
            $table->string('target_field')->default('computing'); // computing, commerce, office_management
            $table->json('extracted_competences'); // List of skills/competencies extracted from text
            $table->longText('full_text')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('industry_evidence');
    }
};
