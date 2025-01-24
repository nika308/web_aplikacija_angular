import { KorisnikI } from "../servisI/korisniciI.js";
import Baza from "../zajednicko/sqliteBaza.js";
import { kreirajSHA256 } from "../zajednicko/kodovi.js";


export class KorisnikAPK {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024nantolic22_web.sqlite");
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
    
        const hashiranaLozinka = kreirajSHA256(korisnik.lozinka, "moja sol");

        let sql = `INSERT INTO korisnik (ime, prezime, lozinka, email, tip_korisnika_id, korime, adresa, datum_rodenja, telefon) 
                   VALUES (?,?,?,?,?,?,?,?,?)`;
        let podaci = [
            korisnik.ime || null,
            korisnik.prezime || null,
            hashiranaLozinka,  
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

    async prijavi(korime: string, lozinka: string): Promise<KorisnikI | false> {
        const korisnik = await this.daj(korime);  
    
        if (!korisnik) {
            console.log("Korisnik nije pronađen.");
            return false;
        }
    
        const lozinkaHash = kreirajSHA256(lozinka, "moja sol");

        if (lozinkaHash === korisnik.lozinka) {
            console.log("Uspješan login!");
            return korisnik;
        } else {
            console.log("Neuspješan login! Hashovi se ne podudaraju.");
            return false;
        }
    }

    async registriraj(korisnik: KorisnikI): Promise<boolean> {
        try {
            const sqlProvjera = 'SELECT * FROM korisnik WHERE korime = ? OR email = ?';
            const postojiKorisnik = await this.baza.izvrsiUpit(sqlProvjera, [korisnik.korime, korisnik.email]);
    
            if (postojiKorisnik.length > 0) {
                const error = new Error('Korisničko ime ili email već postoji!');
                (error as any).status = 400; 
                throw error;
            }
    
            const rezultatDodavanja = await this.dodaj(korisnik);
    
            if (rezultatDodavanja) {
                console.log('Korisnik je uspješno registriran.');
                return true;  
            } else {
                console.log('Došlo je do greške pri dodavanju korisnika.');
                return false;  
            }
        } catch (error) {
            console.error('Greška u registraciji korisnika:', error);
            if ((error as any).message === 'Korisničko ime ili email već postoji!') {
                throw new Error('Korisničko ime ili email već postoji!');
            }
            throw new Error('Došlo je do greške pri registraciji korisnika.');
        }
    }

    async pocetna(korime: string): Promise<KorisnikI | null> {
        const korisnik = await this.daj(korime);
        if(!korisnik){
            return null;
        }
        let datum_rodenja = korisnik.datum_rodenja;
        let formatiraniDatum = "Nije dostupno";
        
        if (datum_rodenja) {
            const datumObjekt = new Date(datum_rodenja);
            if (!isNaN(datumObjekt.getTime())) {
                const day = ("0" + datumObjekt.getDate()).slice(-2);
                const month = ("0" + (datumObjekt.getMonth() + 1)).slice(-2);
                const year = datumObjekt.getFullYear();
                formatiraniDatum = `${day}.${month}.${year}`;
            }
        }

        return {
            ime: korisnik.ime,
            prezime: korisnik.prezime,
            korime: korisnik.korime,
            email: korisnik.email,
            adresa: korisnik.adresa || "Nije dostupno",
            datum_rodenja: formatiraniDatum,
            telefon: korisnik.telefon || "Nije dostupan",
            tip_korisnika_id: korisnik.tip_korisnika_id,
            lozinka: "******"
        };
    }
    
}
