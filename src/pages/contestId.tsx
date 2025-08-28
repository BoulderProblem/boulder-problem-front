import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useContests } from '@/services/useContests';
import Status from '@/enums/status';
import dayjs, { Dayjs } from 'dayjs';
import Contest from '@/components/contests/contest';

let baseUrl = `https://boulder-problem.chabs.fr/api`;
if (process.env.NODE_ENV !== 'production') {
  baseUrl = `http://localhost:3333`;
}

const ContestId = () => {
  const { id } = useParams();
  const { getContest, contest } = useContests();

  const [OpenModal, setOpenModal] = useState(false);

  dayjs.locale('fr');
  useEffect(() => {
    getContest(id || '0');
  }, []);

  return (
    <div className="overflow-x-auto">
      <Contest></Contest>
    </div>
  );
};

export default ContestId;
