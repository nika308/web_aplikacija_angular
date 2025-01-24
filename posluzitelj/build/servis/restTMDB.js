import { KlijentTMDB } from "./klijentTMDB.js";
export class RestTMDB {
    klijentTMDB;
    constructor(api_kljuc) {
        this.klijentTMDB = new KlijentTMDB(api_kljuc);
        console.log(api_kljuc);
    }
    getOsoba(zahtjev, odgovor) {
        console.log(this);
        const id = zahtjev.query['id'];
        if (id == null || isNaN(Number(id))) {
            odgovor.status(417);
            odgovor.send({ greska: "ID osobe nije dostavljen ili nije valjan." });
            return;
        }
        this.klijentTMDB.dohvatiOsobu(Number(id))
            .then((osoba) => {
            odgovor.type("application/json");
            odgovor.json(osoba);
        })
            .catch((greska) => {
            odgovor.status(500).json({ greska: "Greška pri dohvaćanju osobe", detalji: greska });
        });
    }
    getOsobe(zahtjev, odgovor) {
        console.log(this);
        odgovor.type("application/json");
        let stranica = zahtjev.query["stranica"];
        let trazi = zahtjev.query["trazi"];
        if (stranica == null || trazi == null || typeof stranica != "string" || typeof trazi != "string") {
            odgovor.status(417);
            odgovor.send({ greska: "neocekivani podaci" });
            return;
        }
        this.klijentTMDB
            .pretraziOsobu(trazi, parseInt(stranica))
            .then((osobe) => {
            odgovor.send(osobe);
        })
            .catch((greska) => {
            odgovor.json(greska);
        });
    }
}
