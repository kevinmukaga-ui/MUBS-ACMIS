<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IndustryEvidence extends Model
{
    use HasFactory;

    protected $table = 'industry_evidence';

    protected $fillable = [
        'source_type',
        'title',
        'organization',
        'publication_date',
        'target_field',
        'extracted_competences',
        'full_text',
    ];

    protected $casts = [
        'publication_date' => 'date',
        'extracted_competences' => 'array',
    ];
}
