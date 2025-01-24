import cors from "cors";
import express from "express";
import { dajPortServis } from "../zajednicko/esmPomocnik.js";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";
import { RestKorisnik } from "./restKorisnik.js";
import { RestFilm } from "./restFilm.js";
import { RestOsoba } from "./restOsoba.js";
//import { provjeriToken } from "../zajednicko/jwt.js";
//import { Request, Response, NextFunction } from "express";
import { KorisnikAPK } from "./korisnikAPK.js";
import { __dirname } from "../zajednicko/esmPomocnik.js";
import * as path from 'path';
import { OsobaDAO } from "./osobaDAO.js";
import { FilmoviDAO } from "./filmDAO.js";

const server = express();

let konf = new Konfiguracija();


konf
    .ucitajKonfiguraciju()
    .then(pokreniServer)
    .catch((greska: Error | any) => {
        if (process.argv.length == 2) {
            console.error("Potrebno je dati naziv datoteke");
        } else if (greska.path != undefined) {
            console.error("Nije moguće otvoriti datoteku: " + greska.path);
        } else {
            console.log(greska.message);
        }
        process.exit();
    });


server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(
    cors({
        origin: function (origin, povratniPoziv) {
            console.log(origin);
            if (!origin || origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:")) {
                povratniPoziv(null, true);
            } else {
                povratniPoziv(new Error("Nije dozvoljeno zbog CORS"));
            }
        },
        optionsSuccessStatus: 200,
    })
);


function pokreniServer() {
    let port = dajPortServis("nantolic22"); 

    if (process.argv[4]) {
        port = process.argv[4];  
    }

    if (port) {
        if (!isNaN(Number(port)) && Number(port) > 1024 && Number(port) < 65535) {
            port = Number(port); 
        } else {
            process.exit(1); 
        }
    } else {
        console.error("Port nije proslijeđen!");
        process.exit(1); 
    }

    pripremiPutanjeResursKorisnika();
    pripremiPutanjeOsoba();
    pripremiPutanjeFilmova();
    pripremiPutanjeAplikacije();
    pripremiPutanjeDokumentacije();

    const angularPutanja = path.resolve(__dirname(), "../../angular/browser");
    server.use(express.static(angularPutanja));

    server.get("*", (zahtjev, odgovor) => {
        odgovor.sendFile(path.join(angularPutanja, "/index.html"));
    });

    server.use((zahtjev, odgovor) => {
        odgovor.status(404);
        var poruka = { greska: "nepostojeći resurs" };
        odgovor.send(JSON.stringify(poruka));
    });

    server.listen(port, () => {
        console.log(`Server pokrenut na portu: ${port}`);
    });
}

function pripremiPutanjeAplikacije(){
    const korisnikAPK = new KorisnikAPK();
    const osobaDAO = new OsobaDAO();
    const filmDAO = new FilmoviDAO();
    
    server.post("/servis/app/prijava", async (zahtjev, odgovor) => {
        const {korime, lozinka} = zahtjev.body;
        if(!korime || !lozinka) {
            odgovor.status(400).json({ poruka: 'Korisničko ime i lozinka su obavezna!' });
            console.log("Korime i lozinka obavezni!");
            return;
        }
        const korisnik = await korisnikAPK.prijavi(korime, lozinka);
        
        if (!korisnik) {
            odgovor.status(401).json({ poruka: 'Neispravno korisničko ime ili lozinka!' });
            console.log("Neispravno koorime i lozinka!");
            return;
        }
        
        odgovor.json({
            korisnik: korisnik,  
        });
    });

    server.post("/servis/app/registracija", async (zahtjev, odgovor) => {
        const { korime, lozinka, email, ime, prezime, adresa, datum_rodenja, telefon } = zahtjev.body;

        if (!korime || !lozinka || !email) {
            odgovor.status(400).json({ poruka: 'Korisničko ime, lozinka i email su obavezni!' });
            return;
        }

        const korisnik = {
            korime,
            lozinka,
            email,
            ime: ime || null,
            prezime: prezime || null,
            adresa: adresa || null,
            datum_rodenja: datum_rodenja || null,
            telefon: telefon || null,
            tip_korisnika_id : 2
        };

        try {
            const uspjeh = await korisnikAPK.registriraj(korisnik);

            if (uspjeh) {
                odgovor.status(201).json({ poruka: 'Korisnik uspješno registriran!' });
            } else {
                odgovor.status(500).json({ poruka: 'Došlo je do greške pri registraciji.' });
            }
        } catch (err: unknown) { 
            if (err) {
                odgovor.status(400).json({ poruka: 'Došlo je do pogreške pri registraciji.' });
            } else {
                odgovor.status(500).json({ poruka: 'Došlo je do greške pri registraciji.' });
            }
        }
    });

    server.get('/servis/app/korisnici', async (req, res) => {
        try {
          const korisnici = await korisnikAPK.dajSve();
          res.setHeader('Content-Type', 'application/json'); 
          res.status(200).json(korisnici);
        } catch (error) {
          console.error('Greška prilikom dohvaćanja korisnika:', error);
          res.status(500).json({ greska: 'Greška na serveru' });
        }
      });
    

      
    server.delete("/servis/app/korisnici/:korime", async (zahtjev, odgovor) => {
        const korime = zahtjev.params.korime;
    
        try {
            const uspjeh = await korisnikAPK.obrisi(korime);
    
            if (uspjeh) {
                odgovor.status(200).json({ poruka: `Korisnik ${korime} uspješno obrisan.` });
            } else {
                odgovor.status(404).json({ poruka: 'Korisnik nije pronađen.' });
            }
        } catch (error) {
            console.error("Greška pri brisanju korisnika:", error);
            odgovor.status(500).json({ poruka: 'Došlo je do greške pri brisanju korisnika.' });
        }
    });

    server.get("/servis/app/osobe", async (zahtjev, odgovor) => {  
        const stranica = zahtjev.query['stranica'];
        const stranicaNumber = (stranica && typeof stranica === 'string') ? parseInt(stranica, 10) : 1;  
        const brojOsobaPoStranici = parseInt(zahtjev.query['broj'] as string) || 10;
    
        if (isNaN(brojOsobaPoStranici) || brojOsobaPoStranici <= 0) {
            odgovor.status(400).json({ error: 'Neispravan broj osoba po stranici' });
            return;
        }
    
        try {
            const osobe = await osobaDAO.dajPoStraniciFetch(stranicaNumber, brojOsobaPoStranici);            
            const ukupnoOsoba = await osobaDAO.dajTMDB_ID(); 
            odgovor.setHeader('Content-Type', 'application/json');
            odgovor.status(200).json({
                stranica: stranicaNumber,
                brojOsobaPoStranici,
                ukupnoOsoba: ukupnoOsoba.length, 
                osobe,
            });
        } catch (error) {
            console.error("Greška pri dohvaćanju osoba:", error);
            odgovor.status(500).json({ error: "Greška pri dohvaćanju osoba." });
        }
    });

    server.get('/servis/app/pretrazivanjeOsoba', async (req, res) => {
        const query = String(req.query['query']); 
        const page = req.query['page'];
        
        if (!query) {
            res.status(400).json({ message: 'Query parametar je obavezan!' });
            return;
        }

        try {
            const tmdbApiKeyV3 = konf.dajKonf().tmdbApiKeyV3; 
            const apiUrl = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(query)}&page=${page}&api_key=${tmdbApiKeyV3}`;

            const tmdbResponse = await fetch(apiUrl);

            if (!tmdbResponse.ok) {
                throw new Error(`TMDB API error: ${tmdbResponse.statusText}`);
            }

            const contentType = tmdbResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error(`Invalid content-type: ${contentType}`);
            }

            const data = await tmdbResponse.json();
            res.json(data);
        } catch (error) {
            console.error('Greška pri pretraživanju osoba:');
            res.status(500).json({ message: 'Došlo je do greške!' });
        }
    });

    server.post("/servis/app/dodajOsobu", async (zahtjev, odgovor) => {
        const { tmdb_id, ime_prezime, poznat_po, slika, popularnost } = zahtjev.body;
        try {
            if (await osobaDAO.postojiOsoba(tmdb_id)) {
                odgovor.status(400).json({ message: 'Osoba je već dodana!' });
            }
            const uspjeh = await osobaDAO.dodaj(tmdb_id, ime_prezime, poznat_po, slika, popularnost);
            if (uspjeh) {
                 odgovor.status(201).json({ message: 'Osoba uspješno dodana!' });
            } else {
                 odgovor.status(500).json({ message: 'Došlo je do greške pri dodavanju osobe!' });
            }
        } catch (error) {
            console.error('Greška pri dodavanju osobe:', error);
             odgovor.status(500).json({ message: 'Došlo je do greške pri dodavanju osobe!' });
        }
    });

    server.delete('/servis/app/obrisiOsobu/:tmdb_id', async (req, res) => {
        const tmdb_id = Number(req.params.tmdb_id);  
        try {
          const rezultat = await osobaDAO.obrisi(tmdb_id);
          if (rezultat) {
            res.status(200).send({ opis: 'Osoba uspješno obrisana.' });
          } else {
            res.status(404).send({ greska: 'Osoba nije pronađena u bazi.' });
          }
        } catch (error) {
          console.error('Greška pri brisanju osobe:', error);
          res.status(500).send({ greska: 'Greška na serveru' });
        }
      });
    
      server.post('/servis/app/provjeriPostojanjeOsobe', async (req, res) => {
        const { tmdb_id } = req.body; 
        try {
            if (!tmdb_id) {
                res.status(400).json({ message: 'tmdb_id je obavezno!' });
            }
            const osobaPostoji = await osobaDAO.postojiOsoba(tmdb_id);  
            if (osobaPostoji) {
                res.json({ exists: true });  
            } else {
                res.json({ exists: false }); 
            }
        } catch (error) {
            console.error('Greška pri provjeri postojanja osobe:', error);
            res.status(500).json({ message: 'Došlo je do greške!' });
        }
    });

    server.get("/servis/app/filmovi", async (zahtjev, odgovor) => {
        try {
            const { datumOd, datumDo, stranica } = zahtjev.query;
    
            const datumOdSigurno: string | null = typeof datumOd === 'string' ? datumOd : null;
            const datumDoSigurno: string | null = typeof datumDo === 'string' ? datumDo : null;
    
            const brojStranica: number = parseInt(stranica as string, 10) || 1;
    
            const filmovi = await filmDAO.dohvatiFilmovePoDatumu(datumOdSigurno, datumDoSigurno, brojStranica);
            odgovor.json(filmovi);
        } catch (error) {
            console.error('Greška pri dohvaćanju filmova:', error);
            odgovor.status(500).json({ error: 'Greška na serveru' });
        }
    });

 

}

function pripremiPutanjeDokumentacije() {
    const dokumentacijaPath = path.join(__dirname(), '../../dokumentacija/dokumentacija.html');
    server.get("/dokumentacija", (zahtjev, odgovor) => {
      odgovor.sendFile(dokumentacijaPath);
    });
    server.use("/dokumentacija", express.static(path.join(__dirname(), '../../dokumentacija')));
}

function pripremiPutanjeResursKorisnika() {
	let restKorisnik = new RestKorisnik();

    server.get("/servis/korisnici", (zahtjev, odgovor) => {
        odgovor.type('json');
        odgovor.status(405);
        odgovor.send({ opis: "zabranjena metoda" });
    });
    
    server.post("/servis/korisnici", restKorisnik.postKorisnici.bind(restKorisnik));
    
    server.put("/servis/korisnici", (zahtjev, odgovor) => {
        odgovor.type('json');
        odgovor.status(405);
        odgovor.send({ opis: "zabranjena metoda" });
    });
    
    server.delete("/servis/korisnici", (zahtjev, odgovor) => {
        odgovor.type('json');
        odgovor.status(405);
        odgovor.send({ opis: "zabranjena metoda" });
    });

	server.get("/servis/korisnici/:korime", (zahtjev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(405);
		odgovor.send({opis:"zabranjena metoda"});
	});

    server.post("/servis/korisnici/:korime", (zahtjev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(405);
		odgovor.send({opis:"zabranjena metoda"});
	});

    server.put("/servis/korisnici/:korime",  (zahtjev, odgovor) =>{
		odgovor.type('json');
		odgovor.status(405);
		odgovor.send({opis:"zabranjena metoda"});
	});

    server.delete("/servis/korisnici/:korime", restKorisnik.deleteKorisnik.bind(restKorisnik));

    
}

function pripremiPutanjeOsoba() {
    let restOsoba = new RestOsoba();


    server.get("/servis/osoba/:id", restOsoba.getOsobaId.bind(restOsoba));
    server.delete("/servis/osoba/:id", restOsoba.deleteOsobaId.bind(restOsoba));
    server.post("/servis/osoba/:id", restOsoba.postOsobaId.bind(restOsoba));
    server.put("/servis/osoba/:id", restOsoba.putOsobaId.bind(restOsoba));

    server.get("/servis/osoba", restOsoba.getOsobePoStranici.bind(restOsoba));
    server.post("/servis/osoba", restOsoba.postOsobePoStranici.bind(restOsoba));
    server.put("/servis/osoba", restOsoba.putOsobePoStranici.bind(restOsoba));
    server.delete("/servis/osoba", restOsoba.deleteOsobePoStranici.bind(restOsoba));
}

function pripremiPutanjeFilmova() {
    let restFilm = new RestFilm();
    server.get("/servis/film/:id", restFilm.getFilmId.bind(restFilm));
    server.delete("/servis/film/:id", restFilm.deleteFilmId.bind(restFilm));
    server.post("/servis/film/:id", restFilm.postFilmId.bind(restFilm)); 
    server.put("/servis/film/:id", restFilm.putFilmId.bind(restFilm));

    server.get("/servis/osoba/:id/film", restFilm.getFilmoveZaOsobu.bind(restFilm));
    server.post("/servis/osoba/:id/film", restFilm.postFilmoveZaOsobu.bind(restFilm));
    server.put("/servis/osoba/:id/film", restFilm.putFilmoveZaOsobu.bind(restFilm));
    server.delete("servis/osoba/:id/film", restFilm.deleteFilmoveZaOsobu.bind(restFilm));

    server.get("/servis/film", restFilm.getFilmoveStranice.bind(restFilm));
    server.put("/servis/film", restFilm.putFilmoveStranice.bind(restFilm));
    server.post("/servis/film", restFilm.postFilmoveStranice.bind(restFilm));
    server.delete("/servis/film", restFilm.deleteFilmId.bind(restFilm));
}



