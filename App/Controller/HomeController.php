<?php

namespace App\Controller;

use \Twig_Loader_Filesystem;
use \Twig_Environment;

class HomeController
{
    private $loader;
    private $twig;


    public function __construct(){
        $this->loader= new Twig_Loader_Filesystem('View');
        $this->twig = new Twig_Environment($this->loader);
    }

    /**Route*/
    public function index(){
        return $this->twig->render('base.html.twig');
    }

    public function error(){
        return $this->twig->render('404.html.twig');
    }
    
}



?>