export interface KorisnikI {
    tip_korisnika_id: number; 
    korime: string; 
    lozinka: string; 
    email: string; 
    ime?: string | undefined; 
    prezime?: string | undefined; 
    adresa?: string | undefined; 
    datum_rodenja?: string | undefined; 
    telefon?: string | undefined; 
  }