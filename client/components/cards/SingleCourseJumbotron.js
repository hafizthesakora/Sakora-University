import { LoadingOutlined, SafetyOutlined } from '@ant-design/icons';
import SingleCourse from '../../pages/course/[slug]';
import { currencyFormatter } from '../../utils/helpers';
import { Badge, Modal, Button } from 'antd';
import ReactPlayer from 'react-player';

const SingleCourseJumbotron = ({
  course,
  preview,
  setPreview,
  showModal,
  setShowModal,
  loading,
  user,
  handlePaidEnrollment,
  handleFreeEnrollment,
  enrolled,
  setEnrolled,
}) => {
  //destructure
  const {
    name,
    description,
    instructor,
    updatedAt,
    lessons,
    image,
    price,
    paid,
    category,
  } = course;

  return (
    <div className="jumbotron bg-primary square p-5">
      <div className="row">
        <div className="col-md-8">
          {/* title */}
          <h1 className="text-light font-weight-bold">{name}</h1>
          {/* description */}
          <p className="lead">
            {description && description.substring(0, 160)}...
          </p>
          {/* category */}
          <Badge
            count={category}
            style={{ backgroundColor: '#03a9f4' }}
            className="pb-4 mr-2"
          />
          {/* Author */}
          <p>Created By {instructor.name}</p>
          <p>Last Updated {new Date(updatedAt).toLocaleDateString()}</p>

          {/* price */}
          {/* <h4 className='text-light'>
            {
                paid ? currencyFormatter({
                    amount: price,
                    currency: "usd"
                }) : "Free"
            }
        </h4> */}
        </div>
        <div className="col-md-4">
          {lessons[0].video && lessons[0].video.Location ? (
            <div
              onClick={() => {
                setPreview(lessons[0].video.Location);
                setShowModal(!showModal);
              }}
            >
              <ReactPlayer
                className="react-player-div"
                url={lessons[0].video.Location}
                light={image.Location}
                width="100%"
                height="255px"
              />
            </div>
          ) : (
            <>
              <img src={image.Location} alt={name} className="img img-fluid" />
            </>
          )}
          {loading ? (
            <div className="w-100 justify-content-center">
              <LoadingOutlined className="h1 text-danger" />
            </div>
          ) : (
            <Button
              className="mb-3 mt-3"
              type="danger"
              block
              shape="round"
              icon={<SafetyOutlined />}
              size="large"
              disabled={loading}
              onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}
            >
              {user
                ? enrolled.status
                  ? 'Go to course'
                  : 'Enroll'
                : 'Login to enroll'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleCourseJumbotron;
