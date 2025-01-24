-- Creator:       MySQL Workbench 8.0.36/ExportSQLite Plugin 0.1.0
-- Author:        Unknown
-- Caption:       New Model
-- Project:       Name of the project
-- Changed:       2024-11-22 15:06
-- Created:       2024-10-27 18:37


-- Schema: RWA2024nantolic22_servis
BEGIN;
CREATE TABLE "film"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(200) NOT NULL,
  "originalni_naziv" VARCHAR(200) NOT NULL,
  "opis" TEXT NOT NULL,
  "datum_izlaska" DATE NOT NULL,
  "popularnost" DECIMAL NOT NULL,
  "jezik" VARCHAR(50) NOT NULL,
  "poster" TEXT NOT NULL,
  CONSTRAINT "tmdb_id_UNIQUE"
    UNIQUE("tmdb_id")
);

select * from film;

SELECT * FROM film_new
WHERE strftime('%Y-%m-%d', datum_izlaska) >= '2029-01-01'
  AND strftime('%Y-%m-%d', datum_izlaska) <= '2025-12-31';

CREATE TABLE "osoba"(
  "tmdb_id" INTEGER PRIMARY KEY NOT NULL,
  "ime_prezime" VARCHAR(200) NOT NULL,
  "poznat_po" VARCHAR(75) NOT NULL,
  "popularnost" DECIMAL NOT NULL,
  "slika" TEXT NOT NULL,
  CONSTRAINT "tmdb_id_UNIQUE"
    UNIQUE("tmdb_id")
);
CREATE TABLE "film_osoba"(
  "film_tmdb_id" INTEGER NOT NULL,
  "osoba_tmdb_id" INTEGER NOT NULL,
  "uloga" VARCHAR(75) NOT NULL,
  PRIMARY KEY("film_tmdb_id","osoba_tmdb_id"),
  CONSTRAINT "fk_film_osoba_film"
    FOREIGN KEY("film_tmdb_id")
    REFERENCES "film"("tmdb_id"),
  CONSTRAINT "fk_film_osoba_osoba1"
    FOREIGN KEY("osoba_tmdb_id")
    REFERENCES "osoba"("tmdb_id")
);
CREATE INDEX "film_osoba.fk_film_osoba_osoba1_idx" ON "film_osoba" ("osoba_tmdb_id");
CREATE TABLE "galerija"(
  "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
  "osoba_tmdb_id" INTEGER NOT NULL,
  "file_path" TEXT NOT NULL,
  CONSTRAINT "id_UNIQUE"
    UNIQUE("id"),
  CONSTRAINT "fk_slika_osoba1"
    FOREIGN KEY("osoba_tmdb_id")
    REFERENCES "osoba"("tmdb_id")
);
CREATE INDEX "galerija.fk_slika_osoba1_idx" ON "galerija" ("osoba_tmdb_id");
CREATE TABLE "tip_korisnika"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "naziv" VARCHAR(45) NOT NULL,
  "opis" TEXT
);
CREATE TABLE "korisnik"(
  "id" INTEGER PRIMARY KEY NOT NULL,
  "tip_korisnika_id" INTEGER NOT NULL,
  "korime" VARCHAR(50) NOT NULL,
  "lozinka" VARCHAR(100) NOT NULL,
  "email" VARCHAR(100) NOT NULL,
  "ime" VARCHAR(50),
  "prezime" VARCHAR(45),
  "adresa" TEXT,
  "datum_rodenja" DATE,
  "telefon" VARCHAR(45),
  CONSTRAINT "korime_UNIQUE"
    UNIQUE("korime"),
  CONSTRAINT "fk_korisnik_tip_korisnika1"
    FOREIGN KEY("tip_korisnika_id")
    REFERENCES "tip_korisnika"("id")
    ON DELETE RESTRICT
);
CREATE INDEX "korisnik.fk_korisnik_tip_korisnika1_idx" ON "korisnik" ("tip_korisnika_id");
COMMIT;

INSERT INTO tip_korisnika(naziv,opis)  VALUES("admin","administrator");
INSERT INTO tip_korisnika(naziv,opis)  VALUES("registrirani korisnik","registrirani korisnik");
INSERT INTO tip_korisnika(naziv,opis)  VALUES("gost","neregistrirani korisnik");

INSERT INTO korisnik(tip_korisnika_id, korime, lozinka, email) VALUES(1, "admin", "rwa", "admin@foi.hr");
INSERT INTO korisnik(tip_korisnika_id, korime, lozinka, email) VALUES(2, "obican", "rwa", "obican@foi.hr");


INSERT INTO film(tmdb_id, naziv, originalni_naziv, opis, datum_izlaska, popularnost, jezik, poster) 
VALUES (845781, 
'Red One', 
'Red One', 
'After Santa Claus (codename: Red One) is kidnapped, the North Poles Head of Security must team up with the worlds most infamous tracker in a globe-trotting, action-packed mission to save Christmas.', 
'2024-10-31', 
3229.196, 
'en', 
'/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg');



INSERT INTO film(tmdb_id, naziv, originalni_naziv, opis, datum_izlaska, popularnost, jezik, poster) 
VALUES (438148, 
'Society of the Snow', 
'La sociedad de la nieve', 
'', 
'60.586', 
68.016, 
'es', 
'/2e853FDVSIso600RqAMunPxiZjq.jpg');

select * from film;


