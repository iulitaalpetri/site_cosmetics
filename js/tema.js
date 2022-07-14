

// window.onload= function(){
//     var tema= localStorage.getItem("tema"); 
//     document.getElementById("btn_tema").onclick= function(){
//         document.body.classList.toggle("dark");
//     }
//     if(tema)
//         document.body.classList.add("dark");
//         else 
//         document.body.classList.remove("dark"); 

//     document.getElementById("btn_tema").onclick=functio();
//     var tema= localStorage.getItem("tema");
//     if(tema)
//     localStorage.removeItem("tema");
//     else 
//     localStorage.setItem("tema", "dark");    

//     document.body.classList.toggle("dark");
// }


window.addEventListener("load", function(){//attaches an event handler to an element.
    document.getElementById("btn_tema").onclick=function(){
        var tema = localStorage.getItem("tema");
        if(tema){
            localStorage.removeItem("tema");
            if(tema == "dark"){
                localStorage.setItem("tema", "heart");
                this.classList.toggle("fa-moon");
                this.classList.toggle("fa-heart");//toggle= to switch back and forth between different tabs
                document.body.classList.toggle("dark");
                document.body.classList.toggle("heart");
            }
            else{
                this.classList.toggle("fa-heart");
                this.classList.toggle("fa-sun");
                document.body.classList.toggle("heart");
            }
        }
        else{
            localStorage.setItem("tema", "dark");
            this.classList.toggle("fa-moon")
            this.classList.toggle("fa-sun");
            document.body.classList.toggle("dark");
        }
    }
});

// window.addEventListener("load", function(){
    

//     document.getElementById("btn_tema").onclick= function(){
        
//             var tema= localStorage.getItem("tema");
//             if(tema)
//             localStorage.removeItem("tema");
//     else localStorage.setItem("tema", "dark");
//     document.body.classList.toggle("dark");
//     }
// })