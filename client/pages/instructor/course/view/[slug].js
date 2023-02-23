import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import axios from 'axios';
import { Avatar, Button, Tooltip, Modal, List, Form } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from '@ant-design/icons';
import ReactMarkDown from 'react-markdown';
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import { toast } from 'react-toastify';

const CourseView = () => {
  const [course, setCourse] = useState([]);

  // for lessons
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: '',
    content: '',
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState('Upload Video');
  const [progress, setProgress] = useState(0);

  //student count
  const [students, setStudents] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    // console.log(slug);
    loadCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post('/api/instructor/student-count', {
      courseId: course._id,
    });
    console.log('Service', data);
    setStudents(data.length);
  };

  // FUNCTION FOR ADD LESSONS
  const handleAddLesson = async (e) => {
    e.preventDefault();
    //console.log(values);
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${slug}/${course.instructor._id}`,
        values
      );
      setValues({ ...values, title: '', content: '', video: {} });
      setProgress(0);
      setUploadButtonText('Upload video');
      setVisible(false);
      setCourse(data);
      toast('Lesson Added');
    } catch (err) {
      console.log(err);
      toast('Add Lesson Failed!');
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      setUploadButtonText(file.name);

      setUploading(true);

      const videoData = new FormData();
      videoData.append('video', file);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/video-upload/${course.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) => {
            setProgress(Math.round((100 * e.loaded) / e.total));
          },
        }
      );
      // once response is recieved
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video Upload Failed!');
    }
  };

  const handleVideoRemove = async () => {
    try {
      setUploading(true);
      const { data } = await axios.post(
        `/api/course/video-remove/${course.instructor._id}`,
        values.video
      );
      console.log(data);
      setValues({ ...values, video: {} });
      setProgress(0);
      setUploading(false);
      setUploadButtonText('Upload Another Video');
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast('Video Remove Failed!');
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you publish your course, it will be live for personnel to enroll'
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast('Congrats! Your course is Live');
    } catch (err) {
      console.log(err);
      toast('Course publish failed, Try again');
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        'Once you unpublish your course, it will not be live for personnel to enroll'
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast('Your course is not live');
    } catch (err) {
      console.log(err);
      toast('Course unpublish failed, Try again');
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {/* <p>view {slug}</p> */}
        {course && (
          <div className="container-fluid pt-1">
            <div className="media-body pl-2">
              <div className="row">
                <div className="col-md-3">
                  <Avatar
                    size={80}
                    src={course.image ? course.image.Location : './course.png'}
                  />
                </div>
                <div className="col-md-3">
                  <h5 className="mt-2 text-primary">{course.name}</h5>
                  <p style={{ marginTop: '-10px' }}>
                    {course.lessons && course.lessons.length} Lessons
                  </p>
                  <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                    {course.category}
                  </p>
                </div>

                <div
                  className="col-md-6 text-center"
                  style={{ marginTop: '20px' }}
                >
                  <Tooltip title={`${students} Enrolled`}>
                    <UserSwitchOutlined className="h5 pointer text-warning m-5" />
                  </Tooltip>

                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() =>
                        router.push(`/instructor/course/edit/${slug}`)
                      }
                      className="h5 pointer text-warning m-5"
                    />
                  </Tooltip>

                  {course.lessons && course.lessons.length < 5 ? (
                    <Tooltip title="Min 5 lessons are required to publish">
                      <QuestionOutlined className="h5 pointer text-danger" />
                    </Tooltip>
                  ) : course.published ? (
                    <Tooltip title="Unpublish">
                      <CloseOutlined
                        onClick={(e) => handleUnpublish(e, course._id)}
                        className="h5 pointer text-danger"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Publish">
                      <CheckOutlined
                        onClick={(e) => handlePublish(e, course._id)}
                        className="h5 pointer text-success"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
            <hr />
            <div className="row">
              <div className="col">
                <ReactMarkDown source={course.description} />
              </div>
            </div>

            <div className="row">
              <Button
                onClick={() => setVisible(true)}
                className="col-md-6 offset-md-3 text-center"
                type="primary"
                shape="round"
                icon={<UploadOutlined />}
                size="large"
              >
                Add Lesson
              </Button>
            </div>
            <br />
            <Modal
              title="+ Add Lesson"
              centered
              visible={visible}
              onCancel={() => setVisible(false)}
              footer={null}
            >
              <AddLessonForm
                values={values}
                setValues={setValues}
                handleAddLesson={handleAddLesson}
                uploading={uploading}
                uploadButtonText={uploadButtonText}
                handleVideo={handleVideo}
                progress={progress}
                handleVideoRemove={handleVideoRemove}
              />
            </Modal>

            <div className="row pb-5">
              <div className="col lesson-list">
                <h4>
                  {course && course.lessons && course.lessons.length} Lessons
                </h4>
                <List
                  itemLayout="horizontal"
                  dataSource={course && course.lessons}
                  renderItem={(item, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar>{index + 1}</Avatar>}
                        title={item.title}
                      ></List.Item.Meta>
                    </List.Item>
                  )}
                ></List>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
