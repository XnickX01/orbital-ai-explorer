import React, { useEffect, useState } from 'react';
import { dataService } from '../services/api';
import { DashboardStats } from '../types';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dataService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await dataService.syncExternalData();
      await loadStats();
      alert('Data synchronized successfully!');
    } catch (err) {
      console.error('Failed to sync data:', err);
      alert('Failed to sync data. Please try again.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!stats) {
    return <div className="error">Failed to load dashboard data.</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Space Data Dashboard</h2>
        <button onClick={handleSync} disabled={syncing} className="sync-button">
          {syncing ? '🔄 Syncing...' : '🔄 Sync Data'}
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-value">{stats.totalLaunches}</div>
          <div className="stat-label">Total Launches</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{stats.successfulLaunches}</div>
          <div className="stat-label">Successful Launches</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛸</div>
          <div className="stat-value">{stats.activeRockets}</div>
          <div className="stat-label">Active Rockets</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛰️</div>
          <div className="stat-value">{stats.upcomingMissions}</div>
          <div className="stat-label">Upcoming Missions</div>
        </div>

        <div className="stat-card highlight">
          <div className="stat-icon">📈</div>
          <div className="stat-value">{stats.successRate.toFixed(1)}%</div>
          <div className="stat-label">Success Rate</div>
        </div>
      </div>
    </div>
  );
};
