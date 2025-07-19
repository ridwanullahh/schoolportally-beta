import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Routes, Route, Link } from 'react-router-dom';
import { Bell, FileText, DollarSign, Users, BookOpen } from 'lucide-react';
import AnnouncementsModule from '@/components/users/AnnouncementsModule';
import ResultsModule from '@/components/users/ResultsModule';
import FeesModule from '@/components/users/FeesModule';
import SupportModule from '@/components/users/SupportModule';
import { useAuth } from '@/contexts/AuthContext';
import { useSchool } from '@/contexts/SchoolContext';
import sdk from '@/lib/sdk-config';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const sidebarItems = [
    { name: 'Dashboard', href: '', icon: Users },
    { name: 'Announcements', href: 'announcements', icon: Bell },
    { name: "Child's Results", href: 'results', icon: FileText },
    { name: 'School Fees', href: 'fees', icon: DollarSign },
    { name: 'Support', href: 'support', icon: Users },
];

const ParentDashboardOverview = () => {
   const { user } = useAuth();
   const { school } = useSchool();
   const [children, setChildren] = useState([]);
   const [enrolledClasses, setEnrolledClasses] = useState({});

   useEffect(() => {
       if(user && school) {
           fetchChildrenAndClasses();
       }
   }, [user, school]);

   const fetchChildrenAndClasses = async () => {
       const allUsers = await sdk.get('users');
       const myChildren = allUsers.filter(u => u.guardianId === user.id);
       setChildren(myChildren);

       const allClasses = await sdk.get('classes');
       const schoolClasses = allClasses.filter(c => c.schoolId === school.id);
       const childrenClassEnrollments = {};
       myChildren.forEach(child => {
           childrenClassEnrollments[child.id] = schoolClasses.filter(c => c.students.includes(child.id));
       });
       setEnrolledClasses(childrenClassEnrollments);
   }

   return (
       <div>
           <h2 className="text-2xl font-bold mb-4">Your Children</h2>
           <div className="space-y-6">
               {children.map(child => (
                   <Card key={child.id}>
                       <CardHeader>
                           <CardTitle>{child.firstName} {child.lastName}</CardTitle>
                       </CardHeader>
                       <CardContent>
                           <h3 className="font-semibold mb-2">Enrolled Classes</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                               {(enrolledClasses[child.id] || []).map(klass => (
                                   <Link to={`/${school.slug}/classes/${klass.id}`} key={klass.id}>
                                       <Card className="hover:shadow-lg transition-shadow">
                                           <CardHeader>
                                               <CardTitle className="text-base">{klass.name}</CardTitle>
                                           </CardHeader>
                                       </Card>
                                   </Link>
                               ))}
                           </div>
                       </CardContent>
                   </Card>
               ))}
           </div>
       </div>
   )
}

export default function ParentDashboard() {
    return (
        <DashboardLayout sidebarItems={sidebarItems} allowedRoles={['parent']}>
            <Routes>
                <Route index element={<ParentDashboardOverview />} />
                <Route path="announcements" element={<AnnouncementsModule />} />
                <Route path="results" element={<ResultsModule />} />
                <Route path="fees" element={<FeesModule />} />
                <Route path="support" element={<SupportModule />} />
            </Routes>
        </DashboardLayout>
    );
};
