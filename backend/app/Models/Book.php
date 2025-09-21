<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'author',
        'description',
        'genre',
        'price',
        'is_free',
        'rating',
        'cover_image',
        'pdf_file_path',
        'isbn',
        'publication_date',
        'featured',
        'editors_pick',
        'embedding',
        'cloud_url'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
        'is_free' => 'boolean',
        'featured' => 'boolean',
        'editors_pick' => 'boolean',
        'publication_date' => 'date',
        'embedding' => 'array',
    ];

    /**
     * Get the users who downloaded this book.
     */
    public function downloadedByUsers()
    {
        return $this->belongsToMany(User::class, 'user_book_downloads')
                    ->withPivot('downloaded_at')
                    ->withTimestamps();
    }

    /**
     * Get the download records for this book.
     */
    public function userDownloads()
    {
        return $this->hasMany(UserBookDownload::class);
    }
}
