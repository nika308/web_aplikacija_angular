import { KorisnikDAO } from "./korisnikDAO.js";
import { Request, Response } from "express";

import { Session } from "express-session";

export interface RWASession extends Session {
    korisnik: any;
    korime: string;
    tip_korisnika_id: number;
    uloga: string;
    korisnik_id: number;
    ime: string;
    jwt: string | null;
  }
  

export class RestKorisnik {
	private kdao;

	constructor() {
		this.kdao = new KorisnikDAO();
	}

	getKorisnici(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}

	postKorisnici(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		let podaci = zahtjev.body;
		let poruka = this.kdao.dodaj(podaci);
		odgovor.send(JSON.stringify(poruka));
	}

	deleteKorisnici(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}

	putKorisnici(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}

	getKorisnik(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}

	postKorisnik(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}
	
	deleteKorisnik(zahtjev: Request, odgovor: Response) {
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

	putKorisnik(zahtjev: Request, odgovor: Response) {
		odgovor.type("application/json");
		odgovor.status(405);
		let poruka = { greska: "zabranjena metoda" };
		odgovor.send(JSON.stringify(poruka));
	}
	
}
