window.addEventListener("DOMContentLoaded", function(){
    checkBanner();
})

function setCookie(nume, val, timpExp, path="/"){
    d = new Date();
    d.setTime(new Date().getTime()+timpExp);
    document.cookie = `${nume} = ${val}; expires = ${d.toUTCString()}; path = ${path}`;
}

function getCookie(nume){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        c = c.trim();
        if(c.startsWith(nume+"=")){
            return c.substring(nume.lenght + 1);
        }
    }
}

function deleteCookie(nume){
    setCookie(nume, "", 0);
}

function deleteAllCookies(){
    var vectCookies = document.cookie.split(";");
    for(let c of vectCookies){
        deleteCookie(c.split("=")[0]);
    }
}

function checkBanner(){
    if(getCookie("acceptat_banner")){
        document.getElementById("banner").style.display="none";
    }
    else{
        ///document.getElementById("banner").style.display="block";
        document.getElementById("banner").classList.add("active");
        document.getElementById("ok_cookies").onclick = function(){
            document.getElementById("banner").classList.remove("active");
            setCookie("acceptat_banner", "true", 40000);
            ///document.getElementById("banner").style.display = "none";
        }
    }
}
/* timer cookie jumatate de zi = 86400000/2*/