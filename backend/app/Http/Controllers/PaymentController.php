<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Exception;
use Stripe\Stripe;

class PaymentController extends Controller
{
    public function success(Request $request)
    {
        // Check for the Stripe session ID in the URL
        if (!$request->has('session_id')) {
            return redirect()->to('/')->with('error', 'Payment session ID not found.');
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        try {
            // Retrieve the Stripe Checkout Session
            $session = \Stripe\Checkout\Session::retrieve($request->session_id);

            // You can now access the customer and subscription details
            $user = \App\Models\User::where('stripe_id', $session->customer)->first();

            if ($user) {
                // Payment was successful. You can log this, send a confirmation email, etc.
                // The subscription is already created by the Stripe webhook, but this confirms the redirect.

                return redirect()->to('/')->with('success', 'Your subscription is now active!'); // Redirect to a success page
            } else {
                return redirect()->to('/')->with('error', 'User not found in our system.');
            }

        } catch (Exception $e) {
            // Handle Stripe API errors or invalid session ID
            return redirect()->to('/')->with('error', 'Payment verification failed: ' . $e->getMessage());
        }
    }
}