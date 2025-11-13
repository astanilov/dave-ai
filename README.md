# Dave AI

A modern AI application built with cutting-edge technologies.

## Features

- AI-powered functionality
- Modern architecture
- Easy to use

## Initial Setup

### Qdrant vector DB

1. Open a terminal and run the following to pull the latest image:

    ```bash
    docker pull qdrant/qdrant
    ```

2. Start the DB service. This must be run under the project's root folder so that it creates the `qdrant_storage` folder there.

    ```bash
    docker run -p 6333:6333 -p 6334:6334 \
        -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
        qdrant/qdrant
    ```

### Ollama LLM models

1. Go to the Ollama download page, and follow the instrucions to install it:

    https://ollama.com/download

2. To start the Ollama service, open a terminal and run:

    ```bash
    ollama serve
    ```

3. Pull the Ollama models (embedding and LLM):

    ```bash
    ollama pull mxbai-embed-large
    ollama pull llama3
    ```

### Installing project dependencies

Run the following command under the project's root folder:

```bash
npm install
```

### Loading reference data

To load reference data into the vector DB, run the following command under the `api/` folder:

```bash
npm run ingest
```


## Command-line Reference

> [!NOTE]
> Run commands in the respective sub-project folder (`api/` or `ui/`).

### API

| Command                | Description                                         |
|------------------------|-----------------------------------------------------|
| `npm run build`        | Build TypeScript sources                            |
| `npm run clean`        | Remove build output                                 |
| `npm run dev`          | Start backend in development mode                   |
| `npm run ingest`       | Run data ingestion script                           |
| `npm start`            | Start backend server (production)                   |

### UI

| Command                | Description                                         |
|------------------------|-----------------------------------------------------|
| `npm run build`        | Build frontend for production                       |
| `npm run clean`        | Remove build output                                 |
| `npm run dev`          | Start frontend in development mode                  |
| `npm run preview`      | Preview production build locally                    |


## License

MIT
