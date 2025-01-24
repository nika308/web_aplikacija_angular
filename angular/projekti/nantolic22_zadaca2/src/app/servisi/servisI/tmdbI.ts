export interface FilmI {
    tmdb_id: number; 
    naziv: string; 
    originalni_naziv: string;
    opis: string; 
    datum_izlaska: string; 
    popularnost: number; 
    jezik: string; 
    poster: string; 
}

export interface FilmoviTmdbI {
    page: number;
    results: Array<FilmI>;
    total_pages: number;
    total_results: number;
}

export interface OsobaI {
    tmdb_id: number; 
    ime_prezime: string; 
    poznat_po: string; 
    popularnost: number; 
    slika: string;
}

export interface FilmOsobaI {
    film_tmdb_id: number; 
    osoba_tmdb_id: number; 
    uloga: string;
}

export interface GalerijaI {
    id: number; 
    osoba_tmdb_id: number; 
    file_path: string; 
}

export interface Korisnik {
    id: number;
    tip_korisnika_id: number;
    korime: string;
}

export interface TipKorisnika {
    id: number;
    naziv: string;
}