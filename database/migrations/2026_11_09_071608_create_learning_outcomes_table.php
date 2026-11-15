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
        Schema::create('learning_outcomes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_unit_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('outcome_number')->default(1);
            $table->text('description'); // The CLO text statement
            $table->string('action_verb')->nullable(); // Extracted verb e.g. "analyze", "understand"
            $table->enum('bloom_level', ['remember', 'understand', 'apply', 'analyse', 'evaluate', 'create'])->nullable();
            $table->decimal('bloom_confidence', 5, 2)->default(0.00);
            $table->boolean('is_measurable')->default(true);
            $table->json('suggested_verbs')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_outcomes');
    }
};
