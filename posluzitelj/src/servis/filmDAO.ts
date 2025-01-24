import { FilmI, FilmOsobaI } from "../servisI/tmdbI.js";
import Baza from "../zajednicko/sqliteBaza.js";

export class FilmoviDAO {
    private baza: Baza;

    constructor() {
        this.baza = new Baza("podaci/RWA2024nantolic22_servis.sqlite");
    }

    async dajSve(): Promise<Array<FilmI>> {
        let sql = "SELECT * FROM film;";
        var podaci = (await this.baza.dajPodatkePromise(
            sql,
            []
        )) as Array<FilmI>;
        let rezultat = new Array<FilmI>();
        
        for (let p of podaci) {
            let f: FilmI = {
                tmdb_id: p["tmdb_id"],
                naziv: p["naziv"],
                originalni_naziv: p["originalni_naziv"],
                opis: p["opis"],
                datum_izlaska: p["datum_izlaska"],
                popularnost: p["popularnost"],
                jezik: p["jezik"],
                poster: p["poster"]
            };
            rezultat.push(f);
        }
        return rezultat;
    }

    async dajFilmPremaID(filmID: number){
        let sql = 'SELECT * FROM film WHERE tmdb_id = ?;';
        var podaci = await this.baza.dajPodatkePromise(sql, [filmID]) as Array<FilmI>;
    
        if(podaci.length == 1 && podaci[0] != undefined){
            let p = podaci[0];
            let f: FilmI = {
                tmdb_id: p["tmdb_id"],
                naziv: p["naziv"],
                originalni_naziv: p["originalni_naziv"],
                opis: p["opis"],
                datum_izlaska: p["datum_izlaska"],
                popularnost: p["popularnost"],
                jezik: p["jezik"],
                poster: p["poster"]
            };
            return f;
        }
        return null;
    }

    async dajFilmoveIOsobe(): Promise<Array<FilmOsobaI>> {
        let sql = `SELECT f.tmdb_id AS film_tmdb_id, f.naziv AS film_naziv, o.tmdb_id AS osoba_tmdb_id, o.ime_prezime, fo.uloga
        FROM film f
        JOIN film_osoba fo ON f.tmdb_id = fo.film_tmdb_id
        JOIN osoba o ON fo.osoba_tmdb_id = o.tmdb_id;`;

        var podaci = (await this.baza.dajPodatkePromise(
            sql,
            []
        )) as Array<FilmOsobaI>;

        let rezultat: Array<FilmOsobaI> = podaci.map((p: any) => {
        return {
            film_tmdb_id: p["film_tmdb_id"],
            film_naziv: p["film_naziv"],
            osoba_tmdb_id: p["osoba_tmdb_id"],
            ime_prezime: p["ime_prezime"],
            uloga: p["uloga"]
        };
        });
        return rezultat;
    }

    async dajFilmovePoStranici(osobaID: number, stranica: number): Promise<Array<FilmI>> {
        const velicinaStranice = 20;
        let offset = (stranica - 1) * velicinaStranice;
    
        let sql = `
            SELECT f.tmdb_id, f.naziv, f.originalni_naziv, f.opis, f.datum_izlaska, f.popularnost, f.jezik, f.poster
            FROM film f
            JOIN film_osoba fo ON f.tmdb_id = fo.film_tmdb_id
            WHERE fo.osoba_tmdb_id = ?
            LIMIT ? OFFSET ?`;
    
        var podaci = (await this.baza.dajPodatkePromise(
            sql,
            [osobaID, velicinaStranice, offset]  
        )) as Array<any>; 
    
        let filmovi: Array<FilmI> = [];
        for (let p of podaci) {
            let film: FilmI = {
                tmdb_id: p["tmdb_id"],  
                naziv: p["naziv"],     
                originalni_naziv: p["originalni_naziv"],
                opis: p["opis"],
                datum_izlaska: p["datum_izlaska"],
                popularnost: p["popularnost"],
                jezik: p["jezik"],
                poster: p["poster"]
            };
            filmovi.push(film);
        }
    
        return filmovi;
    }

    async obrisi(tmdb_id: number) {
        let sql = "DELETE FROM film WHERE tmdb_id=?";
        const rezultat = this.baza.ubaciAzurirajPodatke(sql, [tmdb_id]);
        if (rezultat.changes === 0) {
            return false;
        }
        return true;
    }

    async provjeriVeze(filmID: number): Promise<number> {
        let sql = "SELECT COUNT(*) FROM film_osoba WHERE film_tmdb_id = ?";
        let rezultat = await this.baza.dajPodatke(sql, [filmID]) as Array<{ 'COUNT(*)': number }>;
        return Number(rezultat?.[0]?.['COUNT(*)'] ?? 0);
    }

    async obrisiFilmoveZaOsobu(osobaID: number, filmovi: number[]): Promise<void> {
        if (filmovi.length === 0) {
            throw new Error("Morate navesti barem jedan film.");
        }
        const queries = filmovi.map(filmID => {
            return this.baza.ubaciAzurirajPodatke(
                'DELETE FROM film_osoba WHERE osoba_tmdb_id = ? AND film_tmdb_id = ?',
                [osobaID, filmID]
            );
        });

        await Promise.all(queries);
    }

    async dohvatiFilmove(stranica: number, datumOd?: number, datumDo?: number): Promise<any[]> {
        const offset = (stranica - 1) * 20;
        let query = 'SELECT * FROM film LIMIT 20 OFFSET ?';
      
        const params = [offset];
      
        if (datumOd) {
            query += ' AND strftime("%s", datum_izlaska) >= ?';
            params.push(datumOd);
        }
        if (datumDo) {
            query += ' AND strftime("%s", datum_izlaska) <= ?';
            params.push(datumDo);
        }
      
        return this.baza.dajPodatkePromise(query, params);
    }

    async dohvatiFilmovePoDatumu(datumOd: string | null, datumDo: string | null, stranica: number): Promise<Array<FilmI>> {
        const velicinaStranice = 20;
        const offset = (stranica - 1) * velicinaStranice;
    
        let sql = `SELECT * FROM film WHERE 1=1`; 
        let params: any[] = [];
    
        if (datumOd) {
            sql += ` AND datum_izlaska >= ?`;
            params.push(datumOd);
        }
        if (datumDo) {
            sql += ` AND datum_izlaska <= ?`;
            params.push(datumDo);
        }
    
        sql += ` LIMIT ? OFFSET ?`;
        params.push(velicinaStranice, offset);
    
        const podaci = (await this.baza.dajPodatkePromise(sql, params)) as Array<FilmI>;
    
        let rezultat: Array<FilmI> = [];
        for (let p of podaci) {
            let film: FilmI = {
                tmdb_id: p["tmdb_id"],
                naziv: p["naziv"],
                originalni_naziv: p["originalni_naziv"],
                opis: p["opis"],
                datum_izlaska: p["datum_izlaska"],
                popularnost: p["popularnost"],
                jezik: p["jezik"],
                poster: p["poster"],
            };
            rezultat.push(film);
        }
    
        return rezultat;
    }
} 