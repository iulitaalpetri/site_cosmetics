window.addEventListener("load",function(){

	let prod_sel = localStorage.getItem("cos_virtual");
	if (prod_sel){
		var vect_ids=prod_sel.split(",");
		fetch("/produse_cos", {		

			method: "POST",
			headers:{'Content-Type': 'application/json'},
			
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				a:10,
				b:20,
				ids_prod: vect_ids
			})
		})
		.then(function(rasp){ console.log(rasp); x=rasp.json(); console.log(x); return x})
		.then(function(objson) {
			let main = document.getElementsByTagName("main")[0];
			let btn = document.getElementById("cumpara");

			console.log(objson);
			for (let prod of objson){
				let article = document.createElement("article");
				article.classList.add("cos-virtual");
				var h2 = document.createElement("h2");
				h2.innerHTML = prod.nume;
				article.appendChild(h2);
				let imagine = document.createElement("img");
				imagine.src = "/Resurse/imagini/produse/"+prod.imagine;
				article.appendChild(imagine);
				let descriere = document.createElement("p");
				descriere.innerHTML = prod.descriere + "<br><b>Price: </b>"+prod.pret+"<br>";
				let buton_del = document.createElement("button");
				buton_del.innerHTML = "Delete product";
				buton_del.value = prod.id.toString();
				buton_del.onclick = function(){
					var vect_ids=prod_sel.split(",");
					var index = vect_ids.indexOf(buton_del.value);
                        if (index !== -1) {
                            vect_ids.splice(index, 1);
                        }
					localStorage.setItem("cos_virtual", vect_ids.join(","));
					document.location.reload(true);
				};
				descriere.appendChild(buton_del);
				article.appendChild(descriere);
				main.insertBefore(article, btn);
				/* TO DO 
				pentru fiecare produs, creăm un articol in care afisam imaginea si cateva date precum:
				- nume, pret, imagine, si alte caracteristici

				
				document.getElementsByTagName("main")[0].insertBefore(divCos, document.getElementById("cumpara"));
				*/
			}
	
		}
		).catch(function(err){console.log(err)});



		document.getElementById("cumpara").onclick=function(){
				//TO DO: preluare vector id-uri din localStorage

				

				var vect_ids=prod_sel.split(",");
				///de selectat id-uri

			fetch("/cumpara", {		
	
				method: "POST",
				headers:{'Content-Type': 'application/json'},
				
				mode: 'cors',		
				cache: 'default',
				body: JSON.stringify({
					ids_prod: vect_ids
				})
			})
			.then(function(rasp){ console.log(rasp); return rasp.text()})
			.then(function(raspunsText) {
		   
				console.log(raspunsText);
				//Ștergem conținutul paginii
				//creăm un paragraf în care scriem răspunsul de la server
				//Dacă utilizatorul e logat și cumpărarea a reușit, 
				
				let p=document.createElement("p");
				p.innerHTML=raspunsText;
				document.getElementsByTagName("main")[0].innerHTML="";
				document.getElementsByTagName("main")[0].appendChild(p)
				if(!raspunsText.includes("Please log in"))
					localStorage.removeItem("cos_virtual");
		   
			}
			).catch(function(err){console.log(err)});
		}
	}
	else{
		document.getElementsByTagName("main")[0].innerHTML="<p>Basket is empty!</p>";
	}
	
	
});