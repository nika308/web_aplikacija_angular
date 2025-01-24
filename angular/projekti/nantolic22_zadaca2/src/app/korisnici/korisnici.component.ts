import { Component } from '@angular/core';
import { KorisniciService } from '../servisi/korisnici.service';
import { KorisnikI } from '../servisi/servisI/korisniciI';

@Component({
  selector: 'app-korisnici',
  standalone: false,
  
  templateUrl: './korisnici.component.html',
  styleUrl: './korisnici.component.scss'
})

export class KorisniciComponent {
  korisnici: KorisnikI[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private korisniciService: KorisniciService) {}

  ngOnInit(): void {
    this.dohvatiKorisnike();
  }

  async dohvatiKorisnike(): Promise<void> {
    this.loading = true;
    this.error = null;
    try {
      this.korisnici = await this.korisniciService.getKorisnici();
    } catch (error) {
      this.error = 'Došlo je do greške pri dohvaćanju korisnika.';
      console.error(error);
    } finally {
      this.loading = false;
    }
  }

  async obrisiKorisnika(korime: string): Promise<void> {
    if (korime === 'admin') {
      alert('Nije moguće obrisati admina!');
      return;
    }

    if (confirm('Jeste li sigurni da želite obrisati ovog korisnika?')) {
      try {
        await this.korisniciService.obrisiKorisnika(korime);
        this.korisnici = this.korisnici.filter(k => k.korime !== korime);
      } catch (error) {
        alert('Došlo je do greške pri brisanju korisnika.');
        console.error(error);
      }
    } else {
      console.log('Brisanje korisnika otkazano.');
    }
  }
  
}