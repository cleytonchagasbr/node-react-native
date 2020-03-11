const express = require('express');

const server = express();
server.use(express.json());

// Query params = teste=1  , request.query.nome
// Route params = /users/1 , server.get('/users/:id', (request, response) => , request.params.id;
// Request body = { message: 'Hello' }

// Crud

const users = ['user1', 'Cleyton', 'user3'];

server.use((request, response, next) => {
    console.log(`Método: ${request.method}; URL: ${request.url}`);
    return next();
});

function checkUserExists(request, response, next) {
    if(!request.body.name) {
        return response.status(400).json({ error: 'User name is required'});
    }

    return next();
}

function checkUserInArray(request, response, next) {
    const user = users[request.params.index];

    if(!users[request.params.index]) {
        return response.status(400).json({ error: 'User not exists'});
    }

    request.user = user;

    return next();
}

server.get('/users/:index', checkUserInArray, (request, response) => {
    return response.json(request.user);
});

server.get('/users', (request, response ) => {
    return response.json(users);
});

server.post('/users', checkUserExists, (request, response) => {
    const { name } = request.body;
    users.push(name);

    return response.json(users);

});

server.put('/users/:index', checkUserExists, checkUserInArray, (request, response) => {
    const { index } = request.params; 
    const { name } = request.body;
    users[index] = name;

    return response.send();
});

server.delete('/users/:index', (request, response) => {
    const { index } = request.params;
    users.splice(index, 1);

    return response.json(users);
});

server.listen(3000);