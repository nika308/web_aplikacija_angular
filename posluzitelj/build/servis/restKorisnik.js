import { KorisnikDAO } from "./korisnikDAO.js";
export class RestKorisnik {
    kdao;
    constructor() {
        this.kdao = new KorisnikDAO();
    }
    getKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    postKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        let podaci = zahtjev.body;
        let poruka = this.kdao.dodaj(podaci);
        odgovor.send(JSON.stringify(poruka));
    }
    deleteKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    putKorisnici(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    getKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    postKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    deleteKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        if (zahtjev.params["korime"] != undefined) {
            this.kdao.obrisi(zahtjev.params["korime"]);
            let poruka = { ok: "obrisan" };
            odgovor.send(JSON.stringify(poruka));
            return;
        }
        odgovor.status(407);
        let poruka = { greska: "Nedostaje podatak" };
        odgovor.send(JSON.stringify(poruka));
    }
    putKorisnik(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
}
