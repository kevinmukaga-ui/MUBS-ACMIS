<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutcomeAssessmentLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'learning_outcome_id',
        'assessment_task_id',
        'coverage_score',
    ];

    protected $casts = [
        'coverage_score' => 'float',
    ];

    public function learningOutcome(): BelongsTo
    {
        return $this->belongsTo(LearningOutcome::class);
    }

    public function assessmentTask(): BelongsTo
    {
        return $this->belongsTo(AssessmentTask::class);
    }
}
