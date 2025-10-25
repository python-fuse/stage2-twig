<?php
// Router for PHP built-in server

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Serve static files from public directory
if ($uri !== '/' && file_exists(__DIR__ . '/public' . $uri)) {
    return false; // Let PHP's built-in server handle it
}

// Otherwise, route to index.php
require_once __DIR__ . '/src/index.php';
