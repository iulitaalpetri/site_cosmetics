window.addEventListener("DOMContentLoadede", function(){
    checkBanner();
})

function setCookie(nume, val, timp_expirare, path= "/"){// timp exp e dat in msec
    d= new Date();
    d.setTime(d.getTime()+ timp_expirare); 
    document.cookie =`${nume}= ${val}; expires=${d.toUTCString()}; path= ${path}` ;  // adauga, nu suprascrie 


}
function getcookie(nume){
    v_cookie= document.cookie.split(";");
    for(let c of v_cookie){
        c= c.trim();                 //strip din pyth         
        if(c.startsWith(nume+"=")) 
            return c.substring(nume.length+ 1) ;

    }
}
function deletecookie(nume){
    setCookie(nume, "", 0);
}// fctia verifica faptul ca exista cookie ul "acceptat banner"
//caz in care ascindem bannerul. Daca nu exista, afisam bannerul  setam o fctie prin care agaugam cookie prin click 

function check_banner(){
    let val_cookie= getcookie("acceptat_banner");
    if(val_cookie){
        document.getElementById("banner").style.display= "none";
    }
    else{
        document.getElementById("banner").style.display="block";
        document.getElementById("ok_cookies").onclick= function(){
            setCookie("acceptat_banner", "true", 5000);
            document.getElementById("banner").style.display="none";

        }
    }
}