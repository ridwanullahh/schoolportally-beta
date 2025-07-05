
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { School } from '@/types';
import { MapPin, Phone, Mail } from 'lucide-react';

interface SchoolFooterProps {
  school: School;
}

const SchoolFooter: React.FC<SchoolFooterProps> = ({ school }) => {
  const { schoolSlug } = useParams();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* School Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {school.logo && (
                <img src={school.logo} alt={school.name} className="h-10 w-10 object-contain" />
              )}
              <span className="text-xl font-bold">{school.name}</span>
            </div>
            <p className="text-gray-300 mb-4">
              Providing quality education and nurturing future leaders.
            </p>
            <div className="space-y-2">
              {school.address && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{school.address}</span>
                </div>
              )}
              {school.phone && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{school.phone}</span>
                </div>
              )}
              {school.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{school.email}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to={`/${schoolSlug}/about`} className="text-gray-300 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/programs`} className="text-gray-300 hover:text-white">
                  Programs
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/admissions`} className="text-gray-300 hover:text-white">
                  Admissions
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/contact`} className="text-gray-300 hover:text-white">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to={`/${schoolSlug}/blog`} className="text-gray-300 hover:text-white">
                  News & Blog
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/events`} className="text-gray-300 hover:text-white">
                  Events
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/gallery`} className="text-gray-300 hover:text-white">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to={`/${schoolSlug}/faq`} className="text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} {school.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SchoolFooter;
