# Statistics

Full stack that provides all the tools to store and visualize custom usage statistics using docker

- mongodb
- node-red: <http://localhost:1880>
- Backend (for apis): <http://localhost:5000>
- MongoDB charts: <http://localhost:9999>

## Install

```bash
git clone https://github.com/robertsLando/statistics-server.git
cd statistics-server
docker-compose up
```

## Update

```bash
git pull
docker-compose down && docker-compose up --build
```

`docker-compose up --build` is needed to force re-build of backend apis container

## Credentials

Set up the MongoDB Charts credentials with:
```bash
docker exec -it \
  $(docker container ls --filter name=charts_ -q) \
  charts-cli add-user --first-name "<First>" --last-name "<Last>" \
  --email "<user@example.com>" --password "<Password>" \
  --role "<UserAdmin|User>"
```

Example creating a default admin user:

```bash
docker exec -it \
  $(docker container ls --filter name=charts_ -q) \
  charts-cli add-user --first-name "Admin" --last-name "MongoDB" \
  --email "admin@example.com" --password "mongodb" \
  --role "UserAdmin"
```

## Backend

Uses an Express server to provide apis to store statistics to MongoDB. The only thing that needs to be configured are the database name, the collections with their unique fields and (optionally) your apis validators. Unique fields are necessary to identify a document uniquely in the DB, validators are required to validate body, headers, query of api requests. This can be done [here](backend/config)

### APIs

#### Auth

Auth protected routes expect an header `x-api-token` with content `<key>` where `key` is the key you have set on config/app.js file.

#### POST `/statistics`

**Requires AUTH**

Used to add statistics to the db. The individual docs are added using `upsert`, it means that if the document exists in the db it will be updated, otherwise a new doc will be added. The expected payload is:

```js
{
    "collection": "collectionName", // optional
    "data": [{...}, {...}, ...], // array of documents to add to the collection
}
```

If no collection name is provided the default collection will be used: `statistics`. The default collection has a unique field named `id` that the user can use to uniquely identify an entry in the collection

## Projects

Here is a list of projects that are currently using this as stack as base:

- [zwave-js/statistics-server](https://github.com/zwave-js/statistics-server)
