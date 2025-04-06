import React from 'react';
import ScoreSummary from '../components/ScoreSummary';

function ScoreSummaryPage() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Score History</h2>
      <ScoreSummary />
    </div>
  );
}

export default ScoreSummaryPage;
