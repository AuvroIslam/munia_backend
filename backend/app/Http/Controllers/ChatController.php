<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Gemini\Laravel\Facades\Gemini;

class ChatController extends Controller
{
    /**
     * Accepts: { message: string, (optional) history: [{role: 'user'|'assistant', content: '...'}] }
     * Returns: { reply: "..." }
     */
    public function ask(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:5000',
            'history' => 'nullable|array',
        ]);

        $message = $request->input('message');
        $history = $request->input('history', []);

        // model - either from config/gemini.php or env fallback
        $model = config('gemini.model', env('GEMINI_MODEL', 'gemini-2.5-flash'));

        // If you want to send multi-turn context, we can stitch a simple textual context:
        // (Gemini supports more advanced multi-turns / conversation structures if you choose.)
        if (!empty($history) && is_array($history)) {
            $contextLines = [];
            foreach ($history as $h) {
                $role = $h['role'] ?? 'user';
                $content = $h['content'] ?? '';
                $contextLines[] = ucfirst($role) . ': ' . $content;
            }
            $context = implode("\n", $contextLines) . "\nUser: " . $message;
            $prompt = $context;
        } else {
            $prompt = $message;
        }

        try {
            // Use the Laravel Gemini facade to call the gemini model.
            // The client supports passing a string prompt (simple case).
            // The facade returns an object with ->text() per package docs.
            $result = Gemini::generativeModel(model: $model)->generateContent($prompt);

            // Try to get a textual reply robustly
            if (is_object($result) && method_exists($result, 'text')) {
                $reply = $result->text();
            } elseif (is_array($result)) {
                // fallback: parse typical REST response structure
                $reply = $result['candidates'][0]['content']['parts'][0]['text'] ?? json_encode($result);
            } else {
                $reply = (string) $result;
            }

            return response()->json([
                'reply' => $reply,
            ]);
        } catch (\Exception $e) {
            // log full error for debugging; return safe message to client
            Log::error('Gemini request failed: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return response()->json([
                'error' => 'AI request failed',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
