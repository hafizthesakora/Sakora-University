import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';

const StudentRoute = ({ children }) => {
  //state
  const [ok, setOk] = useState(false);

  //router
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/current-user');
        console.log(data);
        if (data.ok) setOk(true);
      } catch (err) {
        console.log(err);
        setOk(false);
        router.push('/login');
      }
    };
    fetchUser();
  }, []);
  return (
    <>
      {!ok ? (
        <SyncOutlined
          spin
          className="justify-center display-1 text-primary p-5"
        />
      ) : (
        <>
          <div className="container-fluid">{children}</div>
        </>
      )}
    </>
  );
};

export default StudentRoute;
