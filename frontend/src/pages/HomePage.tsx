import React, { useState } from 'react';
import { Dashboard } from '../components/Dashboard';
import { AISearch } from '../components/AISearch';
import { LaunchVisualization } from '../components/LaunchVisualization';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'search' | 'visualizations'>('dashboard');

  return (
    <div className="home-page">
      <header className="header">
        <h1>🛰️ Orbital AI Explorer</h1>
        <p>AI-powered space data analytics and visualization</p>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'search' ? 'active' : ''}
          onClick={() => setActiveTab('search')}
        >
          AI Search
        </button>
        <button
          className={activeTab === 'visualizations' ? 'active' : ''}
          onClick={() => setActiveTab('visualizations')}
        >
          Visualizations
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'search' && <AISearch />}
        {activeTab === 'visualizations' && <LaunchVisualization />}
      </main>

      <footer className="footer">
        <p>Data sources: NASA, SpaceX, FAA | Built with React, Express, and FastAPI</p>
      </footer>
    </div>
  );
};
