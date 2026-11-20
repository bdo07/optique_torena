<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_fr',
        'title_ar',
        'description_fr',
        'description_ar',
        'discount_percentage',
        'promotional_price',
        'cta_text_fr',
        'cta_text_ar',
        'cta_link',
        'banner_image_url',
        'start_date',
        'end_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'discount_percentage' => 'integer',
            'promotional_price' => 'float',
            'start_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }
}
