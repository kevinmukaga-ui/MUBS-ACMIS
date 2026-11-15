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
        Schema::create('programme_competences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('programme_id')->constrained()->cascadeOnDelete();
            $table->string('code'); // e.g. PC1, PC2
            $table->string('title');
            $table->text('description');
            $table->string('category')->default('Technical'); // Technical, Analytical, Managerial, Communication, Workplace
            $table->timestamps();

            $table->unique(['programme_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programme_competences');
    }
};
