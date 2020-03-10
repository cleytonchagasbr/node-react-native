const express = require('express');

const server = express();

// Query params = teste=1  , request.query.nome
// Route params = /users/1 , server.get('/users/:id', (request, response) => , request.params.id;
// Request body = { message: 'Hello' }

server.get('/users/:id', (request, response) => {

    const { id }  = request.params;

    return response.json(
        { message: `${id}` }
    );
});


server.listen(3000);