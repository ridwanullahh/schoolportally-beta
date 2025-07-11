import React from 'react';

export const Footer = () => {
    return (
        <footer className="bg-white shadow-md p-4 mt-auto">
            <p className="text-center text-sm text-gray-500">
                © {new Date().getFullYear()} School Portal. All rights reserved.
            </p>
        </footer>
    );
};
