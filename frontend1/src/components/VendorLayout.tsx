import React from 'react';
import { Outlet } from 'react-router-dom';

const VendorLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest/5 via-moss/10 to-clay/5">
      <Outlet />
    </div>
  );
};

export default VendorLayout;
