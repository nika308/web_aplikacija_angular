import { KorisnikI } from "../servisI/korisniciI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class KorisnikDAO {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024nantolic22_servis.sqlite");
    }

    async dajSve(): Promise<Array<KorisnikI>> {
        let sql = "SELECT * FROM korisnik;";
        var podaci = (await this.baza.dajPodatkePromise(sql, [])) as Array<KorisnikI>;
        let rezultat = new Array<KorisnikI>();
        
        for (let p of podaci) {
            let k: KorisnikI = {
                ime: p["ime"],
                prezime: p["prezime"],
                korime: p["korime"],
                lozinka: p["lozinka"],
                email: p["email"],
                adresa: p["adresa"], 
                datum_rodenja: p["datum_rodenja"],  
                telefon: p["telefon"],
                tip_korisnika_id: p["tip_korisnika_id"] 
            };
            rezultat.push(k);
        }
        return rezultat;
    }

    async daj(korime: string): Promise<KorisnikI | null> {
        let sql = "SELECT * FROM korisnik WHERE korime=?;";
        var podaci = (await this.baza.dajPodatkePromise(sql, [korime])) as Array<KorisnikI>;

        if (podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let k: KorisnikI = { 
                ime: p["ime"],
                prezime: p["prezime"],
                korime: p["korime"],
                lozinka: p["lozinka"],
                email: p["email"],
                adresa: p["adresa"],  
                datum_rodenja: p["datum_rodenja"],  
                telefon: p["telefon"],
                tip_korisnika_id: p["tip_korisnika_id"] 
            };
            return k;
        }

        return null;
    }
    dodaj(korisnik: KorisnikI) {
        console.log(korisnik);
        
        let tipKorisnika = korisnik.tip_korisnika_id || 2; 
    
        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, tip_korisnika_id, korime, adresa, datum_rodenja, telefon) 
                   VALUES (?,?,?,?,?,?,?,?,?)`;
        let podaci = [
            korisnik.ime || null,
            korisnik.prezime || null,
            korisnik.lozinka,
            korisnik.email,
            tipKorisnika,  
            korisnik.korime,
            korisnik.adresa || null,
            korisnik.datum_rodenja || null,
            korisnik.telefon || null,
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }

    obrisi(korime: string) {
        let sql = "DELETE FROM korisnik WHERE korime=?";
        this.baza.ubaciAzurirajPodatke(sql, [korime]);
        return true;
    }

    azuriraj(korime: string, korisnik: KorisnikI) {
        let sql = `UPDATE korisnik SET ime=?, prezime=?, lozinka=?, email=?, adresa=?, datum_rodenja=?, telefon=? 
                   WHERE korime=?`;
        let podaci = [
            korisnik.ime || null,
            korisnik.prezime || null,
            korisnik.lozinka,
            korisnik.email, 
            korisnik.adresa || null,  
            korisnik.datum_rodenja || null,  
            korisnik.telefon || null,  
            korime,
        ];
        this.baza.ubaciAzurirajPodatke(sql, podaci);
        return true;
    }
    
    
}
