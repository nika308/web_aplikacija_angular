import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PrijavaComponent } from './prijava/prijava.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { OdjavaComponent } from './odjava/odjava.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { OsobeComponent } from './osobe/osobe.component';
import { KorisniciComponent } from './korisnici/korisnici.component';
import { DodavanjeComponent } from './dodavanje/dodavanje.component';
import { DokumentacijaComponent } from './dokumentacija/dokumentacija.component';
import { HttpClientModule } from '@angular/common/http';
import { FilmoviComponent } from './filmovi/filmovi.component';
import { DetaljiOsobeComponent } from './detalji-osobe/detalji-osobe.component';


const routes: Routes = [
  { path: 'pocetna', component: PocetnaComponent },
  { path: 'prijava', component: PrijavaComponent },
  { path: 'odjava', component: OdjavaComponent },
  { path: 'registracija', component: RegistracijaComponent },
  { path: 'dokumentacija', component: DokumentacijaComponent },
  { path: 'osobe', component: OsobeComponent },
  { path: 'filmovi', component: FilmoviComponent },
  { path: 'korisnici', component: KorisniciComponent },
  { path: 'dodavanje', component: DodavanjeComponent },
  { path: '', redirectTo: '/prijava', pathMatch: 'full' }

];

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    PocetnaComponent,
    OdjavaComponent,
    RegistracijaComponent,
    OsobeComponent,
    KorisniciComponent,
    DodavanjeComponent,
    DokumentacijaComponent,
    FilmoviComponent,
    DetaljiOsobeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(routes),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
