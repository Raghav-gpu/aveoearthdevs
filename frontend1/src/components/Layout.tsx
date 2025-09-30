import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">{children ? children : <Outlet />}</main>
    </>
  );
};

export default Layout;
