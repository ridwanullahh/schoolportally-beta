import React from 'react';
import { useState } from 'react';
import { Section } from '@/types';
import { useLeadership } from '@/hooks/useLeadership';



interface LeadershipSectionProps {
  section: Section;
}

const LeadershipSection: React.FC<LeadershipSectionProps> = ({ section }) => {
  const { title } = section.content;

  // Map numbered styles to actual style IDs
  const getStyleId = (styleNumber: string) => {
    const styleMap: { [key: string]: string } = {
      // New modern styles (1-11)
      '1': 'leadership-modern-grid',
      '2': 'leadership-modern-cards',
      '3': 'leadership-modern-horizontal',
      '4': 'leadership-modern-minimal',
      '5': 'leadership-modern-bordered',
      '6': 'leadership-modern-gradient',
      '7': 'leadership-modern-compact',
      '8': 'leadership-modern-asymmetric',
      '9': 'leadership-modern-typography',
      '10': 'leadership-modern-split',
      '11': 'leadership-modern-org-chart',
      // Existing ultra-modern styles (12+)
      '12': 'leadership-floating-glass',
      '13': 'leadership-holographic-cards',
      '14': 'leadership-neon-profiles',
      '15': 'leadership-particle-bg',
      '16': 'leadership-morphing-cards',
      '17': 'leadership-cyber-grid',
      '18': 'leadership-liquid-metal',
      '19': 'leadership-aurora-bg',
      '20': 'leadership-matrix-rain',
      '21': 'leadership-quantum-field',
      '22': 'leadership-neural-network',
      '23': 'leadership-hologram-effect',
      '24': 'leadership-energy-waves',
      '25': 'leadership-digital-rain',
      '26': 'leadership-mosaic-layout'
    };
    return styleMap[styleNumber] || 'leadership-modern-grid';
  };

  const styleId = getStyleId(section.styleId || '1');
  const [activeTab, setActiveTab] = useState('All');

  // Use dynamic content from leadership admin module
  const { members, loading, error } = useLeadership();

  const defaultMembers = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      role: 'Principal',
      bio: 'Leading our school with 20 years of educational experience in academic excellence and student development.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      department: 'Administration',
      email: 'principal@school.edu'
    },
    {
      id: '2',
      name: 'Mr. Michael Chen',
      role: 'Vice Principal',
      bio: 'Supporting academic excellence and fostering innovative teaching methodologies across all departments.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      department: 'Administration',
      email: 'vice.principal@school.edu'
    },
    {
      id: '3',
      name: 'Ms. Emily Rodriguez',
      role: 'Academic Director',
      bio: 'Overseeing curriculum development, teacher training, and maintaining high educational standards.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      department: 'Academics',
      email: 'academic.director@school.edu'
    },
    {
      id: '4',
      name: 'Dr. James Wilson',
      role: 'Student Affairs Director',
      bio: 'Ensuring student welfare, organizing extracurricular activities, and promoting holistic development.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      department: 'Student Affairs',
      email: 'student.affairs@school.edu'
    },
    {
      id: '5',
      name: 'Ms. Lisa Thompson',
      role: 'Head of Technology',
      bio: 'Leading digital transformation initiatives and integrating technology into modern education.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      department: 'Technology',
      email: 'tech.head@school.edu'
    },
    {
      id: '6',
      name: 'Mr. David Kumar',
      role: 'Finance Director',
      bio: 'Managing school finances, budgeting, and ensuring efficient resource allocation for growth.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      department: 'Finance',
      email: 'finance@school.edu'
    },
  ];

  // Use dynamic content if available, otherwise use defaults
  const leadershipMembers = members && members.length > 0 ? members : defaultMembers;
  
  const roles = ['All', ...new Set(leadershipMembers.map((m: any) => m.role))];
  
  const filteredMembers = activeTab === 'All'
    ? leadershipMembers
    : leadershipMembers.filter((m: any) => m.role === activeTab);

  const renderMember = (member: any, index: number) => {
    const memberImage = member.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';

    return (
      <div key={member.id || index} className="member-card">
        <img
          src={memberImage}
          alt={member.name}
          className="member-image"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face';
          }}
        />
        <div className="member-name">{member.name}</div>
        <div className="member-role">{member.role}</div>
        {member.bio && <div className="member-bio">{member.bio}</div>}
      </div>
    );
  };
  
  const renderContent = () => {
    if (loading) {
      return (
        <div className="leadership-container">
          <div className="loading-state">Loading leadership team...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="leadership-container">
          <div className="error-state">Error loading leadership team. Showing default members.</div>
          <div className="leadership-container">
            {defaultMembers.map(renderMember)}
          </div>
        </div>
      );
    }

    switch (styleId) {
      case 'leadership-sliding-carousel':
        return (
          <div className="leadership-container">
            <div className="carousel-track">
              {leadershipMembers.map(renderMember)}
              {/* Duplicate for seamless loop */}
              {leadershipMembers.map((member, index) => renderMember(member, index + leadershipMembers.length))}
            </div>
          </div>
        );
      case 'leadership-minimal-lines':
        return (
          <div className="leadership-container">
            {leadershipMembers.map(renderMember)}
          </div>
        );
      default:
        return (
          <div className="leadership-container">
            {leadershipMembers.map(renderMember)}
          </div>
        );
    }
  }

  return (
    <section className={`leadership-section ${styleId}`}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        {renderContent()}
      </div>
    </section>
  );
};

export default LeadershipSection;