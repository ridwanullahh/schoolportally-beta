import React from 'react';
import SessionsModule from '../../../components/admin/SessionsModule';
import { useSchool } from '../../../hooks/useSchool';

const SessionsPage = () => {
  const { school } = useSchool();

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Academic Sessions</h1>
      <SessionsModule schoolId={school.id} />
    </div>
  );
};

export default SessionsPage;