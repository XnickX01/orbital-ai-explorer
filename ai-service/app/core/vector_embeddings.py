# Vector Embeddings and Semantic Search

import numpy as np
import json
import pickle
from typing import List, Dict, Any, Tuple, Optional
from pathlib import Path
import pandas as pd
from datetime import datetime

try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    print("⚠️ sentence-transformers not installed. Using basic embeddings.")

try:
    import faiss
    FAISS_AVAILABLE = True
except ImportError:
    FAISS_AVAILABLE = False
    print("⚠️ faiss not installed. Using basic similarity search.")

class VectorEmbeddingManager:
    """Manages vector embeddings for semantic search over space data."""
    
    def __init__(self, data_dir: str = "training_data"):
        self.data_dir = Path(data_dir)
        self.embeddings_dir = self.data_dir / "embeddings"
        self.embeddings_dir.mkdir(exist_ok=True)
        
        # Initialize embedding model
        self.model = None
        self.index = None
        self.documents = []
        self.embeddings = None
        
        self._init_embedding_model()
    
    def _init_embedding_model(self):
        """Initialize the embedding model."""
        if SENTENCE_TRANSFORMERS_AVAILABLE:
            try:
                # Use a model optimized for scientific/technical content
                self.model = SentenceTransformer('all-MiniLM-L6-v2')
                print("✅ SentenceTransformer model loaded")
            except Exception as e:
                print(f"⚠️ Failed to load SentenceTransformer: {e}")
                self.model = None
        else:
            print("📝 Using basic TF-IDF embeddings as fallback")
    
    async def create_embeddings(self, training_data: pd.DataFrame) -> Dict[str, Any]:
        """Create vector embeddings from training data."""
        print("🧮 Creating vector embeddings...")
        
        # Prepare documents for embedding
        documents = []
        metadata = []
        
        for _, row in training_data.iterrows():
            # Create searchable document text
            doc_text = f"{row['input']} {row['output']}"
            documents.append(doc_text)
            
            # Store metadata
            metadata.append({
                "input": row['input'],
                "output": row['output'],
                "type": row.get('type', 'unknown'),
                "source": row.get('source', 'unknown'),
                "data_type": row.get('data_type', 'unknown')
            })
        
        self.documents = documents
        
        # Create embeddings
        if self.model and SENTENCE_TRANSFORMERS_AVAILABLE:
            print("  - Using SentenceTransformer embeddings...")
            embeddings = self.model.encode(documents, show_progress_bar=True)
            self.embeddings = embeddings
        else:
            print("  - Using TF-IDF fallback embeddings...")
            embeddings = self._create_tfidf_embeddings(documents)
            self.embeddings = embeddings
        
        # Create FAISS index for fast similarity search
        if FAISS_AVAILABLE and self.embeddings is not None:
            print("  - Creating FAISS index...")
            self.index = faiss.IndexFlatIP(self.embeddings.shape[1])  # Inner product similarity
            
            # Normalize embeddings for cosine similarity
            normalized_embeddings = self.embeddings / np.linalg.norm(self.embeddings, axis=1, keepdims=True)
            self.index.add(normalized_embeddings.astype('float32'))
        
        # Save embeddings and metadata
        embedding_data = {
            "embeddings": self.embeddings.tolist() if self.embeddings is not None else [],
            "documents": documents,
            "metadata": metadata,
            "created_at": datetime.now().isoformat(),
            "total_documents": len(documents),
            "embedding_dimension": self.embeddings.shape[1] if self.embeddings is not None else 0
        }
        
        # Save to files
        with open(self.embeddings_dir / "embeddings.json", "w") as f:
            json.dump(embedding_data, f, indent=2)
        
        if self.embeddings is not None:
            np.save(self.embeddings_dir / "embeddings.npy", self.embeddings)
        
        with open(self.embeddings_dir / "metadata.pkl", "wb") as f:
            pickle.dump(metadata, f)
        
        print(f"✅ Created embeddings for {len(documents)} documents")
        return embedding_data
    
    def _create_tfidf_embeddings(self, documents: List[str]) -> np.ndarray:
        """Create TF-IDF embeddings as fallback."""
        from collections import Counter
        import re
        
        # Simple TF-IDF implementation
        def tokenize(text):
            return re.findall(r'\b\w+\b', text.lower())
        
        # Build vocabulary
        vocab = set()
        doc_tokens = []
        for doc in documents:
            tokens = tokenize(doc)
            doc_tokens.append(tokens)
            vocab.update(tokens)
        
        vocab = sorted(list(vocab))
        vocab_to_idx = {word: idx for idx, word in enumerate(vocab)}
        
        # Calculate TF-IDF
        embeddings = np.zeros((len(documents), len(vocab)))
        
        for doc_idx, tokens in enumerate(doc_tokens):
            token_counts = Counter(tokens)
            doc_length = len(tokens)
            
            for token, count in token_counts.items():
                if token in vocab_to_idx:
                    tf = count / doc_length
                    # Simple approximation of IDF
                    idf = np.log(len(documents) / (1 + sum(1 for doc_tokens_i in doc_tokens if token in doc_tokens_i)))
                    embeddings[doc_idx, vocab_to_idx[token]] = tf * idf
        
        return embeddings
    
    def search_similar(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Search for similar documents using vector similarity."""
        if not self.documents or self.embeddings is None:
            return []
        
        # Create query embedding
        if self.model and SENTENCE_TRANSFORMERS_AVAILABLE:
            query_embedding = self.model.encode([query])
        else:
            # Fallback to simple text matching
            return self._simple_text_search(query, top_k)
        
        # Search using FAISS if available
        if self.index and FAISS_AVAILABLE:
            # Normalize query embedding
            query_embedding = query_embedding / np.linalg.norm(query_embedding, axis=1, keepdims=True)
            
            # Search
            similarities, indices = self.index.search(query_embedding.astype('float32'), top_k)
            
            results = []
            for i, (similarity, idx) in enumerate(zip(similarities[0], indices[0])):
                if idx >= 0 and idx < len(self.documents):
                    # Load metadata
                    with open(self.embeddings_dir / "metadata.pkl", "rb") as f:
                        metadata = pickle.load(f)
                    
                    results.append({
                        "rank": i + 1,
                        "similarity": float(similarity),
                        "document": self.documents[idx],
                        "metadata": metadata[idx] if idx < len(metadata) else {},
                        "input": metadata[idx].get("input", "") if idx < len(metadata) else "",
                        "output": metadata[idx].get("output", "") if idx < len(metadata) else ""
                    })
            
            return results
        
        # Fallback: compute similarities manually
        return self._manual_similarity_search(query_embedding[0], top_k)
    
    def _simple_text_search(self, query: str, top_k: int) -> List[Dict[str, Any]]:
        """Simple text-based search fallback."""
        query_words = set(query.lower().split())
        
        scores = []
        for i, doc in enumerate(self.documents):
            doc_words = set(doc.lower().split())
            # Simple Jaccard similarity
            intersection = len(query_words & doc_words)
            union = len(query_words | doc_words)
            score = intersection / union if union > 0 else 0
            scores.append((score, i))
        
        # Sort by score
        scores.sort(reverse=True)
        
        results = []
        for rank, (score, idx) in enumerate(scores[:top_k]):
            if score > 0:  # Only return matches with some similarity
                results.append({
                    "rank": rank + 1,
                    "similarity": score,
                    "document": self.documents[idx],
                    "metadata": {},
                    "input": "",
                    "output": ""
                })
        
        return results
    
    def _manual_similarity_search(self, query_embedding: np.ndarray, top_k: int) -> List[Dict[str, Any]]:
        """Manual similarity computation."""
        # Compute cosine similarities
        similarities = np.dot(self.embeddings, query_embedding) / (
            np.linalg.norm(self.embeddings, axis=1) * np.linalg.norm(query_embedding)
        )
        
        # Get top-k indices
        top_indices = np.argsort(similarities)[::-1][:top_k]
        
        results = []
        for rank, idx in enumerate(top_indices):
            results.append({
                "rank": rank + 1,
                "similarity": float(similarities[idx]),
                "document": self.documents[idx],
                "metadata": {},
                "input": "",
                "output": ""
            })
        
        return results
    
    def load_embeddings(self) -> bool:
        """Load existing embeddings from disk."""
        try:
            # Load embeddings
            embeddings_path = self.embeddings_dir / "embeddings.npy"
            if embeddings_path.exists():
                self.embeddings = np.load(embeddings_path)
            
            # Load documents and metadata
            with open(self.embeddings_dir / "embeddings.json", "r") as f:
                data = json.load(f)
                self.documents = data.get("documents", [])
            
            # Recreate FAISS index if available
            if FAISS_AVAILABLE and self.embeddings is not None:
                self.index = faiss.IndexFlatIP(self.embeddings.shape[1])
                normalized_embeddings = self.embeddings / np.linalg.norm(self.embeddings, axis=1, keepdims=True)
                self.index.add(normalized_embeddings.astype('float32'))
            
            print(f"✅ Loaded embeddings for {len(self.documents)} documents")
            return True
            
        except Exception as e:
            print(f"⚠️ Failed to load embeddings: {e}")
            return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get embedding statistics."""
        return {
            "total_documents": len(self.documents),
            "embedding_dimension": self.embeddings.shape[1] if self.embeddings is not None else 0,
            "model_type": "SentenceTransformer" if self.model else "TF-IDF",
            "faiss_available": FAISS_AVAILABLE,
            "index_created": self.index is not None
        }
