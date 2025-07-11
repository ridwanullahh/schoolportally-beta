import React from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/leadership.css';

interface LeadershipSectionProps {
  section: Section;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ section }) => {
  const { title, members } = section.content;
  const styleId = section.styleId || 'leadership-profile-grid';

  const defaultMembers = [
    { name: 'Dr. Jane Doe', role: 'Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Mr. John Smith', role: 'Vice Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Mrs. Emily White', role: 'Head of Academics', image: 'https://via.placeholder.com/150' },
  ];

  const leadershipMembers = members && members.length > 0 ? members : defaultMembers;

  const renderMember = (member: any, index: number) => (
    <div key={index} className="profile-card">
      <img src={member.image} alt={member.name} className="profile-image" />
      <h3 className="profile-name">{member.name}</h3>
      <p className="profile-role">{member.role}</p>
    </div>
  );

  return (
    <section className={`leadership-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        <div className="leadership-container">
          {leadershipMembers.map(renderMember)}
        </div>
      </div>
    </section>
  );
};

export default LeadershipSection;