import React from 'react';
import LiveClassScheduleModule from '../../../components/admin/LiveClassScheduleModule';
import { useSchool } from '../../../hooks/useSchool';

const LiveClassSchedulePage = () => {
  const { school } = useSchool();

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Live Class Schedules</h1>
      <LiveClassScheduleModule schoolId={school.id} />
    </div>
  );
};

export default LiveClassSchedulePage;