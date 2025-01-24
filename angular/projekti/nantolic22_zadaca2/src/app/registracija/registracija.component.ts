import { Component } from '@angular/core';
import { RegistracijaService } from '../servisi/registracija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registracija',
  standalone: false,
  
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.scss'
})

export class RegistracijaComponent {
  ime: string = '';
  prezime: string = '';
  korisnickoIme: string = '';
  lozinka: string = '';
  email: string = '';
  adresa: string = '';
  datumRodenja: string = '';
  telefon: string = '';
  errorPoruka: string = '';

  constructor(
    private registracijaService: RegistracijaService,
    private router: Router
  ) {}

  async registrirajSe(): Promise<void> {
    this.errorPoruka = '';

    if (!this.korisnickoIme || !this.lozinka || !this.email) {
      this.errorPoruka = 'Korisničko ime, lozinka i email su obavezni!';
      return;
    }

    try {
      const uspjeh = await this.registracijaService.registracija(
        this.ime,
        this.prezime,
        this.korisnickoIme,
        this.lozinka,
        this.email,
        this.adresa,
        this.datumRodenja,
        this.telefon
      );

      if (uspjeh) {
        this.router.navigate(['/prijava']); 
      } else {
        this.errorPoruka = 'Greška kod registracije';
      }
    } catch (error) {
      console.error('Greška pri registraciji:', error);
      if ((error as Error).message === 'Korisničko ime ili email već postoji!') {
        this.errorPoruka = 'Korisničko ime ili email već postoji!';
      } else {
        this.errorPoruka = 'Došlo je do nepoznate greške. Pokušajte ponovno.';
      }
    }
  }
}
