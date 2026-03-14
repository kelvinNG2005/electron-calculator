import React from 'react';
import { format } from 'date-fns';

interface HistoryItem {
  calculation: string;
  result: string;
  timestamp: Date;
}

interface HistoryProps {
  items: HistoryItem[];
}

const History: React.FC<HistoryProps> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div className="history-panel empty">
        <p>No calculations yet</p>
      </div>
    );
  }

  return (
    <div className="history-panel">
      <h3>History</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <span className="calculation">{item.calculation}</span>
            <span className="result">= {item.result}</span>
            <span className="timestamp">
              {format(item.timestamp, 'hh:mm:ss a')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;