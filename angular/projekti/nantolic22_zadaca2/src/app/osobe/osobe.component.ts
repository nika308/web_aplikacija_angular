import { Component } from '@angular/core';
import { OsobeService } from '../servisi/osobe.service';

@Component({
  selector: 'app-osobe',
  standalone: false,
  
  templateUrl: './osobe.component.html',
  styleUrl: './osobe.component.scss'
})

export class OsobeComponent {
  osobe: any[] = [];
  trenutnaStranica = 1;
  brojOsobaPoStranici = 10;
  ukupnoStranica: number = 0;
  error: string = '';

  constructor(private osobeService: OsobeService) { }

  ngOnInit(): void {
    this.dohvatiOsobe(this.trenutnaStranica);
  }

  async dohvatiOsobe(stranica: number): Promise<void> {
    try {
      const data = await this.osobeService.dajOsobePoStranici(stranica, this.brojOsobaPoStranici);
      if (data) {
        this.osobe = data.osobe;
        this.ukupnoStranica = Math.ceil(data.ukupnoOsoba / this.brojOsobaPoStranici);
      } else {
        this.error = "Ne možemo dohvatiti podatke o osobama.";
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju osoba:", error);
      this.error = "Došlo je do greške pri dohvaćanju osoba.";
    }
  }

  azurirajPaginaciju(stranica: number): void {
    this.trenutnaStranica = stranica;
  }

  idiNaStranicu(smjer: string): void {
    if (smjer === "prethodna" && this.trenutnaStranica > 1) {
      this.trenutnaStranica--;
    } else if (smjer === "sljedeca") {
      this.trenutnaStranica++;
    }
    this.dohvatiOsobe(this.trenutnaStranica);
  }

  promijeniStavkePoStranici(): void {
    const select = (document.getElementById("brOsoba") as HTMLSelectElement);
    this.brojOsobaPoStranici = parseInt(select.value);
    this.trenutnaStranica = 1; 
    this.dohvatiOsobe(this.trenutnaStranica);
  }
}
