import Baza from "../zajednicko/sqliteBaza.js";
export class OsobaDAO {
    baza;
    constructor() {
        this.baza = new Baza("podaci/RWA2024nantolic22_servis.sqlite");
    }
    async dajSve() {
        let sql = "SELECT * FROM osoba;";
        var podaci = (await this.baza.dajPodatkePromise(sql, []));
        let rezultat = new Array();
        for (let p of podaci) {
            let o = {
                tmdb_id: p["tmdb_id"],
                ime_prezime: p["ime_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                slika: p["slika"]
            };
            rezultat.push(o);
        }
        return rezultat;
    }
    async dajTMDB_ID() {
        let sql = "SELECT tmdb_id FROM osoba;";
        var podaci = (await this.baza.dajPodatkePromise(sql, []));
        if (podaci.length > 0) {
            return podaci;
        }
        else {
            return [];
        }
    }
    async dajOsobuPremaID(osobaID) {
        let sql = 'SELECT * FROM osoba WHERE tmdb_id = ?';
        var podaci = await this.baza.dajPodatkePromise(sql, [osobaID]);
        if (podaci.length == 1 && podaci[0] != undefined) {
            let p = podaci[0];
            let o = {
                tmdb_id: p["tmdb_id"],
                ime_prezime: p["ime_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                slika: p["slika"]
            };
            return o;
        }
        return null;
    }
    async dajPoStranici(stranica) {
        const velicinaStranice = 20;
        let offset = (stranica - 1) * velicinaStranice;
        let sql = `SELECT * FROM osoba LIMIT ? OFFSET ?`;
        var podaci = (await this.baza.dajPodatkePromise(sql, [velicinaStranice, offset]));
        let rezultat = new Array();
        for (let p of podaci) {
            let o = {
                tmdb_id: p["tmdb_id"],
                ime_prezime: p["ime_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                slika: p["slika"],
            };
            rezultat.push(o);
        }
        return rezultat;
    }
    async dajPoStraniciFetch(stranica, brojOsobaPoStranici) {
        let offset = (stranica - 1) * brojOsobaPoStranici;
        let sql = `SELECT * FROM osoba LIMIT ? OFFSET ?`;
        var podaci = (await this.baza.dajPodatkePromise(sql, [brojOsobaPoStranici, offset]));
        let rezultat = new Array();
        for (let p of podaci) {
            let o = {
                tmdb_id: p["tmdb_id"],
                ime_prezime: p["ime_prezime"],
                poznat_po: p["poznat_po"],
                popularnost: p["popularnost"],
                slika: p["slika"],
            };
            rezultat.push(o);
        }
        return rezultat;
    }
    async postojiOsoba(tmdb_id) {
        const sql = 'SELECT * FROM osoba WHERE tmdb_id = ?';
        const podaci = [tmdb_id];
        try {
            const rezultat = await this.baza.dajPodatkePromise(sql, podaci);
            return rezultat.length > 0;
        }
        catch (error) {
            console.error("Greška pri provjeri postojanja osobe:", error);
            throw new Error("Greška pri provjeri postojanja osobe");
        }
    }
    async dodaj(tmdb_id, ime_prezime, poznat_po, slika, popularnost) {
        try {
            if (await this.postojiOsoba(tmdb_id)) {
                console.log(`Osoba s TMDB ID: ${tmdb_id} već postoji.`);
                return false;
            }
            if (!slika || slika.trim() === "") {
                slika = '';
            }
            const sql = `INSERT INTO osoba (tmdb_id, ime_prezime, poznat_po, slika, popularnost) VALUES (?,?,?,?,?)`;
            const podaci = [tmdb_id, ime_prezime, poznat_po, slika, popularnost];
            const rezultat = this.baza.ubaciAzurirajPodatke(sql, podaci);
            if (rezultat && rezultat.changes > 0) {
                return true;
            }
            else {
                console.error("Greška pri dodavanju osobe, nije izvršen upit.");
                return false;
            }
        }
        catch (error) {
            console.error("Greška pri dodavanju osobe:", error);
            return false;
        }
    }
    obrisi(tmdb_id) {
        let sql = "DELETE FROM osoba WHERE tmdb_id=?";
        const rezultat = this.baza.ubaciAzurirajPodatke(sql, [tmdb_id]);
        if (rezultat.changes === 0) {
            return false;
        }
        return true;
    }
}
