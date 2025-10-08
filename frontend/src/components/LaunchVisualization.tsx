import React, { useEffect, useState } from 'react';
import { dataService } from '../services/api';
import { Launch } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const LaunchVisualization: React.FC = () => {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLaunches();
  }, []);

  const loadLaunches = async () => {
    try {
      const data = await dataService.getLaunches();
      setLaunches(data);
    } catch (err) {
      console.error('Failed to load launches:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading launch data...</div>;
  }

  // Prepare data for charts
  const launchesByMonth = launches.reduce((acc: any[], launch) => {
    const date = new Date(launch.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    const existing = acc.find(item => item.month === monthYear);
    if (existing) {
      existing.total += 1;
      if (launch.success) existing.successful += 1;
    } else {
      acc.push({
        month: monthYear,
        total: 1,
        successful: launch.success ? 1 : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);

  const rocketStats = launches.reduce((acc: any[], launch) => {
    const existing = acc.find(item => item.rocket === launch.rocket);
    if (existing) {
      existing.count += 1;
      if (launch.success) existing.successful += 1;
    } else {
      acc.push({
        rocket: launch.rocket,
        count: 1,
        successful: launch.success ? 1 : 0,
      });
    }
    return acc;
  }, []).sort((a, b) => b.count - a.count).slice(0, 10);

  return (
    <div className="visualization">
      <h2>📊 Launch Analytics</h2>

      <div className="chart-container">
        <h3>Launches Over Time (Last 12 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={launchesByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total Launches" />
            <Line type="monotone" dataKey="successful" stroke="#82ca9d" name="Successful" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <h3>Top 10 Rockets by Launch Count</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rocketStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="rocket" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" name="Total Launches" />
            <Bar dataKey="successful" fill="#82ca9d" name="Successful" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="launches-list">
        <h3>Recent Launches</h3>
        {launches.slice(0, 10).map((launch) => (
          <div key={launch.id} className="launch-item">
            <div className="launch-name">{launch.name}</div>
            <div className="launch-info">
              <span>{new Date(launch.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{launch.rocket}</span>
              <span>•</span>
              <span className={launch.success ? 'success' : 'failure'}>
                {launch.success ? '✅ Success' : '❌ Failed'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
