import Dashboard from "@/components/taxpayers/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import React from "react";

const MainHome = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
};

export default MainHome;
