<?php

require_once __DIR__ . '/../vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader(__DIR__ . '/../templates');
$twig = new \Twig\Environment($loader, [
    'cache' => __DIR__ . '/../cache',
    'auto_reload' => true,
]);

$data= [
    'app_name' =>"Ticketly",
    'description' =>"Ticket Management Made Simple.",
];

echo $twig->render('landing.twig', $data);