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
        // 1. Semantic link between Learning Outcomes and Programme Competences
        Schema::create('outcome_competence_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_outcome_id')->constrained()->cascadeOnDelete();
            $table->foreignId('programme_competence_id')->constrained()->cascadeOnDelete();
            $table->decimal('similarity_score', 5, 4)->default(0.0000); // e.g. 0.8523
            $table->boolean('is_primary')->default(true);
            $table->timestamps();

            $table->unique(['learning_outcome_id', 'programme_competence_id'], 'clo_pc_unique');
        });

        // 2. Link between Learning Outcomes and Assessment Tasks
        Schema::create('outcome_assessment_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('learning_outcome_id')->constrained()->cascadeOnDelete();
            $table->foreignId('assessment_task_id')->constrained()->cascadeOnDelete();
            $table->decimal('coverage_score', 5, 4)->default(1.0000);
            $table->timestamps();

            $table->unique(['learning_outcome_id', 'assessment_task_id'], 'clo_assessment_unique');
        });

        // 3. Flags and Human-in-the-Loop Decisions (Accept, Edit, Reject)
        Schema::create('alignment_flags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_unit_id')->constrained()->cascadeOnDelete();
            $table->foreignId('learning_outcome_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('programme_competence_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('check_type', [
                'outcome_quality',          // Check 1: Non-measurable verb or Bloom issue
                'competence_alignment',     // Check 2: Unmapped outcome or orphaned competence
                'assessment_alignment',     // Check 3: Unassessed outcome
                'industry_gap'              // Check 4: Missing workplace skill
            ]);
            $table->enum('severity', ['error', 'warning', 'info'])->default('warning');
            $table->string('flag_title');
            $table->text('flag_reason');
            $table->text('suggested_action')->nullable();
            
            // Human-in-the-Loop decision tracking:
            $table->enum('resolution_status', ['pending', 'accepted', 'edited', 'rejected'])->default('pending');
            $table->text('resolution_note')->nullable(); // Explains why accepted/rejected/edited
            $table->foreignId('resolved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('alignment_flags');
        Schema::dropIfExists('outcome_assessment_links');
        Schema::dropIfExists('outcome_competence_links');
    }
};
