<?php

namespace App\Services;
use Illuminate\Support\Facades\Http;


class EmbeddingService
{
    protected string $apikey;
    protected string $baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent";

    public function __construct()
    {
        $this->apikey = env('GEMINI_API_KEY');
    }

    public function embedText(string $text): array {
        $response = Http::withHeaders([
        'x-goog-api-key' => env('GEMINI_API_KEY'),
        'Content-Type' => 'application/json',
        ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent', [
        'content' => [
            'parts' => [
                ['text' => $text],
        ]
        ],
        'taskType' => 'SEMANTIC_SIMILARITY',
        'outputDimensionality' => 768
        ]);

        if ($response->failed()) {
            return [];
        }
        $json = $response->json();
        return $json['embedding']['values'] ?? [];
    }


    public function embedBatch(array $texts): array {
        $contents = array_map(fn($t) => ["parts" => [["text" => $t]]], $texts);

        $response = Http::withHeaders([
            'Content-Type' => 'application/json',
            'x-goog-api-key' => $this->apikey
        ])->post($this->baseUrl, [
            "contents" => $contents,
            "embedding_config" => [
                "task_type" => "SEMANTIC_SIMILARITY",
                "output_dimensionality" => 768
            ]
            ]);

            if ($response->failed()) {
                return [];
            }
            $json = $response->json();

            return array_map(fn($e) => $e['embedding']['values'] ?? [], $json['embeddings'] ?? []);
    }
    
}
