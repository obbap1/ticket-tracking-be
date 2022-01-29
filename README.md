## Start the server
To start the server, run:
```
npm run start
```
To start the postgres / redis instances:
```
docker-compose up --build
```

The server runs on port 3000 

Postgres:6431

Redis:6399

## Health check 
```
POST http://localhost:3000/v1/health
```