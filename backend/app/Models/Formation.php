<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Formation extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'degree',
        'institution',
        'institution_type',
        'city',
        'region',
        'education_levels',
        'accepted_streams',
        'fields',
        'admission_conditions',
        'admission_method',
        'minimum_average',
        'official_url',
        'source_name',
        'last_verified',
        'is_active',
        'accepted_diplomas',
        'accepted_specializations',
        'academic_year',
'verification_status',
'application_status',
'application_start_date',
'application_end_date',
    ];

protected function casts(): array
{
    return [
        'education_levels' => 'array',
        'accepted_streams' => 'array',
        'fields' => 'array',
        'admission_conditions' => 'array',
        'minimum_average' => 'decimal:2',
        'last_verified' => 'date',
        'is_active' => 'boolean',
        'accepted_diplomas' => 'array',
        'accepted_specializations' => 'array',
        'academic_year' => 'string',
        'verification_status' => 'string',
        'application_status' => 'string',
        'application_start_date' => 'date',
        'application_end_date' => 'date',
    ];
}
public function institution(): BelongsTo
{
    return $this->belongsTo(Institution::class);
}
}