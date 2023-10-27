Add .development.env file to project
To run this project localy use
- npm install 
- npm run start:dev Or yarn start:dev


Docker development:

* `cp .env.example .development.env`
* `nano .development.env`
* `docker-compose -f docker-compose.dev.yml --env-file=.development.env build`
* `docker-compose -f docker-compose.dev.yml --env-file=.development.env up`

Postgres export:

* `./scripts/postgres/export.sh prod|dev ./export.sql`

Postgres import:

* `./scripts/postgres/export.sh prod|dev ./import.sql`

For Swagger api localhost:/port/api-docs

For running locally
docker run --name mypostgres -e POSTGRES_PASSWORD=password -e POSTGRES_USER=username -e POSTGRES_DB=dbname -p 5433:5432 -d postgres

Migrations
* - npm run migration:generate -- Name
* - npm run migration:run

* `npm run migration:generate - Name`
* `npm run migration:run`

Windows 
`migration generate command:`
`npm run migration:create:win --name=name_migration`
