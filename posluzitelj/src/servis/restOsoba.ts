import { OsobaDAO } from "./osobaDAO.js";
import { Request, Response } from "express";

export class RestOsoba {
    private odao: OsobaDAO; 

    constructor() {
        this.odao = new OsobaDAO(); 
    }

    async getOsobaId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        let osobaID = Number(zahtjev.params['id']);

        if (isNaN(osobaID)) {
            odgovor.status(400).send({ greska: "neispravan ID" });
            return;
        }

        try {
            const osobaPodaci = await this.odao.dajOsobuPremaID(osobaID);

            console.log("Podaci o osobi:", osobaPodaci);

            if (osobaPodaci) {
                odgovor.status(200).json(osobaPodaci);
            } 
            else {
                odgovor.status(400).send({ greska: "osoba nije pronađena" });
            }
        } 
        catch (error) {
            console.error("Greška na serveru:", error);
            odgovor.status(400).send({ greska: "greška na serveru" });
        }
    }

    async postOsobaId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }

    async putOsobaId(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }

    async deleteOsobaId(zahtjev: Request, odgovor: Response) {
        let osobaID = Number(zahtjev.params['id']);
    
        if (isNaN(osobaID)) {
            odgovor.status(400).send({ greska: "neispravan ID" });
            return;
        }
    
        try {
            const rezultat = await this.odao.obrisi(osobaID);
            if (rezultat) {
                odgovor.status(201).send({ opis: "osoba obrisana" });
            } else {
                odgovor.status(400).send({ greska: "osoba nije pronađena" });
            }
        } catch (error) {
            odgovor.status(400).send({ greska: "greška na serveru" });
        }
    }
    
    async getOsobePoStranici(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
    
        let stranica = Number(zahtjev.query["stranica"]) || 1; 
    
        if (isNaN(stranica) || stranica < 1) {
            odgovor.status(422).send({ greska: "neočekivani podaci" });
            return;
        }
    
        try {
            const osobe = await this.odao.dajPoStranici(stranica);
            odgovor.status(200).json({
                stranica,
                osobe,
            });
        } catch (error) {
            console.error("Greška na serveru:", error);
            odgovor.status(400).send({ greska: "greška na serveru" });
        }
    }

    async postOsobePoStranici(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(400);
        let poruka = { greska: "nije implementirano" };
        odgovor.send(JSON.stringify(poruka));
    }
       
    async putOsobePoStranici(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }
        
    async deleteOsobePoStranici(zahtjev: Request, odgovor: Response) {
        odgovor.type("application/json");
        odgovor.status(405);
        let poruka = { greska: "zabranjena metoda" };
        odgovor.send(JSON.stringify(poruka));
    }



    
    
}
