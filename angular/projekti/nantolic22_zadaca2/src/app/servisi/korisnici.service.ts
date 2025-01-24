 import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { mergeWith, Observable } from 'rxjs';
import { KorisnikI } from './servisI/korisniciI';

@Injectable({
  providedIn: 'root'
})

export class KorisniciService {
  private restServis = environment.restServis;

  constructor() { }

  async getKorisnici(): Promise<KorisnikI[]>{
    const url = this.restServis + "servis/app/korisnici";
    const zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json"); 

    const parametri = {
      method: "GET",
      headers: zaglavlje
    };

      try{
        const odgovor = await fetch(url, parametri);
        if(odgovor.ok){
          return await odgovor.json();
        }
        else{
          console.log("Greška pri dohvaćanju korisnika, status:", odgovor.status, odgovor.statusText);
          return [];
        }
      } catch(error){
        console.log("Greška pri dohvaćanju korisnika: ", error);
        return [];
      }
  }

  async obrisiKorisnika(korime: string): Promise<void> {
    const url = `${this.restServis}servis/app/korisnici/${korime}`;
    const zaglavlje = new Headers();
    zaglavlje.set("Content-Type", "application/json");

    const parametri = {
      method: "DELETE",
      headers: zaglavlje
    };

    try {
      const odgovor = await fetch(url, parametri);
      if (!odgovor.ok) {
        console.log("Greška pri brisanju korisnika, status:", odgovor.status, odgovor.statusText);
      }
    } catch (error) {
      console.log("Greška pri brisanju korisnika:", error);
    }
  }
}
