import { injectable, inject } from 'inversify';
import { getRedisClient } from '../cache/redis';
import { logger } from '../utils/logger';
import { TYPES } from '../types';
import { SemanticCacheService } from './semantic-cache.service';

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

  constructor(
    @inject(TYPES.SemanticCacheService) private readonly semanticCache: SemanticCacheService,
  ) {}

  /**
   * Adds a node to the knowledge graph.
   */
  async addNode(node: GraphNode): Promise<void> {
    const client = getRedisClient();
    if (!client?.isOpen) return;

    const key = `${this.GRAPH_KEY_PREFIX}node:${node.id}`;
    await client.hSet(key, {
      type: node.type,
      label: node.label,
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
      weight: edge.weight,
    });

    await Promise.all([
      client.sAdd(outKey, edgeData),
      client.sAdd(inKey, edge.source), // Simple back-ref
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

  async findPath(startId: string, endId: string): Promise<string[]> {
    const direct = await this.getRelated(startId);
    const match = direct.find(d => d.target === endId);
    return match ? [startId, match.relation, endId] : [];
  }

  /**
   * 🗺️ Hybrid Search: Vector Embedding + Graph Traversal
   * 1. Finds the most semantically relevant nodes.
   * 2. Traverses relationships to find connected insights.
   */
  async hybridSearch(query: string, limit: number = 5): Promise<any[]> {
    const embedding = await this.semanticCache.getEmbedding(query);
    if (embedding.length === 0) return [];

    const client = getRedisClient();
    if (!client?.isOpen) return [];

    // 1. Semantic Vector Step (Find "Entering Nodes")
    // We use the same vector search pattern as SemanticCache
    const enteringNodes = await client
      .sendCommand([
        'FT.SEARCH',
        'idx:kg_nodes',
        `*=>[KNN ${limit} @embedding $BLOB AS score]`,
        'PARAMS',
        '2',
        'BLOB',
        Buffer.from(new Float32Array(embedding).buffer),
        'SORTBY',
        'score',
        'ASC',
        'DIALECT',
        '2',
      ])
      .catch(() => []);

    const nodes = [];
    const resultsArr = enteringNodes as any;
    if (resultsArr && resultsArr[1] > 0) {
      for (let i = 2; i < resultsArr.length; i += 2) {
        const nodeId = resultsArr[i].split(':').pop();
        const score = parseFloat(resultsArr[i + 1][1]);

        // 2. Graph Traversal Step (Find Neighbors)
        const neighbors = await this.getRelated(nodeId);
        nodes.push({
          id: nodeId,
          score,
          neighbors,
        });
      }
    }

    return nodes;
  }

  /**
   * Specialized method to index findings from an autonomous mission.
   * Builds the "Sovereign Memory" by linking the mission to its findings.
   */
  async indexMissionFindings(missionId: string, objective: string, report: string): Promise<void> {
    const findingsNodeId = `findings:${missionId}`;
    const embedding = await this.semanticCache.getEmbedding(objective + ' ' + report);

    // 1. Create findings node with embedding
    const client = getRedisClient();
    if (client?.isOpen) {
      const key = `${this.GRAPH_KEY_PREFIX}node:${findingsNodeId}`;
      await client.hSet(key, {
        type: 'concept',
        label: `Result: ${objective.substring(0, 30)}...`,
        embedding: Buffer.from(new Float32Array(embedding).buffer),
      });
    }

    // 2. Link Mission to Findings
    await this.addEdge({
      source: missionId,
      target: findingsNodeId,
      relation: 'created',
      weight: 1.0,
    });

    logger.info(`[KnowledgeGraph] Indexed findings for mission ${missionId}`);
  }
}
