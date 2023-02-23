import { useState, useEffect } from 'react';
import axios from 'axios';
import InstructorRoute from '../../../components/routes/InstructorRoute';
import CourseCreateForm from '../../../components/forms/CourseCreateForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const CourseCreate = () => {
  const router = useRouter();
  //state
  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '9.99',
    uploading: false,
    paid: true,
    category: '',
    loading: false,
  });

  const [image, setImage] = useState({});

  const [preview, setPreview] = useState('');
  const [uploadButtonText, setUploadButtonText] = useState('Upload Image');

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
      'JPEG/PNG',
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
      const { data } = await axios.post('/api/course', {
        ...values,
        image,
      });
      toast('Great! Now you can Start adding Lectures');
      router.push('/instructor');
    } catch (err) {
      console.log(err);
      toast(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square p-5">Create Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseCreate;
