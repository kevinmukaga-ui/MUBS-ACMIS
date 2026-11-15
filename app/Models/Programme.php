<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Programme extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'faculty',
        'department',
        'duration_years',
        'description',
        'is_cbet_aligned',
    ];

    protected $casts = [
        'is_cbet_aligned' => 'boolean',
        'duration_years' => 'integer',
    ];

    /**
     * Programme competences linked to this degree.
     */
    public function competences(): HasMany
    {
        return $this->hasMany(ProgrammeCompetence::class);
    }

    /**
     * Course units taught under this degree.
     */
    public function courseUnits(): HasMany
    {
        return $this->hasMany(CourseUnit::class);
    }
}
