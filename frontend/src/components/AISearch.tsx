import React, { useState } from 'react';
import { aiService } from '../services/api';
import { SearchQuery, SearchResult } from '../types';

export const AISearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const searchQuery: SearchQuery = { query: query.trim() };
      const data = await aiService.search(searchQuery);
      setResults(data);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-search">
      <h2>🔍 AI-Powered Space Data Search</h2>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about space missions, rockets, or launches..."
          className="search-input"
          disabled={loading}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {results && (
        <div className="results">
          <h3>Results ({results.totalResults} total)</h3>
          
          {results.launches.length > 0 && (
            <div className="results-section">
              <h4>🚀 Launches ({results.launches.length})</h4>
              {results.launches.map((launch) => (
                <div key={launch.id} className="result-card">
                  <h5>{launch.name}</h5>
                  <p><strong>Date:</strong> {new Date(launch.date).toLocaleDateString()}</p>
                  <p><strong>Rocket:</strong> {launch.rocket}</p>
                  <p><strong>Status:</strong> {launch.success ? '✅ Success' : '❌ Failed'}</p>
                  {launch.details && <p>{launch.details}</p>}
                </div>
              ))}
            </div>
          )}

          {results.rockets.length > 0 && (
            <div className="results-section">
              <h4>🛸 Rockets ({results.rockets.length})</h4>
              {results.rockets.map((rocket) => (
                <div key={rocket.id} className="result-card">
                  <h5>{rocket.name}</h5>
                  <p><strong>Type:</strong> {rocket.type}</p>
                  <p><strong>Company:</strong> {rocket.company}</p>
                  <p><strong>Status:</strong> {rocket.active ? '🟢 Active' : '🔴 Inactive'}</p>
                  <p><strong>Success Rate:</strong> {rocket.success_rate_pct}%</p>
                  {rocket.description && <p>{rocket.description}</p>}
                </div>
              ))}
            </div>
          )}

          {results.missions.length > 0 && (
            <div className="results-section">
              <h4>🛰️ Missions ({results.missions.length})</h4>
              {results.missions.map((mission) => (
                <div key={mission.id} className="result-card">
                  <h5>{mission.name}</h5>
                  <p>{mission.description}</p>
                  <p><strong>Start:</strong> {new Date(mission.start_date).toLocaleDateString()}</p>
                  {mission.end_date && (
                    <p><strong>End:</strong> {new Date(mission.end_date).toLocaleDateString()}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
