const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

const validId = (request, response, next) => {
  const { id } = request.params;

  const repoId = repositories.findIndex(repo => repo.id === id);
  
  if(!isUuid(id) || repoId < 0){
    return response.status(400).json({
      error: 'Invalid id.',
    })
  }

  request.repoId = repoId;

  return next();
}

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', validId);

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(newRepository);
  
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { repoId } = request;
  
  repositories[repoId] = {
    ...repositories[repoId],
    title,
    url,
    techs
  };

  return response.json(repositories[repoId]);
});

app.delete("/repositories/:id", (request, response) => {
  const { repoId } = request;

  repositories.splice(repoId, 1);

  response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { repoId } = request;

  repositories[repoId].likes += 1;

  return response.status(200).json(repositories[repoId]);
});

module.exports = app;
