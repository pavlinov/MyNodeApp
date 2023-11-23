# MyNodeApp - Small Node.js Web Application

This Node.js web application provides a basic user system with registration, login/logout functionality, and article management, including adding new articles and updating user permissions.

## Features

- User authentication (register/login/logout)
- User authorization (admin and edit permissions)
- Article creation and listing
- User management by administrators

## Prerequisites

Before running this application, make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm (Node Package Manager)](https://www.npmjs.com/)

## Quick Start

1. Clone the repository to your local machine:

    

    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    

2. Install the dependencies:

    
 
   npm install
    

3. Start the application:

    
   
 npm start
    

  
  The application should be running on [http://localhost:3000](http://localhost:3000).

4. Interact with the application using a web browser or tools like [curl](https://curl.se/) or [Postman](https://www.postman.com/).
Login page
## Application Structure

- app.js - The entry point to the application. This file defines the Express server and connects it to the database with sqlite3, sets up the middleware, defines the routes, and starts the server.
- db.js - Handles connection to the database and includes functions for user and article operations.
- models/ - Contains the model classes for users and articles.
- routes/ - Defines the route handlers for our application.
- views/ - Contains the EJS templates for the application.
- public/ - Contains static assets like stylesheets and images.
- middlewares/ - Contains custom middleware for the application.

## Database Setup

The application uses an SQLite3 database. You need to create the initial schema by running the following command:

```sh
node sqlite_migrate_db.js
```

## Screenshots

Login page:
![Login page](assets/2023-11-23%2021-30-03.png)

Registration Page:
![Registration Page](assets/2023-11-23%2021-45-02.png)

Admin Home page:
![Home admin page](assets/2023-11-23%2021-39-16.png)

User managment:
![User managment](assets/2023-11-23%2021-39-33.png)

User Home page:
![User home](assets/2023-11-23%2021-39-51.png)

Articles page:
![Articles page](assets/2023-11-23%2021-36-38.png)