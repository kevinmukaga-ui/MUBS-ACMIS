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
        Schema::create('assessment_tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_unit_id')->constrained()->cascadeOnDelete();
            $table->string('title'); // e.g. Practical Lab Project, Coursework Test, Final Exam
            $table->string('type')->default('coursework'); // practical_project, continuous_assessment, practical_lab, written_exam, presentation
            $table->decimal('weight_percentage', 5, 2)->default(0.00); // e.g. 30.00
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assessment_tasks');
    }
};
