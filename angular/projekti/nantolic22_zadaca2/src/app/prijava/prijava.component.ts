import { Component } from '@angular/core';
import { PrijavaService } from '../servisi/prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.scss',
  standalone: false
})

export class PrijavaComponent {
  korisnickoIme: string = '';
  lozinka: string = '';
  errorPoruka: string = '';

  constructor(private prijavaService: PrijavaService, private router: Router){}

  async prijaviSe(): Promise<void> {
    this.errorPoruka = ''; 

    if (!this.korisnickoIme || !this.lozinka) {
      this.errorPoruka = 'Morate unijeti korisničko ime i lozinku!';
      return;
    }

    try {
      const uspjeh = await this.prijavaService.prijava(this.korisnickoIme, this.lozinka);
      if (uspjeh) {
        this.router.navigate(['pocetna']);  
      } else {
        this.errorPoruka = 'Neispravno korisničko ime ili lozinka!';
      }
    } catch (error) {
      console.error("Greška pri prijavi:", error);
      this.errorPoruka = 'Greška pri komunikaciji sa serverom!';
    }
  }
}
