<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\UserBookDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AiPicksController extends Controller
{
    public function getAiPicks(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User not authenticated'
                ], 401);
            }

            // Get user's downloaded books
            $downloadedBooks = UserBookDownload::where('user_id', $user->id)
                ->with('book')
                ->get();

            // If user has no downloaded books, return empty state
            if ($downloadedBooks->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => [],
                    'message' => 'Download books to get recommended by AI',
                    'has_downloads' => false
                ]);
            }

            // Extract downloaded book IDs for exclusion
            $downloadedBookIds = $downloadedBooks->pluck('book_id')->toArray();

            // Get all books except the ones user already downloaded
            $availableBooks = Book::whereNotIn('id', $downloadedBookIds)->get();

            if ($availableBooks->isEmpty()) {
                return response()->json([
                    'status' => 'success',
                    'data' => [],
                    'message' => 'No more books available for recommendation',
                    'has_downloads' => true
                ]);
            }

            // Get AI recommendations using embeddings
            $recommendations = $this->getEmbeddingBasedRecommendations($downloadedBooks, $availableBooks);

            return response()->json([
                'status' => 'success',
                'data' => $recommendations,
                'message' => 'AI recommendations based on your downloaded books',
                'has_downloads' => true,
                'total_recommendations' => count($recommendations)
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting AI picks: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to get AI recommendations'
            ], 500);
        }
    }

    private function getEmbeddingBasedRecommendations($downloadedBooks, $availableBooks)
    {
        try {
            // Step 1: Get embeddings from downloaded books
            $downloadedEmbeddings = [];
            foreach ($downloadedBooks as $download) {
                $embedding = $download->book->embedding;
                if ($embedding && is_array($embedding)) {
                    $downloadedEmbeddings[] = $embedding;
                }
            }

            // If no embeddings available, fall back to genre-based recommendations
            if (empty($downloadedEmbeddings)) {
                return $this->genreBasedFallback($downloadedBooks, $availableBooks);
            }

            // Step 2: Calculate user's preference profile (average of downloaded book embeddings)
            $userProfile = $this->calculateUserProfile($downloadedEmbeddings);

            // Step 3: Calculate similarity scores for all available books
            $bookScores = [];
            foreach ($availableBooks as $book) {
                if ($book->embedding && is_array($book->embedding)) {
                    $similarity = $this->calculateCosineSimilarity($userProfile, $book->embedding);
                    $bookScores[] = [
                        'book' => $book,
                        'similarity' => $similarity
                    ];
                }
            }

            // Step 4: Sort by similarity score and return top 5
            usort($bookScores, function($a, $b) {
                return $b['similarity'] <=> $a['similarity'];
            });

            // Step 5: Extract books and limit to top 5
            $recommendations = array_slice(array_column($bookScores, 'book'), 0, 5);

            return $recommendations;

        } catch (\Exception $e) {
            Log::error('Embedding-based recommendation error: ' . $e->getMessage());
            // Fallback to genre-based recommendations
            return $this->genreBasedFallback($downloadedBooks, $availableBooks);
        }
    }

    /**
     * Calculate user preference profile by averaging downloaded book embeddings
     */
    private function calculateUserProfile($embeddings)
    {
        $dimensions = count($embeddings[0]);
        $userProfile = array_fill(0, $dimensions, 0);

        // Sum all embeddings
        foreach ($embeddings as $embedding) {
            for ($i = 0; $i < $dimensions; $i++) {
                $userProfile[$i] += $embedding[$i];
            }
        }

        // Calculate average
        $count = count($embeddings);
        for ($i = 0; $i < $dimensions; $i++) {
            $userProfile[$i] = $userProfile[$i] / $count;
        }

        return $userProfile;
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private function calculateCosineSimilarity($vector1, $vector2)
    {
        if (count($vector1) !== count($vector2)) {
            return 0;
        }

        $dotProduct = 0;
        $magnitude1 = 0;
        $magnitude2 = 0;

        for ($i = 0; $i < count($vector1); $i++) {
            $dotProduct += $vector1[$i] * $vector2[$i];
            $magnitude1 += $vector1[$i] * $vector1[$i];
            $magnitude2 += $vector2[$i] * $vector2[$i];
        }

        $magnitude1 = sqrt($magnitude1);
        $magnitude2 = sqrt($magnitude2);

        if ($magnitude1 == 0 || $magnitude2 == 0) {
            return 0;
        }

        return $dotProduct / ($magnitude1 * $magnitude2);
    }

    /**
     * Fallback recommendation based on genre similarity
     */
    private function genreBasedFallback($downloadedBooks, $availableBooks)
    {
        try {
            // Get genres from downloaded books
            $preferredGenres = $downloadedBooks->pluck('book.genre')->unique()->toArray();
            
            // Find books in similar genres
            $genreMatches = $availableBooks->filter(function ($book) use ($preferredGenres) {
                return in_array($book->genre, $preferredGenres);
            });

            // If we have genre matches, return them sorted by rating
            if ($genreMatches->count() > 0) {
                return $genreMatches->sortByDesc('rating')->take(5)->values()->toArray();
            }

            // Ultimate fallback: return highest rated books
            return $availableBooks->sortByDesc('rating')->take(5)->values()->toArray();

        } catch (\Exception $e) {
            Log::error('Genre-based fallback error: ' . $e->getMessage());
            // Final fallback: return first 5 books
            return $availableBooks->take(5)->values()->toArray();
        }
    }
}