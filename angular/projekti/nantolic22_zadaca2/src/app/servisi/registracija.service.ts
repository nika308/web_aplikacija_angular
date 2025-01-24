import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RegistracijaService {
  restServis = environment.restServis;

  async registracija(
    ime: string,
    prezime: string,
    korisnickoIme: string,
    lozinka: string,
    email: string,
    adresa: string,
    datumRodenja: string,
    telefon: string
  ): Promise<boolean> {
    if (!korisnickoIme || !lozinka || !email) {
      console.log('Obavezna polja nisu popunjena.');
      return false;
    }
  
    const tijelo = {
      ime,
      prezime,
      korime: korisnickoIme,
      lozinka,
      email,
      adresa,
      datum_rodenja: datumRodenja,
      telefon
    };
  
    const zaglavlje = new Headers();
    zaglavlje.set('Content-Type', 'application/json');
  
    const parametri = {
      method: 'POST',
      body: JSON.stringify(tijelo),
      headers: zaglavlje
    };
  
    try {
      const odgovor = await fetch(this.restServis + 'servis/app/registracija', parametri);
      if (odgovor.status === 200 || odgovor.status === 201) {
        console.log('Registracija uspješna.');
        return true;
      } else {
        console.log('Greška pri registraciji, status:', odgovor.status, odgovor.statusText);
        return false;
      }
    } catch (error) {
      console.log('Greška pri registraciji:', error);
      return false;
    }
  }

}
