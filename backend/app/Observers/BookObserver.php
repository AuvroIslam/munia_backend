<?php

namespace App\Observers;

use App\Models\Book;
use App\Services\EmbeddingService;

class BookObserver
{
    //

    public function created(Book $book) {
        $text = $book->title . ' ' . $book->author . ' ' . $book->description;
        
        $embeddingService = new EmbeddingService();

        $embedding = $embeddingService->embedText($text);

        if (!empty($embedding)) {
            $book->embedding = "[" . implode(',', $embedding) . "]";
            $book->saveQuietly();
        }
    }
}
