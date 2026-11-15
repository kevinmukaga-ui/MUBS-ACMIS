<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LearningOutcome extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_unit_id',
        'outcome_number',
        'description',
        'action_verb',
        'bloom_level',
        'bloom_confidence',
        'is_measurable',
        'suggested_verbs',
    ];

    protected $casts = [
        'outcome_number' => 'integer',
        'bloom_confidence' => 'float',
        'is_measurable' => 'boolean',
        'suggested_verbs' => 'array',
    ];

    public function courseUnit(): BelongsTo
    {
        return $this->belongsTo(CourseUnit::class);
    }

    public function competenceLinks(): HasMany
    {
        return $this->hasMany(OutcomeCompetenceLink::class);
    }

    public function assessmentLinks(): HasMany
    {
        return $this->hasMany(OutcomeAssessmentLink::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(AlignmentFlag::class);
    }
}
