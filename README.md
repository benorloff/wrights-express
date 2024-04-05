# Wright Spire

This repository consists of a minimal Express server. When the server receives a GET request it initiates a series of batched HTTP requests to an external REST API and creates a fs stream to append the response object to a local JSON file. Once all GET request batches are completed, the local JSON file is merged with a separate data resource to update the resources locally, before they are sent to the external REST API with PUT requests.

### Getting Started

```shell
git clone https://github.com/benorloff/wright-spire.git
cd wright-spire
npm install
cp .env.example .env
npm start
```