import { OsobaI } from '../servisI/tmdbI'; 

export class KlijentTMDB {
    private bazicniURL: string = 'https://api.themoviedb.org/3';
    private apiKljuc: string;
    
    constructor(apiKljuc: string) {
        this.apiKljuc = apiKljuc;
    }

	private async obaviZahtjev(
		resurs: string,
		parametri: { [kljuc: string]: string | number | boolean } = {}
	) {
		let zahtjev = this.bazicniURL + resurs + "?api_key=" + this.apiKljuc;
		for (let p in parametri) {
			zahtjev += "&" + p + "=" + parametri[p];
		}
		console.log(zahtjev);
		let odgovor = await fetch(zahtjev);
		let rezultat = await odgovor.text();
		return rezultat;
	}

    public async dohvatiOsobu(id: number) {
		let resurs = "/person/" + id;
		let odgovor = await this.obaviZahtjev(resurs);
		return JSON.parse(odgovor) as OsobaI;
	}

    public async pretraziOsobu(trazi: string, stranica: number){
        let resurs = "/search/person";
        let parametri = {
            query: trazi,
            page: stranica,
            sort_by: "popularity.desc",
			include_adult: false
        }
        let odgovor = await this.obaviZahtjev(resurs, parametri);
        return JSON.parse(odgovor) as OsobaI;
    }

}
