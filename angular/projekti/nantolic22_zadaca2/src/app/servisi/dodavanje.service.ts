import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { OdjavaComponent } from '../odjava/odjava.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DodavanjeService {
  restServis = environment.restServis;

  constructor() {}

  async dodajOsobu(osobaData: any): Promise<any> {
    const url = this.restServis + "servis/app/dodajOsobu";
    try {
      const odgovor = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(osobaData),
      });
      if(!odgovor.ok) {
        throw new Error(`Greška: ${odgovor.statusText}`);
      }
      const podaci = await odgovor.json();
      return podaci;
    } catch(error) {
      console.log("Greška pri dodavanju osobe: ", error);
      throw error;
    }
  }

  async ukloniOsobu(tmdb_id: number): Promise<any> {
    const url = this.restServis + `servis/app/obrisiOsobu/${tmdb_id}`;
    console.log("Poslani URL za brisanje: ", url);
    try {
      const odgovor = await fetch(url, {
        method: "DELETE",
      });

      if (!odgovor.ok) {
        throw new Error(`Greška: ${odgovor.statusText}`);
      }

      const data = await odgovor.json();
      return data;
    } catch (error) {
      console.error("Greška pri brisanju osobe:", error);
      throw error;
    }
  }

  async provjeriPostojanjeOsobe(tmdb_id: number): Promise<any> {
    const url = this.restServis + "servis/app/provjeriPostojanjeOsobe";

    try {
      const odgovor = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tmdb_id }),
      });

      if (!odgovor.ok) {
        throw new Error(`Greška: ${odgovor.statusText}`);
      }

      const data = await odgovor.json();
      return data;
    } catch (error) {
      console.error("Greška pri provjeri postojanja osobe:", error);
      throw error;
    }
  }

  async pretraziOsobe(query: string, page: number): Promise<any> {
    const url = `${this.restServis}servis/app/pretrazivanjeOsoba?query=${encodeURIComponent(query)}&page=${page}`;

    try {
      const odgovor = await fetch(url, {
        method: "GET",
      });

      if (!odgovor.ok) {
        throw new Error(`Error: ${odgovor.statusText}`);
      }

      const data = await odgovor.json();
      return data;
    } catch (error) {
      console.error("Greška pri pretrazi osoba:", error);
      throw error;
    }
  }

}
