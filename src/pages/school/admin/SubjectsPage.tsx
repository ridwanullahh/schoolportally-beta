import React from 'react';
import SubjectsModule from '../../../components/admin/SubjectsModule';
import { useSchool } from '../../../hooks/useSchool';

const SubjectsPage = () => {
  const { school } = useSchool();

  if (!school) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Subjects</h1>
      <SubjectsModule schoolId={school.id} />
    </div>
  );
};

export default SubjectsPage;