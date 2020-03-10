const express = require('express');

const server = express();
server.use(express.json());

// Query params = teste=1  , request.query.nome
// Route params = /users/1 , server.get('/users/:id', (request, response) => , request.params.id;
// Request body = { message: 'Hello' }

// Crud

const users = ['user1', 'Cleyton', 'user3'];

server.get('/users/:index', (request, response) => {

    const { index }  = request.params;

    return response.json(users[index]);
});

server.get('/users', (request, response ) => {
    return response.json(users);
});

server.post('/users', (request, response) => {

    const { name } = request.body;
    users.push(name);

    return response.json(users);

});

server.put('/users/:index', (request, response) => {

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