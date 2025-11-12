# Dave AI

A modern AI application built with cutting-edge technologies.

## Features

- AI-powered functionality
- Modern architecture
- Easy to use

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

## Development

```bash
npm run dev
```

## Adding local Qdrant DB

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

## Adding Ollama

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

## License

MIT
