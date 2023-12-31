# Restaurants
A simple restaurant web application for foodie

## Features
- List restaurants.
- Search restaurants by name or category.
- Show restaurant details: address, Google Map link, phone number, introduction.
- Add, edit and delete restaurants in the list.
- Register, login and logout.

## Prerequisites

- Node.js v18.15.0
- Express 4.18.2
- Express-Handlebars 7.0.4
- Bootstrap 5.1.3
- Font-awesome v6
- method-override 3.0.0
- mysql2 3.2.0
- sequelize 6.30.0
- sequelize-cli 6.6.0

## Installation

1. Please make sure you have node.js and npm installed first.

2. Clone the repository.

```
git clone https://github.com/lovepp0518/Restaurants-CRUD.git
```

3. Move to the project folder via terminal and execute the code below to install the dependencies.

```
npm install
```

4. Execute the code below in MySQL to create the restaurant database.

```
CREATE DATABASE restaurant;
```

5. Execute the code below in terminal to create data table and import seed data.

```
npx sequelize db:migrate
```
```
npm run seed
```

6. Setup environment variable(NODE_ENV).

```
export NODE_ENV=development
```

7. Execute the code below to start the server.

```
npm run start
```

8. You can see the massage in the terminal. Now you can open the browser and go to the following URL.

```
express server is running on http://localhost:3000
```
