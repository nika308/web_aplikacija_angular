import { Component } from '@angular/core';
import { FilmoviService } from '../servisi/filmovi.service';

@Component({
  selector: 'app-filmovi',
  standalone: false,
  
  templateUrl: './filmovi.component.html',
  styleUrl: './filmovi.component.scss'
})

export class FilmoviComponent {
  filmovi: any[] = [];
  trenutnaStranica: number = 1;
  datumOd: string = ''; 
  datumDo: string = '';

  constructor(private filmoviService: FilmoviService) {}

  async ngOnInit(): Promise<void> {
    this.filmovi = await this.filmoviService.dohvatiFilmovePoDatumu(this.trenutnaStranica);
  }

  async pretraziFilmovePoDatumu(): Promise<void> {
    try {
      const filmovi = await this.filmoviService.dohvatiFilmovePoDatumu(
        this.trenutnaStranica,
        this.datumOd || undefined,
        this.datumDo || undefined
      );
      this.filmovi = filmovi;
    } catch (error) {
      console.error('Greška pri pretrazi filmova po datumu:', error);
    }
  }

  async promijeniStranicu(stranica: number): Promise<void> {
    this.trenutnaStranica = stranica;
    await this.pretraziFilmovePoDatumu();
  }
}
