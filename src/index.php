<?php

require_once __DIR__ . '/../vendor/autoload.php';

// Initialize Twig
$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => __DIR__ . '/../cache',
    'auto_reload' => true,
]);

// Simple Router - Get page parameter
$page = $_GET['page'] ?? 'landing';

// Base data available to all templates
$baseData = [
    'app_name' => 'Ticketly',
    'current_year' => date('Y'),
];

// Route handling
switch ($page) {
    case 'landing':
    case 'home':
        $data = array_merge($baseData, [
            'title' => 'Ticketly - Ticket Management Made Simple',
            'description' => 'Streamline your workflow with our powerful, intuitive ticket management system.',
        ]);
        echo $twig->render('landing.twig', $data);
        break;
    
    case 'login':
        $data = array_merge($baseData, [
            'title' => 'Login - Ticketly',
        ]);
        echo $twig->render('login.twig', $data);
        break;
    
    case 'register':
    case 'signup':
        $data = array_merge($baseData, [
            'title' => 'Sign Up - Ticketly',
        ]);
        echo $twig->render('register.twig', $data);
        break;
    
    case 'dashboard':
        $data = array_merge($baseData, [
            'title' => 'Dashboard - Ticketly',
        ]);
        echo $twig->render('dashboard.twig', $data);
        break;
    
    case 'tickets':
        $data = array_merge($baseData, [
            'title' => 'Ticket Management - Ticketly',
        ]);
        echo $twig->render('tickets.twig', $data);
        break;
    
    default:
        // 404 - redirect to landing
        header('Location: /');
        exit;
}
