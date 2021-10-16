FROM php:7.4-apache

COPY ./src /var/www/html

RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

COPY /php.ini /usr/local/etc/php/

EXPOSE 80

