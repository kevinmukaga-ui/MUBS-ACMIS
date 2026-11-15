<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutcomeCompetenceLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_outcome_id',
        'programme_competence_id',
        'similarity_score',
        'is_primary',
    ];

    protected $casts = [
        'similarity_score' => 'float',
        'is_primary' => 'boolean',
    ];

    public function learningOutcome(): BelongsTo
    {
        return $this->belongsTo(LearningOutcome::class);
    }

    public function programmeCompetence(): BelongsTo
    {
        return $this->belongsTo(ProgrammeCompetence::class);
    }
}
