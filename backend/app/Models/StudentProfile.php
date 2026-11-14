<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
   protected $fillable = [
    'user_id',
    'education_level',
    'bac_stream',
    'college_stream',
    'diploma',
    'specialization',
    'city',
    's1',
    's2',
    's3',
    's4',
    'fields',
];

    protected function casts(): array
    {
        return [
            's1' => 'decimal:2',
            's2' => 'decimal:2',
            's3' => 'decimal:2',
            's4' => 'decimal:2',
            'fields' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
