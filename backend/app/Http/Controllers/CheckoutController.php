<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;

class CheckoutController extends Controller
{
    /**
     * Create a new Stripe Checkout Session for a subscription.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|string',
        ]);

        $user = $request->user();

        // Map the plan_id from the frontend to the correct Stripe Price ID from your backend .env file
        $priceIdMapping = [
            'premium_monthly' => env('STRIPE_PRICE_PREMIUM_MONTHLY'),
            'premium_yearly' => env('STRIPE_PRICE_PREMIUM_YEARLY'),
        ];

        // Check if the plan_id exists in our mapping
        if (!isset($priceIdMapping[$request->plan_id])) {
            return response()->json(['error' => 'Invalid plan ID provided.'], 400);
        }

        $priceId = $priceIdMapping[$request->plan_id];

        // 🚀 CRITICAL NEW LOGIC: Check for an existing, active subscription for the requested plan.
        if ($user->subscribed('default', $priceId)) {
            return response()->json([
                'error' => 'You are already subscribed to this plan.'
            ], 403); // Use a 403 Forbidden status code
        }

        try {
            $checkoutSession = $user->newSubscription('default', $priceId)
                ->checkout([
                    // This is the crucial change. It redirects the user to your frontend's AI features page.
                    'success_url' => 'http://localhost:5173/ai-features?session_id={CHECKOUT_SESSION_ID}',
                    'cancel_url' => config('app.url') . '/payment/cancel',
                ]);

            return response()->json(['url' => $checkoutSession->url]);

        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to create checkout session.'], 500);
        }
    }
}