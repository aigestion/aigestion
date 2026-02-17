
import json
import os
import uuid
import time
from datetime import datetime, timedelta
import logging
from typing import Any, Dict, List, Optional, Tuple, TypedDict

# Configure logging at a module level
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Type definition for a Memory entry
class Memory(TypedDict):
    id: str
    timestamp: float
    content: str
    embedding: List[float]
    type: str  # e.g., 'observation', 'thought', 'plan'
    related_entities: List[str]

class MemoryService:
    """
    Manages the storage, retrieval, and embedding of agent memories.
    Uses dependency injection for the embedding client to centralize
    API key management and model configuration.
    """
    def __init__(self,
                 embedding_client: Any,  # The client responsible for generating embeddings (e.g., genai)
                 model_name: str = "models/embedding-001",
                 memory_dir: str = "memory_data"):
        """
        Initializes the MemoryService.

        Args:
            embedding_client: An object with an 'embed_content' method
                              compatible with the Google Generative AI client.
            model_name (str): The name of the embedding model to use.
            memory_dir (str): Directory where memory files are stored.
        """
        self._embedding_client = embedding_client
        self._model_name = model_name
        self.memory_dir = memory_dir
        os.makedirs(memory_dir, exist_ok=True)
        logging.info(f"MemoryService initialized with model '{self._model_name}' and memory_dir '{self.memory_dir}'")

    def _generate_embedding(self, text: str) -> List[float]:
        """
        Generates an embedding for the given text using the injected embedding client.

        Args:
            text (str): The text content to embed.

        Returns:
            List[float]: The embedding vector, or an empty list if generation fails.
        """
        try:
            response = self._embedding_client.embed_content(
                model=self._model_name,
                content=text,
                task_type="RETRIEVAL_DOCUMENT"
            )
            # Ensure the response structure is as expected, and 'embedding' key exists
            if 'embedding' in response:
                return response['embedding']
            else:
                logging.warning(f"Embedding response did not contain 'embedding' key for text '{text[:50]}...'")
                return []
        except Exception as e:
            logging.error(f"Error generating embedding for text '{text[:50]}...': {e}")
            return []

    def _save_memory(self, agent_id: str, memories: List[Memory]):
        """
        Saves a list of memories for a specific agent to a JSON file.

        Args:
            agent_id (str): The ID of the agent whose memories are being saved.
            memories (List[Memory]): A list of memory dictionaries.
        """
        file_path = os.path.join(self.memory_dir, f"{agent_id}_memories.json")
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(memories, f, indent=4)
            logging.debug(f"Memory saved successfully for agent {agent_id} at {file_path}")
        except IOError as e:
            logging.error(f"Failed to save memory for agent {agent_id} to {file_path}: {e}")

    def _load_memory(self, agent_id: str) -> Optional[List[Memory]]:
        """
        Loads memories for a specific agent from a JSON file.

        Args:
            agent_id (str): The ID of the agent whose memories are being loaded.

        Returns:
            Optional[List[Memory]]: A list of memory dictionaries, or None if the
                                    file doesn't exist or an error occurs.
        """
        file_path = os.path.join(self.memory_dir, f"{agent_id}_memories.json")
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                memories = json.load(f)
            logging.debug(f"Memory loaded successfully for agent {agent_id} from {file_path}")
            return memories
        except FileNotFoundError:
            logging.info(f"Memory file not found for agent {agent_id} at {file_path}. Returning empty memory.")
            return [] # Return empty list if no file, consistent with previous behavior for empty memory
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse memory file {file_path} for agent {agent_id}: {e}")
            return None
        except IOError as e:
            logging.error(f"Failed to read memory file {file_path} for agent {agent_id}: {e}")
            return None

    def add_memory(self,
                   agent_id: str,
                   content: str,
                   memory_type: str = "observation",
                   related_entities: Optional[List[str]] = None) -> Optional[Memory]:
        """
        Adds a new memory to the agent's memory stream, including its embedding.

        Args:
            agent_id (str): The ID of the agent.
            content (str): The content of the memory.
            memory_type (str): The type of memory (e.g., 'observation', 'thought', 'plan').
            related_entities (Optional[List[str]]): A list of entities related to this memory.

        Returns:
            Optional[Memory]: The newly created memory object, or None if embedding fails.
        """
        embedding = self._generate_embedding(content)
        if not embedding:
            logging.error(f"Failed to generate embedding for new memory for agent {agent_id}. Memory not added.")
            return None

        new_memory: Memory = {
            "id": str(uuid.uuid4()),
            "timestamp": time.time(),
            "content": content,
            "embedding": embedding,
            "type": memory_type,
            "related_entities": related_entities if related_entities is not None else []
        }

        all_memories = self._load_memory(agent_id)
        if all_memories is None: # Handle error during load
            all_memories = []
        all_memories.append(new_memory)
        self._save_memory(agent_id, all_memories)
        logging.info(f"Added new '{memory_type}' memory for agent {agent_id}: '{content[:80]}...'")
        return new_memory

    def retrieve_memories(self,
                          agent_id: str,
                          query: str,
                          k: int = 5,
                          time_decay_factor: float = 0.99) -> List[Tuple[Memory, float]]:
        """
        Retrieves the top-k most relevant memories for a given query, considering recency.

        Args:
            agent_id (str): The ID of the agent.
            query (str): The query string to search for.
            k (int): The number of top memories to retrieve.
            time_decay_factor (float): Factor to decay memory score based on age (0-1).

        Returns:
            List[Tuple[Memory, float]]: A list of (memory, score) tuples, sorted by score.
        """
        query_embedding = self._generate_embedding(query)
        if not query_embedding:
            logging.warning(f"Failed to generate embedding for query '{query[:50]}...'. Cannot retrieve memories.")
            return []

        all_memories = self._load_memory(agent_id)
        if not all_memories:
            return []

        scored_memories: List[Tuple[Memory, float]] = []
        current_time = time.time()

        for memory in all_memories:
            if not memory.get("embedding"):
                logging.warning(f"Memory {memory.get('id')} for agent {agent_id} has no embedding. Skipping.")
                continue

            similarity = self._cosine_similarity(query_embedding, memory["embedding"])

            # Apply time decay
            age_in_seconds = current_time - memory["timestamp"]
            # Example: decay by 1% per hour (3600 seconds)
            time_decay = time_decay_factor ** (age_in_seconds / 3600)
            final_score = similarity * time_decay
            scored_memories.append((memory, final_score))

        scored_memories.sort(key=lambda x: x[1], reverse=True)
        logging.debug(f"Retrieved {len(scored_memories)} memories for agent {agent_id} with query '{query[:50]}...'")
        return scored_memories[:k]

    @staticmethod
    def _cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        """Calculates the cosine similarity between two vectors."""
        if not vec1 or not vec2:
            return 0.0
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude_vec1 = (sum(a**2 for a in vec1))**0.5
        magnitude_vec2 = (sum(b**2 for b in vec2))**0.5

        if magnitude_vec1 == 0 or magnitude_vec2 == 0:
            return 0.0

        return dot_product / (magnitude_vec1 * magnitude_vec2)

    def get_all_memories(self, agent_id: str) -> List[Memory]:
        """
        Retrieves all memories for a given agent without filtering or scoring.

        Args:
            agent_id (str): The ID of the agent.

        Returns:
            List[Memory]: A list of all memory objects for the agent.
        """
        memories = self._load_memory(agent_id)
        return memories if memories is not None else []
