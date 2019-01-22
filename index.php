<?php

require_once 'vendor/autoload.php';

$router = new AltoRouter();

/**Création des routes */

$router->map('GET', '/autoload/npm', ['c' => 'HomeController', 'a' => 'index']);

$match = $router->match();

if($match == false){
    $controller = 'App\\Controller\\HomeController';
    $action = 'error';
    $params = [];
}else {
    $controller = 'App\\Controller\\'.$match['target']['c'];
    $action = $match['target']['a'];
    $params = $match['params'];
}

$object = new $controller();
$print = $object->{$action}($params);

echo($print);
?>