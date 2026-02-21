import React from 'react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-heading font-bold text-white mb-4">{title}</h1>
      <p className="text-slate-gray">
        This page is currently under construction.
      </p>
    </div>
  );
};

export default PlaceholderPage;
