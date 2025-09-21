<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserBookDownload extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'book_id',
        'downloaded_at'
    ];

    protected $casts = [
        'downloaded_at' => 'datetime',
    ];

    /**
     * Get the user that downloaded the book.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the book that was downloaded.
     */
    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}