import Dashboard from "@/components/taxpayers/Dashboard";
import Trips from "@/components/trips/Trips";
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
