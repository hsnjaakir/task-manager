# task-manager-backend/Dockerfile
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files and install dependencies
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the Laravel app
COPY . .

# Finish installing dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions for storage and bootstrap/cache
RUN chown -R www-data:www-data storage bootstrap/cache

# Expose PHP-FPM port
EXPOSE 9000

CMD ["php-fpm"]
