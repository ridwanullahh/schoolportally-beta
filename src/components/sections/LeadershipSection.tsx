import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import '@/themes/styles/sections/leadership.css';

interface LeadershipSectionProps {
  section: Section;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ section }) => {
  const { title, members } = section.content;
  const styleId = section.styleId || 'leadership-profile-grid';
  const [activeTab, setActiveTab] = useState('All');

  const defaultMembers = [
    { name: 'Dr. Jane Doe', role: 'Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Mr. John Smith', role: 'Vice Principal', image: 'https://via.placeholder.com/150' },
    { name: 'Mrs. Emily White', role: 'Head of Academics', image: 'https://via.placeholder.com/150' },
  ];

  const leadershipMembers = members && members.length > 0 ? members : defaultMembers;
  
  const roles = ['All', ...new Set(leadershipMembers.map((m: any) => m.role))];
  
  const filteredMembers = activeTab === 'All'
    ? leadershipMembers
    : leadershipMembers.filter((m: any) => m.role === activeTab);

  const renderMember = (member: any, index: number) => (
    <div key={index} className="profile-card">
      <img src={member.image} alt={member.name} className="profile-image" />
      <h3 className="profile-name">{member.name}</h3>
      <p className="profile-role">{member.role}</p>
    </div>
  );
  
  const renderContent = () => {
    if (styleId === 'leadership-tabbed-roles') {
      return (
        <div>
          <div className="tabs flex justify-center gap-4 mb-8">
            {roles.map((role: string) => (
              <button key={role} className={`tab ${activeTab === role ? 'active' : ''}`} onClick={() => setActiveTab(role)}>
                {role}
              </button>
            ))}
          </div>
          <div className="leadership-container grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredMembers.map(renderMember)}
          </div>
        </div>
      )
    }

    return (
      <div className="leadership-container grid grid-cols-1 md:grid-cols-3 gap-8">
        {leadershipMembers.map(renderMember)}
      </div>
    )
  }

  return (
    <section className={`leadership-section py-16 ${styleId}`}>
      <div className="container mx-auto px-4">
        {title && <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default LeadershipSection;