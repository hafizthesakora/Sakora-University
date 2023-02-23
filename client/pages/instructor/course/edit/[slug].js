import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { List, Avatar, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';

const CourseEdit = () => {
  const router = useRouter();
  const { slug } = router.query;
  //state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
    lessons: [],
  });

  const [image, setImage] = useState({});

  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

  //state for lesson update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState('Upload Video');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadCourse();
  }, []);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    if (data) setValues(data);
    if (data && data.image) setImage(data.image);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(e.target.files[0]));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //Resize
    Resizer.imageFileResizer(
      file,
      720,
      500,
      'JPEG/PNG/JPG',
      100,
      0,
      async (uri) => {
        try {
          let { data } = await axios.post('/api/course/upload-image', {
            image: uri,
          });
          console.log('Image Uploaded', data);
          //set image in the state
          setImage(data);
          setValues({ ...values, loading: false });
        } catch (err) {
          console.log(err);
          setValues({ ...values, loading: false });
          toast('Image upload failed. Try again later.');
        }
      }
    );
  };

  const handleImageRemove = async () => {
    //console.log('Remove Image');
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post('/api/course/remove-image', { image });
      setImage({});
      setPreview('');
      setUploadButtonText('Upload Image');
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast('Image upload failed. Try again later.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(values);
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast('Course Updated');
      router('/instructor');
      //router.push('/instructor');
    } catch (err) {
      console.log(err);
      toast(err.response);
    }
  };

  const handleDrag = (e, index) => {
    // console.log('ON DRAG => ', index);
    e.dataTransfer.setData('itemIndex', index);
  };

  const handleDrop = async (e, index) => {
    //console.log('ON DROP => ', index);
    const movingItemIndex = e.dataTransfer.getData('itemIndex');
    const targetItemIndex = index;

    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);

    setValues({ ...values, lessons: [...allLessons] });
    //save the new order in db
    const { data } = await axios.put(`/api/course/${slug}`, {
      ...values,
      image,
    });
    toast('Lessons Rearranged successfully');
  };

  const handleDelete = async (index) => {
    const answer = window.confirm('Are you sure you want to Delete?');
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });
    //send request to server
    const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    //console.log('Lesson Deleted => ', data);
    toast('Lesson Deleted successfully');
  };

  //LESSONS UPDATE FUNCTIONS

  const handleVideo = async (e) => {
    //remove previous vide if any
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/video-remove/${values.instructor._id}`,
        current.video
      );
      console.log('removed', res);
    }

    //Upload new one
    const file = e.target.files[0];
    setUploadVideoButtonText(file.name);
    setUploading(true);

    //send video as form data
    const videoData = new FormData();
    videoData.append('video', file);
    videoData.append('courseId', values._id);

    //save progress bar and send vide as a form data to backend
    const { data } = await axios.post(
      `/api/course/video-upload/${values.instructor._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    //console.log('Handle update lesson');
    e.preventDefault();
    const { data } = await axios.put(
      `/api/course/lesson/${slug}/${current._id}`,
      current
    );
    setUploadVideoButtonText('Upload Video');
    setVisible(false);

    //update ui
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      setProgress(0);
      toast('Lesson Updated');
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square p-5">Update Course</h1>
      {/* {JSON.stringify(values)} */}
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          editPage={true}
          handleImageRemove={handleImageRemove}
        />
      </div>
      <hr />
      <div className="row mt-3 pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <List.Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <List.Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></List.Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger float-right"
                />
              </List.Item>
            )}
          ></List>
        </div>
      </div>

      <Modal
        title="Update lesson"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          uploading={uploading}
        />
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
