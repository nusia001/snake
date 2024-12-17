# Snake Game

Dette er et enkel Snake-spill laget med HTML, CSS, JavaScript og Python. Spillet lar deg styre en slange som vokser etter hver mat du spiser, og målet er å nå så høy poengsum som mulig uten å krasje i veggen eller i deg selv. Hver gang du får en highscore, lagres denne i en MariaDB-database på en Raspberry Pi.

## Hva du trenger

Før du kan kjøre spillet, må du sørge for at følgende programvare er installert:

- **Python**: Flask brukes i Python, så du trenger Python installert. Du kan laste ned Python fra [python.org](https://www.python.org/downloads/).
- **MariaDB**: MariaDB er brukt til å lagre høye highscore. Du kan installere MariaDB på din Raspberry Pi eller lokalt. Les mer om MariaDB [her](https://mariadb.org/).
- **Flask**: Flask brukes til å lagre data. Flask kan installeres gjennom CMD.

### Installere Flask og MariaDB-connector

1. Installer Flask og MariaDB-connector for Python gjennom CMD:
   ```bash
   pip install Flask mariadb

   pip install mysql-connector-python
   ```

## Hvordan du laster ned og setter opp prosjektet

1. **Klon prosjektet**:
   Du kan laste ned prosjektet ved å klone Git-repositoriet eller laste ned filene direkte.

   For å klone prosjektet, bruk git:
   ```bash
   git clone https://github.com/nusia001/snake.git
   ```

2. **Sett opp MariaDB-databasen**:
   Sørg for at MariaDB er installert og kjører. Deretter må du opprette en database og en tabell for å lagre highscore. Du kan bruke følgende kode for å opprette tabellen:

   ```sql
   CREATE DATABASE snake_game;
   USE snake_game;

   CREATE TABLE scores (
       id INT AUTO_INCREMENT PRIMARY KEY,
       highscore INT NOT NULL
   );
   ```

3. **Oppdater databasekonfigurasjonen**:
   I `app.py`-filen, oppdater databasenavn, bruker og passord.
   ```python
   def get_db_connection():
       conn = mariadb.connect(
           user="din_bruker",
           password="ditt_passord",
           host="localhost",
           port=3306,
           database="ditt_database"
       )
       return conn
   ```

## Hvordan kjøre prosjektet

1. **Start Live Server**:
   Åpne prosjektet i Visual Studio Code og start Live Server. Live Server kan man laste ned i "Extension"-seksjonen i Visual Studio Code.

2. **Bruk av tastene**:
   - Bruk **piltastene** (opp, ned, venstre, høyre) eller **WASD** for å styre slangen.
   - Når du krasjer, kan du starte spillet på nytt med en "OK"-knapp når en alert kommer opp.


## Kjente problemer

- **Python-fil/database fungerer ikke**: Det er et problem med å koble til databasen og lagre highscoren.