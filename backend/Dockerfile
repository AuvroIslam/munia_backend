# Use official PHP image
FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Clear any cached config before composer operations
RUN rm -rf bootstrap/cache/*.php

# Run composer scripts
RUN composer dump-autoload --optimize

# Create required directories and set permissions
RUN mkdir -p /app/storage/logs \
    && mkdir -p /app/storage/framework/cache \
    && mkdir -p /app/storage/framework/sessions \
    && mkdir -p /app/storage/framework/views \
    && mkdir -p /app/bootstrap/cache \
    && chmod -R 775 /app/storage \
    && chmod -R 775 /app/bootstrap/cache

# Expose port (Render will set this via $PORT)
EXPOSE $PORT

# Create startup script
RUN echo '#!/bin/bash\nphp artisan config:cache\nphp artisan route:cache\nphp artisan view:cache\nphp artisan migrate --force\nphp artisan serve --host=0.0.0.0 --port=${PORT:-8000}' > /app/start.sh \
    && chmod +x /app/start.sh

# Start command
CMD ["/app/start.sh"]