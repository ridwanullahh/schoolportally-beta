import React, { useState, useEffect } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/classes.css';
import sdk from '@/lib/sdk-config';
import { useSchool } from '@/contexts/SchoolContext';

interface ClassesSectionProps {
  section: Section;
}

interface ClassItem {
  id: string;
  name: string;
  description?: string;
  teacherId?: string;
  teacherName?: string;
  schedule?: string;
  time?: string;
  capacity?: number;
  enrolled?: number;
  status: 'active' | 'inactive' | 'completed';
  schoolId: string;
}

const ClassesSection: React.FC<ClassesSectionProps> = ({ section }) => {
  const { title, classesLimit = 6 } = section.content;
  const { school } = useSchool();
  const styleId = section.styleId || 'classes-grade-grid';
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const defaultClasses = [
    {
      id: '1',
      name: 'Mathematics 101',
      teacherName: 'Mr. Smith',
      schedule: 'Mon, Wed, Fri',
      time: '9:00 AM',
      capacity: 30,
      enrolled: 25,
      status: 'active' as const,
      schoolId: school?.id || ''
    },
    {
      id: '2',
      name: 'History of Art',
      teacherName: 'Ms. Davis',
      schedule: 'Tue, Thu',
      time: '11:00 AM',
      capacity: 25,
      enrolled: 20,
      status: 'active' as const,
      schoolId: school?.id || ''
    },
    {
      id: '3',
      name: 'Introduction to Physics',
      teacherName: 'Dr. Brown',
      schedule: 'Mon, Wed',
      time: '1:00 PM',
      capacity: 30,
      enrolled: 28,
      status: 'active' as const,
      schoolId: school?.id || ''
    },
    {
      id: '4',
      name: 'Creative Writing',
      teacherName: 'Mrs. Wilson',
      schedule: 'Tue, Thu',
      time: '2:00 PM',
      capacity: 20,
      enrolled: 15,
      status: 'active' as const,
      schoolId: school?.id || ''
    },
  ];

  useEffect(() => {
    const fetchClasses = async () => {
      if (!school) return;
      setLoading(true);
      try {
        const allClasses = await sdk.get<ClassItem>('classes');
        const schoolClasses = allClasses
          .filter((classItem: ClassItem) =>
            classItem.schoolId === school.id &&
            classItem.status === 'active'
          )
          .slice(0, classesLimit);

        setClasses(schoolClasses.length > 0 ? schoolClasses : defaultClasses);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        setClasses(defaultClasses);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [school, classesLimit]);

  const classItems = classes;

  const renderClass = (classItem: ClassItem, index: number) => (
    <div key={classItem.id} className="class-card">
      <h3 className="class-name font-bold text-lg">{classItem.name}</h3>
      {classItem.teacherName && (
        <p className="class-teacher text-muted-foreground">
          Taught by: {classItem.teacherName}
        </p>
      )}
      {classItem.schedule && (
        <p className="class-schedule text-sm text-gray-500">{classItem.schedule}</p>
      )}
      {classItem.time && (
        <p className="class-time text-sm text-gray-500">Time: {classItem.time}</p>
      )}
      {classItem.capacity && classItem.enrolled !== undefined && (
        <p className="class-enrollment text-sm text-gray-500">
          Enrolled: {classItem.enrolled}/{classItem.capacity}
        </p>
      )}
      {classItem.description && (
        <p className="class-description text-sm text-muted-foreground mt-2">
          {classItem.description}
        </p>
      )}
    </div>
  );
  
  const renderContent = () => {
    if (loading) {
      return <div className="loading-state">Loading classes...</div>;
    }

    if (classItems.length === 0) {
      return <div className="empty-state">No classes available.</div>;
    }

    if (styleId === 'classes-timetable-style') {
      return (
        <table className="timetable w-full">
          <thead>
            <tr>
              <th>Time</th>
              <th>Class</th>
              <th>Teacher</th>
              <th>Enrollment</th>
            </tr>
          </thead>
          <tbody>
            {classItems.map((classItem: ClassItem) => (
              <tr key={classItem.id}>
                <td>{classItem.time || 'TBA'}</td>
                <td>{classItem.name}</td>
                <td>{classItem.teacherName || 'TBA'}</td>
                <td>
                  {classItem.enrolled !== undefined && classItem.capacity
                    ? `${classItem.enrolled}/${classItem.capacity}`
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    }

    return (
      <div className="classes-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classItems.map(renderClass)}
      </div>
    )
  }

  return (
    <section className={`classes-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default ClassesSection;