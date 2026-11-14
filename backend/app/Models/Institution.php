<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Institution extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'acronym',
        'institution_type',
        'sector',
        'city',
        'region',
        'website',
        'admissions_url',
        'official_source_url',
        'verification_status',
        'last_verified',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'last_verified' => 'date',
            'is_active' => 'boolean',
        ];
    }

    public function formations(): HasMany
    {
        return $this->hasMany(Formation::class);
    }
}
