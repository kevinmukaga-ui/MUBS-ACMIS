<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseUnit extends Model
{
    use HasFactory;

    protected $fillable = [
        'programme_id',
        'code',
        'title',
        'year_of_study',
        'semester',
        'credit_units',
        'version_type',
        'syllabus_file_path',
        'description',
        'lecturer_name',
        'alignment_status',
        'alignment_score',
    ];

    protected $casts = [
        'year_of_study' => 'integer',
        'semester' => 'integer',
        'credit_units' => 'integer',
        'alignment_score' => 'float',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function learningOutcomes(): HasMany
    {
        return $this->hasMany(LearningOutcome::class);
    }

    public function assessmentTasks(): HasMany
    {
        return $this->hasMany(AssessmentTask::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(AlignmentFlag::class);
    }
}
