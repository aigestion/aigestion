import { injectable } from 'inversify';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';

export interface GraphNode {
    id: string;
    type: 'user' | 'mission' | 'document' | 'concept';
    label: string;
}

export interface GraphEdge {
    source: string;
    target: string;
    relation: 'owns' | 'created' | 'references' | 'similar_to';
    weight: number;
}

@injectable()
export class KnowledgeGraphService {
    private readonly GRAPH_KEY_PREFIX = 'kg:';

    constructor() {}

    /**
     * Adds a node to the knowledge graph.
     */
    async addNode(node: GraphNode): Promise<void> {
        const client = getRedisClient();
        if (!client?.isOpen) return;

        const key = `${this.GRAPH_KEY_PREFIX}node:${node.id}`;
        await client.hSet(key, {
            type: node.type,
            label: node.label
        });
    }

    /**
     * Creates a relationship (edge) between two nodes.
     */
    async addEdge(edge: GraphEdge): Promise<void> {
        const client = getRedisClient();
        if (!client?.isOpen) return;

        // Adjacency list pattern in Redis Sets
        const outKey = `${this.GRAPH_KEY_PREFIX}edges:out:${edge.source}`;
        const inKey = `${this.GRAPH_KEY_PREFIX}edges:in:${edge.target}`;

        const edgeData = JSON.stringify({
            target: edge.target,
            relation: edge.relation,
            weight: edge.weight
        });

        await Promise.all([
            client.sAdd(outKey, edgeData),
            client.sAdd(inKey, edge.source) // Simple back-ref
        ]);

        logger.info(`[KnowledgeGraph] Linked ${edge.source} -> ${edge.relation} -> ${edge.target}`);
    }

    /**
     * Retrieves related nodes (e.g., finding documents related to a mission).
     */
    async getRelated(nodeId: string, relationType?: string): Promise<any[]> {
        const client = getRedisClient();
        if (!client?.isOpen) return [];

        const outKey = `${this.GRAPH_KEY_PREFIX}edges:out:${nodeId}`;
        const edges = await client.sMembers(outKey);

        const related = edges
            .map(e => JSON.parse(e))
            .filter(e => !relationType || e.relation === relationType);

        return related;
    }

    /**
     * Finds the "Knowledge Path" between two concepts (Basic BFS).
     * Useful for RAG to explain HOW two things are connected.
     */
    async findPath(startId: string, endId: string): Promise<string[]> {
        // Implementation placeholder for BFS/DFS traversal
        // In a real graph database (Neo4j) this is native.
        // For Redis, we simulated it for immediate adjacencies.
        const direct = await this.getRelated(startId);
        const match = direct.find(d => d.target === endId);

        return match ? [startId, match.relation, endId] : [];
    }
}
