import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useContests } from '@/services/useContests';
import dayjs from 'dayjs';
import Contest from '@/components/contests/contest';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const ContestId = () => {
  const { id } = useParams();
  const { getContest } = useContests();

  const locale = navigator.language || 'fr';
  dayjs.locale(locale);
  useEffect(() => {
    getContest(id || '0');
  }, []);

  return (
    <div>
      <Contest></Contest>
    </div>
  );
};

export default ContestId;
