import { Component } from '@angular/core';
import { DodavanjeService } from '../servisi/dodavanje.service';

@Component({
  selector: 'app-dodavanje',
  standalone: false,
  
  templateUrl: './dodavanje.component.html',
  styleUrl: './dodavanje.component.scss'
})

export class DodavanjeComponent {
  pretrazivanje: string = '';
  osobe: any[] = [];
  osobeUBazi: Set<number> = new Set(); 
  trenutnaStranica: number = 1;
  ukupnoStranica: number = 1;

  constructor(private dodavanjeService: DodavanjeService) {}

  async pretraziOsobe() {
    if (this.pretrazivanje.trim() === '') {
      this.osobe = [];
      this.osobeUBazi.clear();
      return;
    }

    try {
      const odgovor = await this.dodavanjeService.pretraziOsobe(this.pretrazivanje, this.trenutnaStranica);
      this.osobe = odgovor.results;
      this.ukupnoStranica = odgovor.total_pages;

      const provjere = await Promise.all(
        this.osobe.map((osoba) => this.dodavanjeService.provjeriPostojanjeOsobe(osoba.id))
      );

      this.osobeUBazi.clear();
      provjere.forEach((rezultat, index) => {
        if (rezultat.exists) {
          this.osobeUBazi.add(this.osobe[index].id);
        }
      });
    } catch (error) {
      console.error('Greška pri pretraživanju osoba:', error);
      alert('Greška pri pretraživanju osoba!');
    }
  }

  promijeniStranicu(page: number) {
    if (page >= 1 && page <= this.ukupnoStranica) {
      this.trenutnaStranica = page;
      this.pretraziOsobe();
    }
  }

  async dodajOsobu(osoba: any) {
    try {
      const osobaData = {
        tmdb_id: osoba.id,
        ime_prezime: osoba.name,
        poznat_po: osoba.known_for_department,
        slika: osoba.profile_path,
        popularnost: osoba.popularity
      };
      await this.dodavanjeService.dodajOsobu(osobaData);
      this.osobeUBazi.add(osoba.id);
      alert('Osoba uspješno dodana!');
    } catch (error) {
      console.error('Greška pri dodavanju osobe:', error);
      alert('Greška pri dodavanju osobe!');
    }
  }

  async ukloniIzBaze(tmdb_id: number) {
    try {
      await this.dodavanjeService.ukloniOsobu(tmdb_id);
      this.osobeUBazi.delete(tmdb_id);
      alert('Osoba uspješno uklonjena!');
    } catch (error) {
      console.error('Greška pri uklanjanju osobe:', error);
      alert('Greška pri uklanjanju osobe!');
    }
  }

  osobaUBazi(id: number): boolean {
    return this.osobeUBazi.has(id);
  }
}
