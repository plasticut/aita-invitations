AITA Invitations
============
# Cli:
Start MongoDB database cluster:
```
$ docker/start_mongodb.sh
```
Create mocks:
```
# if an error occurs, wait until the cluster is initialized
$ npm run mockdb
```
Start dev server:
```
$ docker/start_app.sh
```
or
```
$ npm start
```
Run tests:
```
$ docker/start_tests.sh
```
or
```
$ npm test
```

Server starts at `localhost:3000`

# Available routes:

### Swagger docs:
`GET /swagger`
### Swagger schema:
`GET /swagger/api-docs`

### Index page
`GET /`
### Boarding now page
`GET /boarding`
### Flights map page
`GET /map`

### Get events list:
`GET /api/v1/events`
### Get travellers list:
`GET /api/v1/travelers`
### Get invitations list:
`GET /api/v1/invitations`
### Create invitation:
`POST /api/v1/invitations`
### Get invitation by id:
`GET /api/v1/invitations/{invitationId}`
### Download invitation image _(barcode contains invite object id)_
`GET /api/v1/invitations/{invitationId}/image`
### Activate invitation by id:
`POST /api/v1/invitations/{invitationId}/activate`


