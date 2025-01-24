import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilmoviService {
  restServis = environment.restServis;
  constructor() { }

  async dohvatiFilmovePoDatumu(stranica: number, datumOd?: string, datumDo?: string): Promise<any[]> {
    let url = `${this.restServis}servis/app/filmovi?stranica=${stranica}`;
  
    if (datumOd) {
      url += `&datumOd=${datumOd}`;
    }
    if (datumDo) {
      url += `&datumDo=${datumDo}`;
    }
  
    const odgovor = await fetch(url);
    if (!odgovor.ok) {
      throw new Error('Greška pri dohvaćanju filmova');
    }
  
    return odgovor.json();
  }
}
