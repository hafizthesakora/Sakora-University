import Link from 'next/link';
import { useState, useEffect } from 'react';

const InstructorNav = () => {
  const [current, setCurrent] = useState('');

  useEffect(() => {
    process.browser && setCurrent(window.location.pathname);
  }, [process.browser && window.location.pathname]);

  return (
    <div className="nav flex-column nav-pills">
      <Link href="/instructor">
        <a className={`nav-link ${current === '/instructor' && 'active'}`}>
          Dashboard
        </a>
      </Link>

      <Link href="/instructor/course/create">
        <a
          className={`nav-link ${
            current === '/instructor/course/create' && 'active'
          }`}
        >
          Course Create
        </a>
      </Link>

      <Link href="/instructor/orf-world/create">
        <a
          className={`nav-link ${
            current === '/instructor/orf-world/create' && 'active'
          }`}
        >
          Upload a video/picture
        </a>
      </Link>
    </div>
  );
};

export default InstructorNav;
