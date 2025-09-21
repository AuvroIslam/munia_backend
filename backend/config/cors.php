<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This determines what cross-origin operations may execute in web browsers.
    | Adjust these settings according to your frontend URLs.
    |
    */

    'paths' => [
        'api/*', 
        'sanctum/csrf-cookie'
    ],

    // Allow all common HTTP methods
    'allowed_methods' => ['*'],

    // Add all Vite dev servers & production domain (if you have one later)
    'allowed_origins' => [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:5176',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:5175',
        'http://127.0.0.1:5176',
    ],

    'allowed_origins_patterns' => [],

    // Allow all headers
    'allowed_headers' => ['*'],

    // You can expose headers if you need (empty for now)
    'exposed_headers' => [],

    // Browser will cache CORS response for 1 hour
    'max_age' => 3600,

    // Enable credentials (important for cookies, tokens, auth headers)
    'supports_credentials' => true,

];
