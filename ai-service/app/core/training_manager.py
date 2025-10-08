# Training Data Storage and Model Pipeline

import json
import os
import pickle
from datetime import datetime
from typing import List, Dict, Any, Optional
import pandas as pd
import numpy as np
from pathlib import Path

class TrainingDataManager:
    """Manages collection, storage, and preparation of training data."""
    
    def __init__(self, data_dir: str = "training_data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(exist_ok=True)
        
        # Create subdirectories
        (self.data_dir / "raw").mkdir(exist_ok=True)
        (self.data_dir / "processed").mkdir(exist_ok=True)
        (self.data_dir / "embeddings").mkdir(exist_ok=True)
        (self.data_dir / "models").mkdir(exist_ok=True)
    
    async def collect_training_data(self) -> Dict[str, Any]:
        """Collect comprehensive training data from all sources."""
        print("🚀 Starting comprehensive data collection...")
        
        # Import data ingestion functions
        from app.api.endpoints.data_ingestion import (
            fetch_nasa_apod, fetch_nasa_neo, fetch_nasa_mars_data,
            fetch_nasa_exoplanets, fetch_nasa_techport,
            fetch_spacex_launches, fetch_spacex_rockets, fetch_spacex_capsules,
            fetch_spacex_crew, fetch_spacex_payloads, fetch_spacex_starlink,
            process_nasa_data, process_spacex_data
        )
        
        collected_data = {
            "nasa": [],
            "spacex": [],
            "metadata": {
                "collection_date": datetime.now().isoformat(),
                "total_records": 0,
                "sources": []
            }
        }
        
        # Collect NASA data
        print("📡 Collecting NASA data...")
        try:
            nasa_raw = []
            
            # NASA APOD - get more historical data
            print("  - NASA APOD...")
            apod_data = await fetch_nasa_apod(limit=200)  # 200 astronomy pictures
            nasa_raw.extend(apod_data)
            
            # NASA NEO data
            print("  - NASA Near-Earth Objects...")
            neo_data = await fetch_nasa_neo()
            nasa_raw.extend(neo_data)
            
            # NASA Mars data
            print("  - NASA Mars rover data...")
            mars_data = await fetch_nasa_mars_data()
            nasa_raw.extend(mars_data)
            
            # NASA Exoplanets
            print("  - NASA Exoplanet data...")
            exoplanet_data = await fetch_nasa_exoplanets()
            nasa_raw.extend(exoplanet_data)
            
            # NASA Technology
            print("  - NASA Technology projects...")
            tech_data = await fetch_nasa_techport()
            nasa_raw.extend(tech_data)
            
            # Process NASA data
            nasa_processed = await process_nasa_data(nasa_raw)
            collected_data["nasa"] = nasa_processed
            collected_data["metadata"]["sources"].append(f"NASA ({len(nasa_processed)} records)")
            
        except Exception as e:
            print(f"⚠️ NASA data collection error: {e}")
            # Use fallback data
            collected_data["nasa"] = self._get_fallback_nasa_data()
            collected_data["metadata"]["sources"].append("NASA (fallback data)")
        
        # Collect SpaceX data
        print("🚀 Collecting SpaceX data...")
        try:
            spacex_raw = []
            
            # SpaceX Launches
            print("  - SpaceX launches...")
            launches = await fetch_spacex_launches()
            spacex_raw.extend(launches)
            
            # SpaceX Rockets
            print("  - SpaceX rockets...")
            rockets = await fetch_spacex_rockets()
            spacex_raw.extend(rockets)
            
            # SpaceX Capsules
            print("  - SpaceX capsules...")
            capsules = await fetch_spacex_capsules()
            spacex_raw.extend(capsules)
            
            # SpaceX Crew
            print("  - SpaceX crew...")
            crew = await fetch_spacex_crew()
            spacex_raw.extend(crew)
            
            # SpaceX Payloads (limit for performance)
            print("  - SpaceX payloads...")
            payloads = await fetch_spacex_payloads()
            spacex_raw.extend(payloads[:100])  # Limit payloads
            
            # SpaceX Starlink (sample)
            print("  - SpaceX Starlink...")
            starlink = await fetch_spacex_starlink()
            spacex_raw.extend(starlink[:50])  # Limit Starlink satellites
            
            # Process SpaceX data
            spacex_processed = await process_spacex_data(spacex_raw)
            collected_data["spacex"] = spacex_processed
            collected_data["metadata"]["sources"].append(f"SpaceX ({len(spacex_processed)} records)")
            
        except Exception as e:
            print(f"⚠️ SpaceX data collection error: {e}")
            collected_data["spacex"] = []
        
        # Calculate totals
        total_records = len(collected_data["nasa"]) + len(collected_data["spacex"])
        collected_data["metadata"]["total_records"] = total_records
        
        # Save raw data
        self._save_data(collected_data, "raw/complete_dataset.json")
        
        print(f"✅ Data collection complete: {total_records} total records")
        return collected_data
    
    def _get_fallback_nasa_data(self) -> List[Dict]:
        """Return comprehensive fallback NASA data for training."""
        return [
            {
                "id": "apod_training_1", "type": "apod", "source": "NASA APOD",
                "timestamp": datetime.now().isoformat(),
                "data": {"title": "Eagle Nebula Pillars", "description": "The Eagle Nebula's Pillars of Creation are towering tendrils of cosmic dust and gas situated 7,000 light-years away in the constellation Serpens. These structures are stellar nurseries where new stars are born."},
                "text_content": "NASA Astronomy Picture: Eagle Nebula Pillars. The Eagle Nebula's Pillars of Creation are towering tendrils of cosmic dust and gas..."
            },
            {
                "id": "mars_training_1", "type": "mars_photo", "source": "NASA Mars Photos",
                "timestamp": datetime.now().isoformat(),
                "data": {"sol": 1500, "camera": "MASTCAM", "rover": "Curiosity", "earth_date": "2025-01-15"},
                "text_content": "Mars photo from Curiosity rover on sol 1500 using MASTCAM showing layered rock formations indicating ancient water activity"
            },
            {
                "id": "neo_training_1", "type": "neo", "source": "NASA NEO",
                "timestamp": datetime.now().isoformat(),
                "data": {"name": "Bennu", "hazardous": False, "magnitude": 20.9, "diameter": {"min": 0.48, "max": 0.51}},
                "text_content": "Near-Earth Object: Bennu. Target of OSIRIS-REx sample return mission. Not potentially hazardous."
            },
            {
                "id": "exo_training_1", "type": "exoplanet", "source": "NASA Exoplanet Archive",
                "timestamp": datetime.now().isoformat(),
                "data": {"planet_name": "TRAPPIST-1e", "host_star": "TRAPPIST-1", "discovery_year": 2017, "habitable_zone": True},
                "text_content": "Exoplanet TRAPPIST-1e in the habitable zone of its star, potentially suitable for liquid water"
            },
            {
                "id": "tech_training_1", "type": "technology", "source": "NASA TechPort",
                "timestamp": datetime.now().isoformat(),
                "data": {"title": "Solar Electric Propulsion", "description": "Ion propulsion systems for deep space missions", "benefits": "High specific impulse for efficient long-duration missions"},
                "text_content": "NASA Technology: Solar Electric Propulsion. Ion propulsion systems providing high efficiency for interplanetary travel"
            }
        ]
    
    def prepare_training_dataset(self, data: Dict[str, Any]) -> pd.DataFrame:
        """Prepare structured dataset for model training."""
        print("📊 Preparing training dataset...")
        
        # Combine all data
        all_records = data["nasa"] + data["spacex"]
        
        # Create training examples
        training_examples = []
        
        for record in all_records:
            # Create question-answer pairs
            text_content = record.get("text_content", "")
            data_type = record.get("type", "")
            source = record.get("source", "")
            
            if text_content:
                # Generate different types of training examples
                examples = self._generate_training_examples(record, text_content, data_type, source)
                training_examples.extend(examples)
        
        # Create DataFrame
        df = pd.DataFrame(training_examples)
        
        # Save processed dataset
        df.to_csv(self.data_dir / "processed" / "training_dataset.csv", index=False)
        df.to_json(self.data_dir / "processed" / "training_dataset.json", orient="records", indent=2)
        
        print(f"✅ Training dataset prepared: {len(df)} training examples")
        return df
    
    def _generate_training_examples(self, record: Dict, text_content: str, data_type: str, source: str) -> List[Dict]:
        """Generate multiple training examples from a single record."""
        examples = []
        data_info = record.get("data", {})
        
        # Basic information example
        examples.append({
            "input": f"Tell me about {data_type} data from {source}",
            "output": text_content,
            "type": "general_info",
            "source": source,
            "data_type": data_type
        })
        
        # Type-specific examples
        if data_type == "launch":
            if "name" in data_info:
                examples.append({
                    "input": f"What happened with the {data_info['name']} launch?",
                    "output": text_content,
                    "type": "launch_specific",
                    "source": source
                })
        
        elif data_type == "apod":
            if "title" in data_info:
                examples.append({
                    "input": f"Explain the astronomy picture {data_info['title']}",
                    "output": text_content,
                    "type": "astronomy_explanation",
                    "source": source
                })
        
        elif data_type == "mars_photo":
            examples.append({
                "input": "Show me information about Mars rover photos",
                "output": text_content,
                "type": "mars_mission",
                "source": source
            })
        
        elif data_type == "exoplanet":
            if "planet_name" in data_info:
                examples.append({
                    "input": f"Tell me about the exoplanet {data_info['planet_name']}",
                    "output": text_content,
                    "type": "exoplanet_info",
                    "source": source
                })
        
        return examples
    
    def _save_data(self, data: Any, filename: str):
        """Save data to file."""
        filepath = self.data_dir / filename
        
        if filename.endswith('.json'):
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2, default=str)
        elif filename.endswith('.pkl'):
            with open(filepath, 'wb') as f:
                pickle.dump(data, f)
    
    def load_data(self, filename: str) -> Any:
        """Load data from file."""
        filepath = self.data_dir / filename
        
        if not filepath.exists():
            return None
            
        if filename.endswith('.json'):
            with open(filepath, 'r') as f:
                return json.load(f)
        elif filename.endswith('.pkl'):
            with open(filepath, 'rb') as f:
                return pickle.load(f)
        elif filename.endswith('.csv'):
            return pd.read_csv(filepath)
