<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlignmentFlag extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_unit_id',
        'learning_outcome_id',
        'programme_competence_id',
        'check_type',
        'severity',
        'flag_title',
        'flag_reason',
        'suggested_action',
        'resolution_status',
        'resolution_note',
        'resolved_by',
        'resolved_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
    ];

    public function courseUnit(): BelongsTo
    {
        return $this->belongsTo(CourseUnit::class);
    }

    public function learningOutcome(): BelongsTo
    {
        return $this->belongsTo(LearningOutcome::class);
    }

    public function programmeCompetence(): BelongsTo
    {
        return $this->belongsTo(ProgrammeCompetence::class);
    }

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
