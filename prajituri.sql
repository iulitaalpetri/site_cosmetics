DROP TYPE IF EXISTS categ_piele;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_piele AS ENUM( 'acnee', 'ten uscat', 'mixt', 'normal', 'corp','piele ochi');
CREATE TYPE tipuri_produse AS ENUM('hidratant', 'curatare', 'masca');


CREATE TABLE IF NOT EXISTS prajituri (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
cantitate INT NOT NULL CHECK (cantitate>=0),   

   tip_produs tipuri_produse DEFAULT 'piele',
   
   
   
   nr_bucati INT NOT NULL CHECK (nr_bucati>=0),
   categorie categ_piele VARCHAR(300),
   ingrediente VARCHAR [], --pot sa nu fie specificare deci nu punem NOT NULL
   acord_dermatolog BOOLEAN NOT NULL DEFAULT FALSE,
   ingredient_dominant VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp

);

INSERT into prajituri (nume,descriere,pret, cantitate,tip_produs, nr_bucati, categorie, ingrediente, acord_dermatolog,ingredient_dominant, data_adaugare, imagine) VALUES
() 
('crema hidratanta', 'Crema hidratanta galbenele', 5.00 , 30, 'hidratant', 4, 'normal', '{"acid hialuronic","aloe vera"}', False, null, CURRENT_DATE 'aproximativ-savarina.jpg'),

('Amandină', 'Prăjitură cu ciocolată', 6 , 200, 400, 'cofetarie', 'comuna', '{"faina","ciocolata","lapte","zahar","unt"}', False, 'posibil-amandina.jpg'),

('Tort glazurat', 'Tort pentru evenimente, poate fi decorat cu diverse culori', 35 , 1000, 2500, 'cofetarie', 'comanda speciala', '{"oua","zahar","faina","lapte","ciocolata","alune"}', False,'tort-glazurat.jpg'),

('Dulcelind cu fructe', 'Rețetă proprie, cu conținut sănătos (dacă ignorați tonele de zahăr) de fruncte proaspete', 10 , 250, 620, 'cofetarie', 'aniversara', '{"frisca","zahar","faina","zmeura","lapte","mure","capsuni"}', False,'dulcelind.jpg'),

('Tartă cu căpșuni', 'Sub căpșuni se află o tartă.', 6 , 245, 280, 'cofetarie', 'comuna', '{"vanilie","faina","capsuni","lapte", "indulcitor"}', True,'tarta-capsuni.jpg'),

