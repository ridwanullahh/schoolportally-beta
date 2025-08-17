import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SubjectsUserModule = () => {
    const { user } = useAuth();
    const { school } = useSchool();
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubjects = async () => {
            if (!user || !school) return;

            setLoading(true);
            try {
                const allClasses = await sdk.get('classes');
                const allSubjects = await sdk.get('subjects');
                
                let userSubjects = [];
                if (user.userType === 'teacher') {
                    // Class teachers see all subjects in their classes
                    const myClasses = allClasses.filter(c => c.teacherIds.includes(user.id));
                    const myClassIds = myClasses.map(c => c.id);
                    const subjectsInMyClasses = allSubjects.filter(s => myClassIds.includes(s.classId));

                    // Subject teachers see subjects they are assigned to
                    const assignedSubjects = allSubjects.filter(s => s.teacherIds.includes(user.id));

                    // Combine and remove duplicates
                    userSubjects = [...subjectsInMyClasses, ...assignedSubjects].filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);

                } else if (user.userType === 'student') {
                    const myClasses = allClasses.filter(c => c.students.includes(user.id));
                    const myClassIds = myClasses.map(c => c.id);
                    userSubjects = allSubjects.filter(s => myClassIds.includes(s.classId) && !s.disabledStudents.includes(user.id));
                }
                setSubjects(userSubjects);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubjects();
    }, [user, school]);

    if (loading) {
        return <div>Loading subjects...</div>;
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">My Subjects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => (
                    <Link to={`/${school.slug}/dashboard/subjects/${subject.id}`} key={subject.id}>
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <CardTitle>{subject.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3">{subject.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                {subjects.length === 0 && (
                    <p>You are not enrolled in any subjects.</p>
                )}
            </div>
        </div>
    );
};

export default SubjectsUserModule;