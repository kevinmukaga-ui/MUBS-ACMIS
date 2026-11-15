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
        Schema::create('programmes', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // e.g. BBC, BOIM, BCOM
            $table->string('name'); // e.g. Bachelor of Business Computing
            $table->string('faculty'); // Faculty of Computing and Informatics, Faculty of Commerce
            $table->string('department');
            $table->unsignedTinyInteger('duration_years')->default(3);
            $table->text('description')->nullable();
            $table->boolean('is_cbet_aligned')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('programmes');
    }
};
