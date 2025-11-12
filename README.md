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

1. Run `docker pull qdrant/qdrant` to pull latest image
2. Start the DB service. This must be run under the project's root folder so that it creates the qdrant_storage folder there.

```bash
docker run -p 6333:6333 -p 6334:6334 \
    -v "$(pwd)/qdrant_storage:/qdrant/storage:z" \
    qdrant/qdrant
```

## Adding Ollama

1. Install Ollama as a global framework
2. Pull Ollama embedding model and add it to env variable( using `mxbai-embed-large` with 1024 DIM for now)

## License

MIT
