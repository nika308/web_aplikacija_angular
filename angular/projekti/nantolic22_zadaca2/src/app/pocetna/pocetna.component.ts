import { Component } from '@angular/core';
import { PrijavaService } from '../servisi/prijava.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pocetna',
  standalone: false,
  
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.scss'
})

export class PocetnaComponent {
  korisnik: any = {};  
  poruka: string = '';  
  tipKorisnika: number | null = null;

  constructor(
    private prijavaService: PrijavaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.prijavaService.jePrijavljen()) {
      this.router.navigate(['/prijava']);
    } else {
      const korisnikString = localStorage.getItem("korisnik");
      if (korisnikString) {
        this.korisnik = JSON.parse(korisnikString); 
        this.tipKorisnika = this.korisnik.tip_korisnika_id;
      }
    }
  }

  imaPristup(): boolean {
    return this.tipKorisnika === 1; 
  }
}
