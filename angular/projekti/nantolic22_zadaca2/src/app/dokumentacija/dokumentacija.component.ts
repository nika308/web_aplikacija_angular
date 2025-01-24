import { Component, OnInit } from '@angular/core';
import { DokumentacijaService } from '../servisi/dokumentacija.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dokumentacija',
  standalone: false,
  
  templateUrl: './dokumentacija.component.html',
  styleUrls: ['./dokumentacija.component.scss']
})

export class DokumentacijaComponent{
  dokumentacija: SafeHtml = ''; 

  constructor(
    private dokumentacijaService: DokumentacijaService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.dohvatiDokumentaciju();
  }

  async dohvatiDokumentaciju(): Promise<void> {
    try {
      const htmlContent = await this.dokumentacijaService.getDokumentacija();
      const updatedHtml = htmlContent.replace(
        /src="\/dokumentacija/g, 'src="http://localhost:12222/dokumentacija'
      );
      this.dokumentacija = this.sanitizer.bypassSecurityTrustHtml(updatedHtml);
    } catch (error) {
      console.error('Greška prilikom učitavanja dokumentacije:', error);
    }
  }
}
