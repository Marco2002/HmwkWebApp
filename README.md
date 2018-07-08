# Homework Web Application
One howework planner for the whole class

## Prerequisites
* nodejs ^6.12.3
* npm ^3.10.10

## Installing

1. clone repository
```git clone https://github.com/Marco2002/HmwkWebApp.git```

2. install dependencies
```npm install```

3. setup env variables

    1 create .env file in the project folder 
    ```touch .env```
    
    2 set variables: 
        - SERVER_PORT,
        - SERVER_HOST,
        - COOKIE_SECRET,
        - COOKIE_NAME,
        - MONGO_DB,
        - VERSION,

4. create minify-cache directory
```mkdir minify-cache```
        
## Running the tests

run the app.js file
```node app.js```
the console should log _"server online on HOST: <HOST> , PORT: <PORT> "_

## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/Marco2002/HmwkWebApp/blob/master/LICENSE) file for details