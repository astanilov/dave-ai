const cfg = {
    qdrantHost: process.env.QDRANT_HOST || 'localhost',
    qdrantPort: Number(process.env.QDRANT_PORT) || 6333,
}

export default cfg;