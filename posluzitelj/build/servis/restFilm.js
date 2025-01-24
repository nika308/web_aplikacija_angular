import { FilmoviDAO } from "./filmDAO.js";
export class RestFilm {
    fdao;
    constructor() {
        this.fdao = new FilmoviDAO();
    }
    async getFilmId(zahtjev, odgovor) {
        odgovor.type("application/json");
        let filmID = Number(zahtjev.params['id']);
        if (isNaN(filmID)) {
            odgovor.status(400).send({ greska: "Neispravan ID" });
            return;
        }
        try {
            const filmPodaci = await this.fdao.dajFilmPremaID(filmID);
            console.log("Podaci o filmu: ", filmPodaci);
            if (filmPodaci) {
                odgovor.status(200).json(filmPodaci);
            }
            else {
                odgovor.status(400).send({ greska: "Film nije pronađen" });
            }
        }
        catch (error) {
            console.error("Greška na serveru:", error);
            odgovor.status(400).send({ greska: "Greška na serveru" });
        }
    }
    async postFilmId(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    async putFilmId(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    async deleteFilmId(zahtjev, odgovor) {
        let filmID = Number(zahtjev.params['id']);
        if (isNaN(filmID)) {
            odgovor.status(400).send({ greska: "Neispravan ID" });
            return;
        }
        try {
            const filmVeze = await this.fdao.provjeriVeze(filmID);
            if (filmVeze > 0) {
                odgovor.status(201).send({ opis: "Film ima veze u drugim tablicama. Nije moguće obrisati." });
                return;
            }
            const rezultat = await this.fdao.obrisi(filmID);
            if (rezultat) {
                odgovor.status(200).send({ opis: "Film obrisan" });
            }
            else {
                odgovor.status(400).send({ greska: "Film nije pronađen" });
            }
        }
        catch (error) {
            odgovor.status(500).send({ greska: "Greška na serveru" });
        }
    }
    async getFilmoveZaOsobu(zahtjev, odgovor) {
        const osobaID = Number(zahtjev.params["id"]);
        const stranica = Number(zahtjev.query["stranica"]) || 1;
        if (isNaN(osobaID) || osobaID < 1) {
            odgovor.status(400).send({ greska: "Neispravan ID osobe" });
            return;
        }
        if (isNaN(stranica) || stranica < 1) {
            odgovor.status(400).send({ greska: "Parametar 'stranica' mora biti pozitivan broj" });
            return;
        }
        try {
            const filmovi = await this.fdao.dajFilmovePoStranici(osobaID, stranica);
            odgovor.status(200).json({
                stranica,
                filmovi
            });
        }
        catch (error) {
            console.error("Greška na serveru:", error);
            odgovor.status(500).send({ greska: "Greška na serveru" });
        }
    }
    async postFilmoveZaOsobu(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    async putFilmoveZaOsobu(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(400);
        let poruka = { greska: "nije implementirano" };
        odgovor.send(JSON.stringify(poruka));
    }
    async deleteFilmoveZaOsobu(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(400);
        let poruka = { greska: "nije implementirano" };
        odgovor.send(JSON.stringify(poruka));
    }
    async getFilmoveStranice(req, res) {
        const { stranica = 1, datumOd, datumDo } = req.query;
        try {
            const datumOdParsed = datumOd ? new Date(datumOd).getTime() : undefined;
            const datumDoParsed = datumDo ? new Date(datumDo).getTime() : undefined;
            const filmovi = await this.fdao.dohvatiFilmove(Number(stranica), datumOdParsed, datumDoParsed);
            res.status(200).json(filmovi);
        }
        catch (error) {
            console.error('Greška pri dohvaćanju filmova:', error);
            res.status(500).json({ greska: 'Greška pri dohvaćanju filmova.' });
        }
    }
    async postFilmoveStranice(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(400);
        let poruka = { greska: "nije implementirano" };
        odgovor.send(JSON.stringify(poruka));
    }
    async putFilmoveStranice(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
    async deleteFilmoveStranice(zahtjev, odgovor) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
}
