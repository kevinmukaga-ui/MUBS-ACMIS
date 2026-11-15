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
        Schema::create('course_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('programme_id')->constrained()->cascadeOnDelete();
            $table->string('code'); // e.g. BBC2101
            $table->string('title'); // e.g. Object Oriented Programming for Business
            $table->unsignedTinyInteger('year_of_study')->default(1);
            $table->unsignedTinyInteger('semester')->default(1);
            $table->unsignedTinyInteger('credit_units')->default(3);
            $table->enum('version_type', ['old', 'cbet_revised'])->default('cbet_revised');
            $table->string('syllabus_file_path')->nullable();
            $table->text('description')->nullable();
            $table->string('lecturer_name')->nullable();
            $table->enum('alignment_status', ['pending', 'checked', 'requires_revision', 'approved'])->default('pending');
            $table->decimal('alignment_score', 5, 2)->nullable(); // overall alignment %
            $table->timestamps();

            $table->unique(['programme_id', 'code', 'version_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_units');
    }
};
