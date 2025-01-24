import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PrijavaService {
  restServis = environment.restServis;

  async prijava(korisnickoIme: string, lozinka: string): Promise<boolean> {
    const tijelo = {
        korime: korisnickoIme,
        lozinka: lozinka
    };

    const zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json"); 

    const parametri = {
        method: "POST",
        body: JSON.stringify(tijelo),  
        headers: zaglavlje,
    };

    try {
        const odgovor = await fetch(this.restServis + "servis/app/prijava", parametri); 
        if (odgovor.status === 200) {
          const podaci = await odgovor.json();      
          if (podaci && podaci.korisnik) {
              const korisnik = podaci.korisnik;
              if (korisnik.korime && korisnik.tip_korisnika_id) {
                  localStorage.setItem("korisnik", JSON.stringify(korisnik));

                  this.pohraniKorime(korisnik.korime);
                  return true;
              } else {
                  console.log("Pogrešni podaci korisnika: nedostaju potrebni podaci.");
                  return false;
              }
          } else {
              console.log("Pogrešni podaci korisnika: korisnik nije pronađen.");
              return false;
          }
      } else {
          console.log("Greška pri prijavi, status:", odgovor.status, odgovor.statusText);
          return false;
      }
    } catch (error) {
        console.log("Greška pri prijavi:", error);
        return false;
    }
  }

  tipKorisnika(): number | null {
    const korisnikString = localStorage.getItem("korisnik");
    if (korisnikString) {
      const korisnik = JSON.parse(korisnikString); 
      return korisnik.tip_korisnika_id; 

    }
    return null;
  }

  jePrijavljen(): boolean {
    return localStorage.getItem("korisnik") !== null;
  }

  pohraniKorime(korime: string): void {
    localStorage.setItem('korime', korime);
  }
  
  dohvatKorime(): string | null {
    return localStorage.getItem('korime');
  }
}