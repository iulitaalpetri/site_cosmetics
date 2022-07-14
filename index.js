
const express= require("express");
const fs=require("fs");
const sharp=require("sharp");
const ejs=require("ejs");
const {Client}= require("pg");
var client= new Client({user:"iulita", password:"12345", database:"db_test", host:"localhost", port: 5432});
client.connect();
const formidable= require('formidable');
const crypto= require('crypto');
const session= require('express-session'); 
const sass= require("sass");
const nodemailer= require('nodemailer');
const { request } = require("http");
const  path = require("path"); 
const html_to_pdf= require('html-pdf-node'); 
const juice= require('juice'); 
var QRCode= require('qrcode'); 
const helmet= require('helmet') ; 
const mongodb= require('mongodb'); 
const { CallTracker } = require("assert");
const xmljs = require('xml-js');
const socket = require('socket.io');
const bodyParser = require('body-parser');


var url= "mongodb://localhost:27017/";
//---------------------------




// de rezolvat mail ul u setarile alea in gmail 
const obGlobal={
	obImagini:null,
	obErori:null, 
	emailServer:"magazincosmetice123@gmail.com",
    port:8080,
    sirAlphaNum:"",
    protocol:null,
    numeDomeniu:null
};

function genereazaToken(n){
    let token="";
    for(let i=0; i<n;i++){
        token+=obGlobal.sirAlphaNum[Math.random()* obGlobal.sirAlphaNum.length];
    }
    return token;
}


app= express();
//=----------------examen------------
app.get("/jucarie", function(req, res){
    console.log(req.query)
    querySelect="select * from jucarie";
    client.query(querySelect, function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);

        res.render("pagini/jucarie", {jucarie: rezQuery.rows});
    })
})

/*----------------------------cos  virtual------------------*/
app.use(helmet.frameguard());
app.use(["/produse_cos", "/cumpara"], express.json({limit:"2mb"}));// de setat pt req body de tip json, by default limita e 0 

app.post("produse_cos", function(req, res){// postarea prod cos

    console.log(req.body);  
    if(req.body.ids_prod.length!=0){
        let querySelect=`select nume, descriere, pret, imagine from prajituri where id in (${req.body.ids_prod.join(",")}) `; // select ul din baza de date 
        client.query(querySelect, function(err, rezQuery){
            if(err){ console.log(err);
            res.send("Eroare baza de date"); 
        }
            res.send(rezQuery.rows); 
        });
    }
    else res.send([]); 
    
}); 


app.get("/pag/:x/:y/:z",function(req,res)
{console.log(req.params.x+req.params.z); });

//---------------trimitere mail--------------------------------------
async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){// permite executari asincrone
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login 
            user:obGlobal.emailServer,
            pass:"qitdurihoezgghqf"// parola generata
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:obGlobal.emailServer,
        to:email,
        subject:subiect,//"Te-ai inregistrat cu succes",
        text:mesajText, //"Username-ul tau este "+username
        html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
        attachments: atasamente
    })
    console.log("trimis mail");
}
app.set("view engine", "ejs"); 








/* -----------------------accesari--------------*/
function stergeAccesariVechi(){
    var queryDelete="delete from accesari where now()-data_accesare >= interval '10 minutes' ";
    client.query(queryDelete, function(err, rezQuery){
        console.log(err);
    });
}
 
stergeAccesariVechi();
setInterval(stergeAccesariVechi, 10*60*1000)


app.get(["/", "/index", "/home","/login"], function(req, res){
 
 
    querySelect="select username, nume from utilizatori where id in (select distinct user_id from accesari where now()-data_accesare <= interval '5 minutes')"
    client.query(querySelect, function(err, rezQuery){
        useriOnline=[]
        if(err) console.log(err);
        else useriOnline= rezQuery.rows;
      
        res.render("pagini/index", {ip:getIp(req), imagini:obGlobal.obImagini.imagini, useriOnline: useriOnline});
    });

    querySelect = "select username, nume, culoare_chat from utilizatori where utilizatori.id in (select distinct user_id from accesari where now()-data_accesare <= interval '5 minutes')"
    client.query(querySelect, function(err, rezQuery){
        let utiliz_online = [];
        var evenimente=[];
        var locatie="";
        if(err) console.log(err);
        else{
            utiliz_online = rezQuery.rows
        }

    //------------------calendar evenimente-----------------------------------------
      //  request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=109.99.96.15', //se inlocuieste cu req.ip; se testeaza doar pe Heroku
        //     function (error, response, body) {
        //     if(error) {console.error('error:', error)}
        //     else{
        //         var obiectLocatie=JSON.parse(body);
        //         console.log(obiectLocatie);
        //         locatie=obiectLocatie.geobytescountry+" "+obiectLocatie.geobytesregion
        //     }
    
       
        // var texteEvenimente=["Free Delivery", "Christmas", "10% Discount", "50% Discount", "20% Discount"];
        // dataCurenta=new Date();
        // for(i=0;i<texteEvenimente.length;i++){
        //     let data_event = new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*27) );
        //     evenimente.push({data:data_event, text:texteEvenimente[i]});
        // }
        // res.render("pagini/index", {ip:getIp(req), utiliz_online:utiliz_online, evenimente: evenimente, locatie:locatie});
    //});
});
   
})

/*--------------------------------------------*/



client.query("select * from tabel1", function(err, rezQuery){
    if(err)
    console.log(err);
    else
    console.log(rezQuery);
}) 



app.set("view engine","ejs");


app.use("/Resurse", express.static(__dirname+"/Resurse"))

app.use(session({//se creeaza propr session  a requestului- se poate folosi req.session

    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune

    resave: true,

    saveUninitialized: false

  }));
  

console.log("Director proiect:",__dirname);

app.get(["/", "/index", "/home"], function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    console.log(obGlobal.obImagini);
    res.render("pagini/index.ejs", {ip:req.ip, imagini:obGlobal.obImagini.imagini});
    produse: rezQuery.rows;

})

app.get("/eroare", function(req, res){
    randeazaEroare(res, 1, "Titlu schimbat");
});


app.get("/*.ejs", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    //res.status(403).render("pagini/403");
    console.log(new(date(now)));

    randeazaEroare(res, 403, true);
    console.log(new(date(now)));
    
})

/*
app.get("/despre", function(req, res){
    //res.sendFile(__dirname+"/index1.html");
    res.render("pagini/despre");
})
*/
app.get("/ceva", function(req, res, next){
    console.log(new(date(now)));
    res.write("<p style='color:pink'>Salut-1</p>");
    console.log("1");
    next();
    //res.end();
})
app.get("/ceva", function(req, res, next){
    res.write("Salut-2");
   
    console.log("2");
    next();
})


app.use("/*", function(req, res, next){
    res.locals.propGenerala="Ceva care se afiseaza pe toate pg"; 
    res.locals.utilizator=req.session.utilizator;
    res.locals.mesajLogin= req.session.mesajLogin;
    req.session.mesajLogin= null;
    next();

});
 app.get("/*", function(req, res, next){
    console.log("Functie 2");
    let id_utiliz= req.session.utilizator ? req.session.utilizatore.id: null;
    var queryInsert=`insert into accesari(ip, user_id, pagina) values('${getIp(req)}',${id_utiliz}, '${req.url}' )`;
    client.query(queryInsert, function(err, rezQuery){
        if(err) console.log(err);
    });
        next();
    });

    
/*-----------------------------admin----------------------------*/
app.get("/useri", function(req, res){
    if(req.session.utilizator && req.session.utilizator.rol=="admin"){
    client.query("select * frpm utilizatori", function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pagini/useri", {useri:rezQuery.rows});
    });
}
else{
    randeazaEroare(res, 403);
}
});
app.post("/sterge", function(req,res){
    if(req.session.utilizator){
        var formular= new formidable.IncomingForm()
        formular.parse(req, function(err, campuriText, campuriFisier ){
            var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
            console.log("----------");
            let querySel = `select * from utilizatori where username=$1::text and parola=$2::text`;
            console.log(querySel, campuriText.username, parolaCriptata);
            client.query(querySel, [campuriText.username, parolaCriptata], function(err, rezSelect){
                if(rezSelect.rowCount == 0 || err){
                    randeazaEroare(res,2, "Parola gresita", "Parolele nu corespund! Inceraca din nou!");
                }
                else{
                    let queryDel = `delete from accesari where user_id=$1`;
                    console.log("----------");
                    console.log(queryDel, rezSelect.rows[0].id);
                    client.query(queryDel, [rezSelect.rows[0].id], function(err, rezQuery){
                        console.log(rezQuery, err);
                        if(err){
                            randeazaEroare(res,2);
                        }
                        else{
                            let queryDel2 = `delete from utilizatori where id=$1`;
                            client.query(queryDel2, [rezSelect.rows[0].id], function(err, rezQuery){
                                if(err){
                                    randeazaEroare(res,2);
                                }
                                else{
                                    trimiteMail(rezSelect.rows[0].email, `Stergerea contului s-a realizat cu succes!`, "text",`<h2>Hello!</h2><p>Your account has been deleted. Good bye!`);
                                    req.session.destroy();
                                    res.locals.utilizator = null;
                                    res.redirect("/conf-stergere");
                                }
                            })
                        }
                    })
                }
            });
        });
    }else{
        randeazaEroare(403);
    }
});

app.get("/produse", function(req, res){
    console.log(req.query)
  //  console.log(err);
  client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezCateg){
    var cond_where= req.query.tip ? 'tipuri_produse=${req.query.tip}': "1=1";


    client.query("select * from prajituri", function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pagini/produse", {produse: rezQuery.rows, optiuni: rezCateg.rows});
    // de pus la optiuni rezCateg.rows- eroare
    });
    });
});


//--------------------------model elevi
app.get("/elevi", function(req, res){
    console.log(req.query)
    querySelect="select * from elevi";
    client.query(querySelect, function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        console.log((new Date()).getDay());

        res.render("pagini/elevi", {elevi: rezQuery.rows});
    })
})
//----------------------




app.get("/galerie", function(req, res){
    //  console.log(err);
    
          res.render("pagini/galerie.ejs", {ip:req.ip, imagini:obGlobal.obImagini.imagini});
     
  })
app.get("/produs/:id", function(req, res){
    
    console.log(req.params);

    client.query(`select * from prajituri where id=${req.params.id}`, function(err, rezQuery){
        console.log(err);
        console.log(rezQuery);
        res.render("pagini/produs", {prod: rezQuery.rows[0]});
    
    });
});

app.get("/*", function(req, res){
    res.render("pagini"+req.url, function(err, rezRender){
        if (err){
            if(err.message.includes("Failed to lookup view")){
                console.log(err);
                //res.status(404).render("pagini/404");
                randeazaEroare(res, 404, true);
                
            }
            else{
                
                res.render("pagini/eroare_generala");

            }
        }
        else{
            console.log(rezRender);
            res.send(rezRender);
        }
    });
   
    //console.log("generala:",req.url);
    res.end();
})
//-------------------------utilizatori---------------------------
// de adaugat partea cu heroku , ACOlo am obglobal
intervaleAscii=[[48, 57], [65, 90], [97, 122]]; 
obGlobal.sirAlphaNum= ""
for (let interval of intervaleAscii){
    for (let i=interval[0]; i<= interval[1]; i++){
        obGlobal.sirAlphaNum= obGlobal.sirAlphaNum+ String.fromCharCode(i);
    }
}



function getIp( req){//pt heroku
var ip= req.headers["x-forwarded-for"];// ip-ul user ului pt care este dat forward la mail
if(ip){
    let vect= ip.split(",");
    return vect[vect.length- 1];
}
else if( req.ip){
    return req.ip;
}
else {
    return req.connection.remoteAdress;
}
}


parolaServer="tehniciweb";
app.post("/inreg",function(req, res){
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){// parse - transforma json in js
        console.log(campuriText);

        var eroare="";
        if(campuriText.username==""){
            eroare+="Username necompletat. ";
        }
        if(!campuriText.username.match(new RegExp("^[A-Za-z0-9]+$"))){
            eroare+="Username nu corespunde patternului. ";
        }
        if(!eroare){
            queryUtiliz=`select username from utilizatori where username='${campuriText.username}'`;
            client.query(queryUtiliz, function(err, rezUtiliz){
                if (rezUtiliz.rows.length!=0){
                    eroare+="Username-ul mai exista. ";
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
                }
                else{
                    var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
                    var token= genereazaToken(100);
                    var comandaInserare=`insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod) values ('${campuriText.username}','${campuriText.nume}', '${campuriText.prenume}', '${parolaCriptata}', '${campuriText.email}', '${campuriText.culoare_chat}' , '${token}') `;
                    client.query(comandaInserare, function(err, rezInserare){
                        if(err){
                            console.log(err);
                            res.render("pagini/inregistrare", {err: "Eroare baza de date"});
                        }
                        else{
                            res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse"});
                            let linkConfirmare= `${obGlobal.protocol}${obGlobal.numeDomeniu}/cod/${campuriText.username}/${token}`;
                            trimiteMail(campuriText.email, "Te-ai inregistrat", "text",`<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${campuriText.username}.</p><P> Link confirmare:<a href='${linkConfirmare}'>${linkConfirmare}</a></p>`);
                        }
                    });
                    
                }
            })
        }
        else
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
    })
    formular.on("field", function(nume, val){})
    formular.on("fileBegin", function(nume, fisier){}) 
    formular.on("file", function(nume, fisier){})
});

app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
});


app.get("/cod/:username/:token", function(req, res){
    console.log("A ajuns:", req.params.token );
    var comandaUpdate=`update utilizatori set confirmat_mail= true where username='${req.params.username}' and cod='${req.params.token}'`; 
    client.query(comandaUpdate, function(err, rez){
        if(err)
        console.log(err); 
        else{
            res.render("pagini/confirmare");
        }
    })
})
app.post("/login",function(req, res){
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){
        console.log(campuriText);
        var parolaCriptata=crypto.scryptSync(campuriText.parola,parolaServer, 64).toString('hex');
        var querySelect=`select * from utilizatori where username='${campuriText.username}' and parola='${parolaCriptata}' and confirmat_mail= true`;
        var querySelect=`select * from utilizatori where username=$1::text and parola= $2::text and  confirmat_mail= true`;

        console.log(querySelect);
        client.query(querySelect, [campuriText.username, parolaCriptata],function(err, rezSelect){
            if(err){
                console.log(err); 
                randeazaEroare(res, 2);}
            else{
                console.log(rezSelect.rows.length);
                if(rezSelect.rows.length==1){ //daca am utilizatorul si a dat credentiale corecte
                    req.session.utilizator={
                        id:rezSelect.rows[0].id,
                        nume:rezSelect.rows[0].nume,
                        prenume:rezSelect.rows[0].prenume,                        
                        username:rezSelect.rows[0].username,                        
                        email:rezSelect.rows[0].email,
                        culoare_chat:rezSelect.rows[0].culoare_chat,                        
                        rol:rezSelect.rows[0].rol
                    }
                    res.redirect("/index");
                    
                }
                else{
                    req.session.mesajLogin= "Login esuat";
                    res.redirect("/index");
                }
            }
        } )
    })
});
app.get("/logout", function(req, res){
    req.session.destroy();
    res.locals.utilizator=null;
    res.render("pagini/logout");
})



/* ------------------------------Update profil----------------------*/ 
app.post("/profil", function(req, res){
    console.log("profil");
    if(!req.session.utilizator){
        res.render("pagini/eroare", {mesaj: "Nu sunteti logat"}); 
        return ;
    }
    var formular= new formidable.IncomingForm();

    formular.parse(req, function(err, campuriText, campuriFile){
        var criptareParola = crypto.scryptSync(campuriText.parola, parolaCriptata, 32).toString('hex');

        //to do query 

        var queryUpdate=`update utilizatori set nume='${campuriText.nume}', prenume= '${campuriText.prenume}', email='${campuriText.email}', culoare_chat='${campuriText.culoare_chat}'  where parola='${criptareParola}'`; 

        client.query(queryUpdate, function(err, rez){
            if(err){
                console.log(err); 
                res.render("pagini/eroare", {mesaj:"Eroare baza de date. Incercati mai tarziu"}) ;
                return;
            }
            console.log(rez.rowCount); 
            if(rez.rowCount==0){
                res.render("pagini/profil", {mesaj:"Update-ul nu s- a realizat. Verificati parola introdusa."});
                return;
            }
            else{
//actualizare sesiune  
req.session.utilizator.nume= campuriText.nume;
req.session.utilizator.prenume= campuriText.prenume;
req.session.utilizator.email= campuriText.email;
req.session.utilizator.culoare_chat= campuriText.culoare_chat; 




            }
            
            res.render("pagini/profil", {mesaj: "update relaizat cu succes."});
        });
    });
});




function creeazaImagini(){
    var buf=fs.readFileSync(__dirname+"/Resurse/json/galerie.json").toString("utf8");

    obGlobal.obImagini=JSON.parse(buf);
    



    //console.log(obImagini);
    for (let imag of obGlobal.obImagini.imagini){
        let nume_imag, extensie;
        [nume_imag, extensie ]=imag.fisier.split(".")// "abc.de".split(".") ---> ["abc","de"] imagine.png->imagine.webp
        let dim_mic=150
        
        imag.mic=`${obGlobal.obImagini.cale_galerie}/mic/${nume_imag}-${dim_mic}.webp` //nume-150.webp // "a10" b=10 "a"+b `a${b}`
        //console.log(imag.mic);


        imag.mare=`${obGlobal.obImagini.cale_galerie}/${imag.fisier}`;
        if (!fs.existsSync(imag.mic))
            sharp(__dirname+"/"+imag.mare).resize(dim_mic).toFile(__dirname+"/"+imag.mic);


        let dim_mediu=300;
        imag.mediu=`${obGlobal.obImagini.cale_galerie}/mediu/${nume_imag}-${dim_mediu}.png` 
        if (!fs.existsSync(imag.mediu))
            sharp(__dirname+"/"+imag.mare).resize(dim_mediu).toFile(__dirname+"/"+imag.mediu);

            

        
    }

    
    

}
creeazaImagini();

app.get("/curs_5.css", function(req, res){
    var sirScss=fs.readFileSync(__dirname+"/Resurse/scss/galerie_animata.scss").toString("utf8");
   
    var culori=["navy", "black", "purple", "grey" ];
    var culoareAleatoare= Math.floor(Math.random()*culori.length);
   
    var culoareAleatoare= culori[indiceAleator];
    rezScss= ejs.render(sirScss, {culoare: culoareAleatoare});
    console.log(rezScss);
    var caleScss=__dirname+"/scss/galerie_animata.scss";
    fs.writeFileSync( caleScss , rezScss);
    try{
    rezCompilare=sass.compile(caleScss, {sourceMap:true});
    var caleCss=__dirname+"/css/galerie_animata.css";
    fs.writeFileSync( caleCss, rezScss);
    res.setHeader("Content-Type", "text/css");
    res.sendFile(caleCss);}
    catch (err){
        console.log(err);
        res.send("eroare");
    }

});








function creeazaErori(){
    var continutFisier= fs.readFileSync(__dirname+"/resurse/json/erori.json", {}, function(err, data){ console.log(data);}).toString("utf8");
    
    obGlobal.obErori=JSON.parse(continutFisier);// atentie e global pentru ca nu e definit cu var sau let
    //console.log(obGlobal.obErori);
}
creeazaErori();

function randeazaEroare(res, identificator=-1, titlu, text, imagine){
    var eroare= obGlobal.obErori.erori.find(function(elem){ return elem.identificator == identificator })
    titlu= titlu || (eroare && eroare.titlu) || obGlobal.obErori.eroare_default.titlu;
    text= text || (eroare && eroare.text) || obGlobal.obErori.eroare_default.text;
    imagine= imagine || (eroare && path.join(obGlobal.obErori.cale_baza,eroare.imagine)) 
        || path.join(obGlobal.obErori.cale_baza, obGlobal.obErori.eroare_default.imagine);
    if(eroare && eroare.status)
        res.status(eroare.identificator)
    res.render("pagini/eroare_generala",{titlu:titlu, text:text, imagine:imagine });
}
var s_port= process.env.PORT || obGlobal.port 
//--------------------------contact------------ 
app.use(["/mesaj", "/contact"], express.json({limit:'2mb'}));
caleXMLMesaje="Resurse/xml/contact.xml";
headerXML=`<?xml version="1.0" encoding="utf-8"?>`;
function creeazaXMlContactDacaNuExista(){
    if (!fs.existsSync(caleXMLMesaje)){
        let initXML={
            "declaration":{
                "attributes":{
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name":"contact",
                    "elements": [
                        {
                            "type": "element",
                            "name":"mesaje",
                            "elements":[]                            
                        }
                    ]
                }
            ]
        }
        let sirXml=xmljs.js2xml(initXML,{compact:false, spaces:4});//obtin sirul xml (cu taguri)
        console.log(sirXml);
        fs.writeFileSync(caleXMLMesaje,sirXml);
        return false; //l-a creat
    }
    return true; //nu l-a creat acum
}

function parseazaMesaje(){
    let existaInainte=creeazaXMlContactDacaNuExista();
    let mesajeXml=[];
    let obJson;
    if (existaInainte){
        let sirXML=fs.readFileSync(caleXMLMesaje, 'utf8');
        obJson=xmljs.xml2js(sirXML,{compact:false, spaces:4});
        

        let elementMesaje=obJson.elements[0].elements.find(function(el){
                return el.name=="mesaje"
            });
        let vectElementeMesaj=elementMesaje.elements?elementMesaje.elements:[];// conditie ? val_true: val_false
        console.log("Mesaje: ",obJson.elements[0].elements.find(function(el){
            return el.name=="mesaje"
        }))
        let mesajeXml=vectElementeMesaj.filter(function(el){return el.name=="mesaj"});
        return [obJson, elementMesaje,mesajeXml];
    }
    return [obJson,[],[]];
}

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.post("/contact", urlencodedParser, function(req, res){
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] =parseazaMesaje();
        
    let u= req.session.utilizator?req.session.utilizator.username:"anonim";
    let mesajNou={
        type:"element", 
        name:"mesaj", 
        attributes:{
            username:u, 
            data:new Date()
        },
        elements:[{type:"text", "text":req.body.mesaj}]
    };
    if(elementMesaje.elements)
        elementMesaje.elements.push(mesajNou);
    else 
        elementMesaje.elements=[mesajNou];
    let sirXml=xmljs.js2xml(obJson,{compact:false, spaces:4});
    console.log("XML: ",sirXml);
    fs.writeFileSync("Resurse/xml/contact.xml",sirXml);
    
    res.render("pagini/contact",{ utilizator:req.session.utilizator, mesaje:elementMesaje.elements})
});





// var s_port=process.env.PORT || 5000;
// app.listen(s_port);


app.listen(8080);
console.log("A pornit")
















// window.onload=function(){

//     function sorteaza(semn){
//         var articole=document.getElementsByClassName("jucarie");
//         var v_articole= Array.from(articole);
//         v_articole.sort(function(a,b){
//             let varsta_a=parseInt(a.getElementsByClassName("val-varsta")[0].innerHTML);
//             let varsta_b=parseInt(b.getElementsByClassName("val-varsta")[0].innerHTML);


            
//             if(varsta_a!=varsta_b)
//                 return semn*(varsta_a - varsta_b);
//             else{
//                 let pret_a=parseInt(a.getElementsByClassName("val-pret")[0].innerHTML); 
//                 let pret_b=parseInt(b.getElementsByClassName("val-pret")[0].innerHTML);
            
//                 return semn*(pret_a-pret_b);
//             }
            
//         })
//         for(let art of v_articole){
//             art.parentElement.appendChild(art);
//         }
//     }
    
//     document.getElementById("sortare").onclick=function(){
//         var butoaneRadio=document.getElementsByName("gr_rad");
//         for(let rad of butoaneRadio){
//             if(rad.checked){
//                 var valSortare=rad.value;
//                 break;
//             }
//         }
//         if(valSortare=="ascendent"){
//             sorteaza(1);
//         }
//         else if(valSortare=="descendent"){
//             sorteaza(-1);
//         }
//     }



