# node-postgres-app

A simple Node.js application with Express.js and Sequelize (PostgreSQL).

## Getting Started

To get started, you need to create a files:
* config/.env (based on config/.env.example)
* config/dev.env (based on config/dev.env.example)
* config/test.env (based on config/test.env.example)

Configure them in accordance with your environment. Once this is done, database settings are ready!

**Running app**

```
npm install
npm start
```

**Running tests**

```
npm run test
```

## How it works

**Endpoints**

On the server we now have the following endpoints:

Endpoint | Description
----------|------------
POST /users | Create a user
POST /login | User authentication 
GET /users/:id | Get details about a user (need auth-token)
PUT /users/:id | Update a user (need auth-token)


To use endpoints "GET / users /: id" and "PUT / users /: id", we first need to use the endpoint "POST / login" to authenticate. There we will get an "x-auth" token that should be used to be authentication.