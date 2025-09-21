<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ChatController; // <-- added
use App\Http\Controllers\AiPicksController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CheckoutController;
use Laravel\Cashier\Http\Controllers\WebhookController;
use App\Http\Controllers\PaymentController;



// Auth routes
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/verify-otp', [AuthController::class, 'verifyOtp'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Chatbot endpoint (public; throttle to avoid abuse)
Route::post('/chat', [ChatController::class, 'ask'])->middleware('throttle:20,1');

// Book routes (public)
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{id}', [BookController::class, 'show']);
Route::get('/books/featured/list', [BookController::class, 'getFeatured']);
Route::get('/books/free/list', [BookController::class, 'getFreeBooks']);
Route::get('/books/picks/list', [BookController::class, 'getEditorsPicks']);

// Semantic Search
Route::get('/semantic-search', [SearchController::class, 'semanticSearch']);

// Temporary seeder route for testing
Route::get('/seed-books', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'BookSeeder']);
        return response()->json(['message' => 'Books seeded successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Stripe Webhook Route
Route::post('/stripe/webhook', [WebhookController::class, 'handleWebhook']);

// Add this new line
Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/books/{id}/download', [BookController::class, 'downloadPdf']);
    Route::post('/books', [BookController::class, 'store']);
    Route::post('/checkout', [CheckoutController::class, 'create']);
    Route::get('/ai-picks', [AiPicksController::class, 'getAiPicks']);
});
