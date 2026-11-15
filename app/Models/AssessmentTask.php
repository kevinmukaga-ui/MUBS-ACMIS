<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AssessmentTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_unit_id',
        'title',
        'type',
        'weight_percentage',
        'description',
    ];

    protected $casts = [
        'weight_percentage' => 'float',
    ];

    public function courseUnit(): BelongsTo
    {
        return $this->belongsTo(CourseUnit::class);
    }

    public function outcomeLinks(): HasMany
    {
        return $this->hasMany(OutcomeAssessmentLink::class);
    }
}
