import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class DokumentacijaService {
  restServis = environment.restServis;

  private dokumentacijaUrl = 'http://localhost:12222/dokumentacija'; 

  constructor() { }

  async getDokumentacija(): Promise<string> {
    try {
      const odgovor = await fetch(this.restServis + "dokumentacija");
      if (!odgovor.ok) {
        throw new Error(`HTTP greška! Status: ${odgovor.status}`);
      }
      const dokumentacija = await odgovor.text();
      return dokumentacija;
    } catch (error) {
      console.error("Greška prilikom dohvaćanja dokumentacije:", error);
      throw new Error("Greška prilikom dohvaćanja dokumentacije");
    }
  }

}
