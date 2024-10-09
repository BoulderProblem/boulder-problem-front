import { GraphHome } from "@/components/GraphHome";
import useAuth from "@/services/useAuth";
import React, { useEffect } from "react";

const Index = () => {
  const { getStats } = useAuth();
  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>
      <div className="m-20">
        <GraphHome></GraphHome>
      </div>
    </div>
  );
};

export default Index;
