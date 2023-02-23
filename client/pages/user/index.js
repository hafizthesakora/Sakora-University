import { useContext, useEffect, useState } from 'react';
import { Context } from '../../context';
import UserRoute from '../../components/routes/UserRoute';
import axios from 'axios';
import { Avatar } from 'antd';
import Link from 'next/link';
import { SyncOutlined, PlayCircleOutlined } from '@ant-design/icons';

const UserIndex = () => {
  const {
    state: { user },
  } = useContext(Context);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user-courses');
      setCourses(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <UserRoute>
      {loading && (
        <SyncOutlined
          spin
          className="w-100 justify-content-center display-1 text-danger p-5"
        />
      )}
      <h1 className="jumbotron p-5 text-center square">User Dashboard</h1>

      {/* Show list of courses */}
      {courses &&
        courses.map((course) => (
          <div key={course._id} className="row pt-2 pb-1">
            <div className="col-md-4">
              <Avatar
                size={100}
                shape="square"
                src={course.image ? course.image.Location : '/course.png'}
              />
            </div>

            <div className="col-md-4 mt-3 text-center">
              <Link
                href={`/user/course/${course.slug}`}
                style={{ cursor: 'pointer' }}
                className="pointer"
              >
                <a>
                  <h5 className="mt-2 text-primary">{course.name}</h5>
                </a>
              </Link>
              <p style={{ marginTop: '-10px' }}>
                {course.lessons.length} Lessons
              </p>
              <p
                className="text-muted"
                style={{ marginTop: '-15px', fontSize: '12px' }}
              >
                By {course.instructor.name}
              </p>
            </div>

            <div className="col-md-4 mt-3 text-center">
              <Link
                href={`/user/course/${course.slug}`}
                style={{ cursor: 'pointer' }}
                className="pointer"
              >
                <a>
                  <PlayCircleOutlined className="h2 text-primary" />
                </a>
              </Link>
            </div>
          </div>
        ))}
    </UserRoute>
  );
};

export default UserIndex;
