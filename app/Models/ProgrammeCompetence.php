<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgrammeCompetence extends Model
{
    use HasFactory;

    protected $fillable = [
        'programme_id',
        'code',
        'title',
        'description',
        'category',
    ];

    public function programme(): BelongsTo
    {
        return $this->belongsTo(Programme::class);
    }

    public function outcomeLinks(): HasMany
    {
        return $this->hasMany(OutcomeCompetenceLink::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(AlignmentFlag::class);
    }
}
