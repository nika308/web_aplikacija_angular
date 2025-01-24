import jwt from "jsonwebtoken";
import {Request} from "express";

export function kreirajToken(korisnik: { korime: string, tip_korisnika_id: number }, tajniKljucJWT: string){
	let token = jwt.sign({ korime: korisnik.korime, tip_korisnika_id: korisnik.tip_korisnika_id  }, tajniKljucJWT, { expiresIn: "15s" });
  return token;
}

export function provjeriToken(zahtjev: Request, tajniKljucJWT: string) {
  if (zahtjev.headers.authorization != null) {
      console.log("PROVJERA: Zaglavlje:", zahtjev.headers.authorization);
      let token = zahtjev.headers.authorization.split(" ")[1] ?? "";
      console.log("PROVJERA: Token:", token);
      try {
          let podaci = jwt.verify(token, tajniKljucJWT);
          console.log("PROVJERA: Podaci iz tokena:", podaci);
          return podaci;
      } catch (e) {
          console.log("GREŠKA TOKENA:", e);
          return false;
      }
  }
  return false;
}

export function dajToken(zahtjev:Request) {
  return zahtjev.headers.authorization;
}

export function ispisiDijelove(token:string){
	let dijelovi = token.split(".");
  if(dijelovi[0] != undefined){
	  let zaglavlje =  dekodirajBase64(dijelovi[0]);
	  console.log(zaglavlje);
  }
  if(dijelovi[1] != undefined){
	  let tijelo =  dekodirajBase64(dijelovi[1]);
	  console.log(tijelo);
  }
  if(dijelovi[2] != undefined){
	  let potpis =  dekodirajBase64(dijelovi[2]);
	  console.log(potpis);
  }
}

export function dajTijelo(token:string){
	let dijelovi = token.split(".");
  if(dijelovi[1] == undefined)
    return {};
	return JSON.parse(dekodirajBase64(dijelovi[1]));
}

export function dajZaglavlje(token:string){
	let dijelovi = token.split(".");
  if(dijelovi[1] == undefined)
    return {};
	return JSON.parse(dekodirajBase64(dijelovi[1]));
}

function dekodirajBase64(data:string){
	let buff = Buffer.from(data, 'base64');
	return buff.toString('ascii');
}
