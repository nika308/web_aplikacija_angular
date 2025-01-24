import { Component } from '@angular/core';
import { PrijavaService } from './servisi/prijava.service';
import { Route, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Web aplikacija - nantolic22';

  constructor(private prijavaService: PrijavaService, private router: Router){ 
  }

  ngOnInit(): void {

  }

  prijavljenKorisnik(): boolean{
    return this.prijavaService.jePrijavljen();
  }

  korisnikGost(): boolean{
    return this.prijavaService.tipKorisnika() === 0;
  }

  korisnikKorisnik(): boolean{
    return this.prijavaService.tipKorisnika() === 2;
  }

  korisnikAdmin(): boolean{
    return this.prijavaService.tipKorisnika() === 1;
  }

  odjava(): void {
    localStorage.removeItem("korisnik"); 
    this.router.navigate(['/prijava']); 
  }

  dokumentacija(): void{
    this.router.navigate(['/dokumentacija']);
  }

}
