import React from 'react';
import TermsModule from '../../../components/admin/TermsModule';
import { useSchool } from '../../../hooks/useSchool';

const TermsPage = () => {
  const { school } = useSchool();

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Academic Terms</h1>
      <TermsModule schoolId={school.id} />
    </div>
  );
};

export default TermsPage;