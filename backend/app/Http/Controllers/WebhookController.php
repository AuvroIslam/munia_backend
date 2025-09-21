<?php

namespace App\Http\Controllers;

use Laravel\Cashier\Http\Controllers\WebhookController as CashierController;
use App\Models\User; // Make sure to import your User model
use Illuminate\Support\Facades\Log; // For logging events

class WebhookController extends CashierController
{
    /**
     * Handle a completed checkout session.
     * This event is triggered for both one-time payments and new subscriptions.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleCheckoutSessionCompleted(array $payload)
    {
        Log::info('Handling checkout.session.completed event.', ['payload' => $payload]);

        $customerId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $customerId)->first();

        if ($user) {
            // Check if the user's subscription has been created and is active.
            // Laravel Cashier should have already done this via the 'customer.subscription.created' event.
            // This is an additional safety check.

            if ($user->subscribed('default')) {
                // The user is already subscribed, no need to do anything.
                Log::info("User with Stripe ID {$customerId} is already subscribed. No action needed.");
            } else {
                // If for some reason the subscription hasn't been recorded yet, you can handle it here.
                Log::warning("User with Stripe ID {$customerId} paid but is not subscribed yet. Manual intervention may be needed.");
                // You could trigger an event or a job here to sync the subscription.
            }
        } else {
            Log::error("User not found for Stripe customer ID {$customerId}.");
        }

        return $this->successMethod();
    }

    /**
     * Handle invoice payment succeeded.
     * This event is triggered for recurring subscription payments.
     *
     * @param  array  $payload
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function handleInvoicePaymentSucceeded(array $payload)
    {
        Log::info('Handling invoice.payment_succeeded event.', ['payload' => $payload]);
        
        $customerId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $customerId)->first();
        
        if ($user) {
            // This confirms a recurring payment has been made, ensuring the subscription remains active.
            // Cashier automatically updates the subscription's 'ends_at' date.
            // You can add custom logic here, like sending a "Thank You" email.
            Log::info("Recurring payment succeeded for user with ID {$user->id}.");
        } else {
            Log::error("User not found for Stripe customer ID {$customerId}.");
        }

        return $this->successMethod();
    }
}