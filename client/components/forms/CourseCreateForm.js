import { Select, Button, Avatar, Badge } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 1.99; i <= 100.99; i++) {
    children.push(<Option key={i.toFixed(2)}> GHS {i.toFixed(2)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group pt-3">
            <textarea
              name="description"
              placeholder="Description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="row pt-3">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: '100%' }}
                  size="large"
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="col">
                <div className="form-group">
                  <Select
                    defaultValue="GHS9.99"
                    style={{ width: '100%' }}
                    onChange={(v) => setValues({ ...values, price: v })}
                    tokenSeparators={[,]}
                    size="large"
                  >
                    {children}
                  </Select>
                </div>
              </div>
            )}
          </div>

          <div className="form-group pt-3">
            <input
              type="text"
              name="category"
              className="form-control"
              placeholder="Category"
              value={values.category}
              onChange={handleChange}
            />
          </div>

          <div className="row pt-3">
            <div className="col-md-6">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}
                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {preview && (
              <div className="col-md-6">
                <Badge
                  count="X"
                  onClick={handleImageRemove}
                  className="pointer"
                >
                  <Avatar width={200} src={preview} />
                </Badge>
              </div>
            )}

            {editPage && values.image && (
              <Avatar width={200} src={values.image.Location} />
            )}
          </div>

          <div className="row pt-3">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary"
                icon={<SaveOutlined />}
                loading={values.loading}
                size="large"
              >
                {values.loading ? 'Saving...' : 'Save & Continue'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

export default CourseCreateForm;
