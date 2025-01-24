import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OsobeService {
  restServis = environment.restServis;

  constructor() { }

  async dajOsobePoStranici(stranica: number, broj: number): Promise<any> {
    const url = `${this.restServis}servis/app/osobe?stranica=${stranica}&broj=${broj}`;

    const zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');
  
    const parametri = {
      method: 'GET',
      headers: zaglavlje
    };
  
    try {
      const odgovor = await fetch(url, parametri);
      
      if (!odgovor.ok) {
        console.log('Greška: Server vratio status:', odgovor.status);
        console.log('Puni odgovor servera:', await odgovor.text());  
        throw new Error('Greška pri dohvaćanju osoba: ' + odgovor.status);
      }
  
      const responseText = await odgovor.text();
      const data = JSON.parse(responseText); 
      return data;
    } catch (error) {
      console.log('Greška pri dohvaćanju osoba:', error);
      throw error;  
    }
  }

}
