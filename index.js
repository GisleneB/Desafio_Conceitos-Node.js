const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  
  const user = users.find(user => user.username === username);

  if (!user) {
    return response.status(404).json({erro: 'Ops, deu erro'})
  }

  request.user = user;
  return next();
 
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const checksExistsUserAccount = users.some(
    (users) => users.username === username
  );

  if (checksExistsUserAccount) {
    return response.status(400).json({ error: 'Este usúario já existe' });
  }

  const user = { 
    id: uuidv4(),
    name, 
    username, 
    todos: []
  }

  users.push(user);

  return response.status(201).send();
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

   return response.json(user.todos);
  
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false, 
    deadline: new Date(deadline), 
    created_at: new Date()
  }

  user.todos.push(todo);
  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline} = request.bory;
  const { id } = request.params;

  const todo = user.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({erro: 'Deu erro!'})
  }
  
  todo.title = title;
  todo.deadline = new (deadline);

  return response.json(todo);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.find(todo => todo.id === id);

  if (!todo) {
    return response.status(404).json({erro: 'Deu erro!'})
  }

  todo.done = true;
  
  return response.json(user.todo);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if (todoIndex === -1) {
    return response.status(404).json({erro: 'Deu erro!'})
  }

  user.todos.splice(todoIndex, 1);

  return response.status(204).json();
});

module.exports = app;