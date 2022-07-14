window.onload=function(){

    function sorteaza(semn){
        var articole=document.getElementsByClassName("elev");
        var v_articole= Array.from(articole);
        v_articole.sort(function(a,b){
            let media_a=parseInt(a.getElementsByClassName("val-media")[0].innerHTML);
            let media_b=parseInt(b.getElementsByClassName("val-media")[0].innerHTML);


            
            if(media_a!=media_b)
                return semn*(media_a - media_b);
            else{
                let nume_a=a.getElementsByClassName("val-nume")[0].innerHTML; 
                let nume_b=b.getElementsByClassName("val-nume")[0].innerHTML;
            
                return semn*nume_a.localeCompare(nume_b);
            }
            
        })
        for(let art of v_articole){
            art.parentElement.appendChild(art);
        }
    }
    
    document.getElementById("sortare").onclick=function(){
        var butoaneRadio=document.getElementsByName("gr_rad");
        for(let rad of butoaneRadio){
            if(rad.checked){
                var valSortare=rad.value;
                break;
            }
        }
        if(valSortare=="ascendent"){
            sorteaza(1);
        }
        else if(valSortare=="descendent"){
            sorteaza(-1);
        }
    }
    document.getElementById("filtrare").onclick=function(){
        var optiuniCulori = document.getElementById("i_sel_simplu").options;
        var valCuloare;
        for(let opt of optiuniCulori){
            if(opt.selected){
                valCuloare = opt.value;
                break;
            } 
        }
        var articole=document.getElementsByClassName("jucarie");
        for(let art of articole){
            art.style.display="none";
            let culoriArt1=art.getElementsByClassName("val-culori");
            
            
            culoriArt = [];
            for(let culoare of culoriArt1)
            {             
                var c = culoare.innerHTML;   
                culoriArt.push(c.substring(1,c.length).trim());
            }          
            let cond = false;
            if(valCuloare == "toate")
                cond = true;
            else{
            for(let c of culoriArt){
                if(valCuloare==c)
                    {
                        cond = true;
                        break;
                    }
            }}
            
            if(cond)
                art.style.display="grid";
        }
        setTimeout(function(){
            for(let art of articole)
                art.style.display = "grid";
                document.getElementById("sel-toate").selected=true;

        }, 5000)
    }
    var jucarii = document.getElementsByClassName("jucarie");
    for(let j of jucarii)
    {
        j.onclick = function(){
            j.style.border = "solid 10px green";
            j.style.borderStyle= "dotted";
            j.onclick = function(){
                j.style.border = "none";
                j.style.borderStyle= "none";
            }
        }
    }
}