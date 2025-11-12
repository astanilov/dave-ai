import { QdrantClient } from "@qdrant/js-client-rest";
import cfg from "../../config";

const client = new QdrantClient({ host: cfg.qdrantHost, port: cfg.qdrantPort });