import { GraphHome } from "@/components/GraphHome.tsx";
import useAuth from "@/services/useAuth";
import { useEffect } from "react";

const Home = () => {
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

export default Home;
