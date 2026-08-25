UPUTSTVO ZA POKRETANJE SISTEMA

1. Konfiguracija okruzenja:
   
U korenskom direktorijumu frontend projekta kreirati .env fajl sa baznim URL-om API Gateway-a: 
Primer: API_BASE_URL=http://localhost:8081/api

2. SQL migracije:
U Package Manager Console-u (ili terminalu) pokrenuti EF Core migracije za kreiranje i ažuriranje baza podataka po servisima:
dotnet ef database update --project AuthService
dotnet ef database update --project TravelService
dotnet ef database update --project FinanceService
dotnet ef database update --project ChecklistService

3. Pokretanje backenda:
- Pokrenuti Azure Service Fabric Local Cluster Manager
- Otvoriti resenje u Visual Studio 2022. (kao administrator)
- Postaviti Service Fabric projekat kao startup i pokrenuti

4. Pokretanje frontenda:
U terminalu se pozicionirati u root frontend projekta i pokrenuti komande:
npm install
npm run dev

ARHITEKTURA SISTEMA

Sistem je projektovan koriscenjem mikroservisne arhitekture.

Slojevi sistema:

1. Klijentski sloj
   - Korisnicki interfejs: React single page application
   - Komunikacija: Klijent komunicira sa backendom slanjem asinhronih HTTP/REST zahteva (koristeci axios)
   - Konfiguracija: Adrese eksternih servisa se ucitavaju dinamicki iz .env fajla
2. Sloj API Gateway
   - Rutiranje: Svi klijentski zahtevi stizu najpre na API Gateway, koji sluzi kao jedinstvena ulazna tacka sistema
   - Autentifikacija i sigurnost: Centralizovano upravljanje JWT tokenima, provera validnosti potpisa i isteka tokena pre prosledjivanja zahteva mikroservisima
3. Sloj mikroservisa
   - Auth Service: Zaduzen za registraciju, prijavu korisnika, sigurno hesiranje i izdavanje JWT tokena
   - Finance Service: Upravlja budzetom putovanja, evidentira pojedinacne troskove i vrsi automatsku sinhronizaciju procenjenih troskova aktivnosti
   - Checklist Service: Omogucava kreiranje i pracenje liste stavki za pakovanje po planu putovanja
   - Travel Service (stateful): Centralni servis za kreiranje i upravljanje planovima putovanja, kao i kreiranje destinacija i aktivnosti za svako putovanje.
4. Sloj podataka
   - Svaki mikroservis poseduje vlastitu relacionu bazu podataka
   - Koriste se SQL migracije
<img width="975" height="603" alt="ArhitekturaSistema" src="https://github.com/user-attachments/assets/b5167f24-da7d-4733-a25d-9dcf1e3e0e7a" />

USE CASE DIJAGRAM


<img width="637" height="702" alt="usecaseDiagram" src="https://github.com/user-attachments/assets/938726d2-24d9-4d33-bb79-c703f62fa3df" />

