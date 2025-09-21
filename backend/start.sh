#!/bin/bash

# Run migrations first
php artisan migrate --force

# Start the Laravel server
php artisan serve --host=0.0.0.0 --port=$PORT