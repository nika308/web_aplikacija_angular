import dsPromise from "fs/promises";

type tipKonf = {
	jwtValjanost: string;
	jwtTajniKljuc: string;
	tajniKljucSesija: string;
	tmdbApiKeyV3: string;
	tmdbApiKeyV4: string;
};

export class Konfiguracija {
	private konf: tipKonf;
	constructor() {
		this.konf = this.initKonf();
	}

	private initKonf() {
		return {
			jwtTajniKljuc: "",
			jwtValjanost: "",
			tajniKljucSesija: "",
			tmdbApiKeyV3: "",
			tmdbApiKeyV4: "",
		};
	}

	public dajKonf() {
		return this.konf;
	}

	public async ucitajKonfiguraciju() {
        if (process.argv[2] == undefined)
            throw new Error("Nedostaje putanja do konfiguracijske datoteke!");
        let putanja: string = process.argv[2];
        var podaci: string = await dsPromise.readFile(putanja, {
          encoding: "utf-8",
        });
        console.log("Sadržaj konfiguracijske datoteke:", podaci);  
        this.pretvoriJSONkonfig(podaci);
        console.log(this.konf);
        this.provjeriPodatkeKonfiguracije();
	}

    private pretvoriJSONkonfig(podaci: string) {
        let konf: { [kljuc: string]: string } = {};
        var nizPodataka = podaci.split("\n");
    
        for (let podatak of nizPodataka) {
            var podatakNiz = podatak.split("#");
            var naziv = podatakNiz[0]?.trim() ?? '';
            var vrijednost: string = podatakNiz[1]?.trim() ?? "";
            
            console.log(`Učitano: ${naziv} = ${vrijednost}`);  // Dodajte ovo za praćenje
    
            konf[naziv] = vrijednost;
        }
    
        this.konf = konf as tipKonf;
    }
    

    private provjeriPodatkeKonfiguracije() {
        console.log("Provjera podataka:", this.konf);

        if (!this.konf.tmdbApiKeyV3 || this.konf.tmdbApiKeyV3.trim() === "") {
          throw new Error("Fali TMDB API ključ u tmdbApiKeyV3");
        }
    
        if (!this.konf.jwtValjanost || this.konf.jwtValjanost.trim() === "") {
          throw new Error("Fali JWT valjanost");
        }
    
        if (!this.konf.jwtTajniKljuc || this.konf.jwtTajniKljuc.trim() === "") {
          throw new Error("Fali JWT tajni kljuc");
        }
    
        if (!this.konf.tajniKljucSesija || this.konf.tajniKljucSesija.trim() === "") {
          throw new Error("Fali tajni ključ sesije");
        }
    
        if (!this.konf.tmdbApiKeyV4 || this.konf.tmdbApiKeyV4.trim() === "") {
          throw new Error("Fali TMDB API ključ u tmdbApiKeyV4");
        }
    
        const jwtValjanost = parseInt(this.konf.jwtValjanost);
        if (isNaN(jwtValjanost) || jwtValjanost < 15 || jwtValjanost > 3600) {
          throw new Error("jwtValjanost mora biti broj između 15 i 3600");
        }
    
        if (this.konf.jwtTajniKljuc.length < 50 || this.konf.jwtTajniKljuc.length > 100) {
          throw new Error("jwtTajniKljuc mora imati između 50 i 100 znakova");
        }
    
        if (this.konf.tajniKljucSesija.length < 50 || this.konf.tajniKljucSesija.length > 100) {
          throw new Error("tajniKljucSesija mora imati između 50 i 100 znakova");
        }
    }
    
}
