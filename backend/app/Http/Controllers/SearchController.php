<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\EmbeddingService;

class SearchController extends Controller
{
    //

    public function semanticSearch(Request $request) {
        $query = $request->input('q');
        $limit = $request->input('limit', 10);
        
        $embeddingService = new EmbeddingService();
        $queryEmbedding = $embeddingService->embedText($query);

        if (empty($queryEmbedding)) {
            return response()->json([]);
        }

        // Get all books with embeddings
        $books = DB::select("
            SELECT id, title, author, description, embedding 
            FROM books 
            WHERE embedding IS NOT NULL
        ");

        $results = [];
        
        // Calculate cosine similarity for each book
        foreach ($books as $book) {
            $bookEmbedding = json_decode($book->embedding, true);
            
            if (!empty($bookEmbedding)) {
                $similarity = $this->cosineSimilarity($queryEmbedding, $bookEmbedding);
                
                $results[] = [
                    'id' => $book->id,
                    'title' => $book->title,
                    'author' => $book->author,
                    'description' => $book->description,
                    'similarity' => $similarity,
                    'distance' => 1 - $similarity // Convert to distance (lower is better)
                ];
            }
        }

        // Sort by similarity (highest first) and limit results
        usort($results, function($a, $b) {
            return $b['similarity'] <=> $a['similarity'];
        });

        return response()->json(array_slice($results, 0, $limit));
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private function cosineSimilarity(array $vectorA, array $vectorB): float
    {
        if (count($vectorA) !== count($vectorB)) {
            return 0;
        }

        $dotProduct = 0;
        $magnitudeA = 0;
        $magnitudeB = 0;

        for ($i = 0; $i < count($vectorA); $i++) {
            $dotProduct += $vectorA[$i] * $vectorB[$i];
            $magnitudeA += $vectorA[$i] * $vectorA[$i];
            $magnitudeB += $vectorB[$i] * $vectorB[$i];
        }

        $magnitudeA = sqrt($magnitudeA);
        $magnitudeB = sqrt($magnitudeB);

        if ($magnitudeA == 0 || $magnitudeB == 0) {
            return 0;
        }

        return $dotProduct / ($magnitudeA * $magnitudeB);
    }
}
