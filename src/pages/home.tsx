import { GraphHome } from '@/components/GraphHome.tsx';
import useAuth from '@/services/useAuth';
import { useEffect } from 'react';
import { GerantHome } from '@/components/GerantHome';

const Home = () => {
  const { getStats, user } = useAuth();
  useEffect(() => {
    getStats();
  }, []);
  return (
    <div>
      <div className="mx-5 lg:mx-20 my-10">
        {/* {user?.roleId === 3 ? <GraphHome></GraphHome> : ''} */}
        component admin
        <GraphHome></GraphHome>
      </div>
      <div className="mx-5 lg:mx-20 my-10">
        {/* {user?.roleId === 2 ? <GraphHome></GraphHome> : ''} */}
        component Gérants
        <GerantHome></GerantHome>
      </div>
    </div>
  );
};

export default Home;
