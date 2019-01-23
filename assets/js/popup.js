function PopupCentrer(page,largeur,hauteur,options) { 
    var top=(screen.height-hauteur)/2; 
    var left=(screen.width-largeur)/2; 

    window.open(page,"","top="+top+",left="+left+",width="+largeur+",height="+hauteur+","+options); 
} 