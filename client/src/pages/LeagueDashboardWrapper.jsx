// /src/pages/LeagueDashboardWrapper.jsx
import { useParams } from 'react-router-dom';
import LeagueDashboardPage from './LeagueDashboardPage';

const LeagueDashboardWrapper = () => {
  const { id } = useParams();
  const userId = 1; // Replace with real user ID when auth is set up
  return <LeagueDashboardPage leagueId={id} userId={userId} />;
};

export default LeagueDashboardWrapper;
// This file serves as a wrapper for the LeagueDashboardPage component.
// It extracts the league ID from the URL parameters and passes it to the LeagueDashboardPage component.
// The user ID is currently hardcoded for demonstration purposes.
// In a real application, you would retrieve the user ID from authentication context or a global state. 