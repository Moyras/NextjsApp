import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Item } = List;

const CourseEdit = () => {
  const router = useRouter();
  // state
  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "9.99",
    uploading: false,
    paid: true,
    loading: false,
    category: "",
    lessons: [],
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload image");

  // state for lesson update
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] =
    useState("Upload video");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    try {
      const { data } = await axios.get(`/api/course/${slug}`);
      if (data) setValues(data);
      if (data && data.image) setImage(data.image);
    } catch (err) {
      console.log(err);
    }
  };
  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    // resize

    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (url) => {
      try {
        let { data } = await axios.post("/api/course/upload-image", {
          image: url,
        });

        // set image in the state and show toast
        setImage(data);

        setValues({ ...values, loading: false });
      } catch (err) {
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error("Image upload failed, Try again!");
      }
    });
  };

  const handleImageRemove = async () => {
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      const res2 = await axios.put(`/api/course/remove-imagedb/${slug}`, {
        image,
      });

      setImage({});

      setPreview("");
      setUploadButtonText("Upload image");
      setValues({ ...values, loading: false });
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast.error("Image remove failed. Try again!.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      toast.success("Course updated!");
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index;
    let allLessons = values.lessons;
    let movingItem = allLessons[movingItemIndex];
    allLessons.splice(movingItemIndex, 1);
    allLessons.splice(targetItemIndex, 0, movingItem);
    setValues({ ...values, lessons: [...allLessons] });

    try {
      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
    } catch (err) {
      toast.error(err.response.data);
    }
  };

  const handleDelete = async (index) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    setValues({ ...values, lessons: allLessons });

    try {
      const { data } = await axios.put(`/api/course/${slug}/${removed[0]._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  const handleVideo = async (e) => {
    try {
      // remove previous
      if (current.video && current.video.Location) {
        const res = await axios.post(
          `/api/course/video-remove/${values.instructor._id}`,
          current.video
        );
      }

      // upload
      const file = e.target.files[0];
      setUploadButtonText(file.name);
      setUploading(true);
      // send video as form data

      const videoData = new FormData();
      videoData.append("video", file);
      videoData.append("courseId", values._id);

      // save progress bar and send video as form data to backend

      const { data } = await axios.post(
        `/api/course/video-upload/${values.instructor._id}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      setCurrent({ ...current, video: data });
      setUploading(false);
      toast.success("Video upload succesfully");
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("video upload failed");
    }
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `/api/course/lesson/${slug}/${current._id}`,
        current
      );
      setUploadVideoButtonText("Upload video");

      setVisible(false);

      setCurrent(data);
      if (data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({ ...values, lessons: arr });
      }
      toast.success("Lesson updated");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Edit Course</h1>
      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          setPreview={setPreview}
          uploadButtonText={uploadButtonText}
          editPage={true}
          handleImageRemove={handleImageRemove}
          image={image}
        />
      </div>
      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                ></Item.Meta>
                <DeleteOutlined
                  onClick={() => handleDelete(index)}
                  className="text-danger"
                />
              </Item>
            )}
          ></List>
        </div>
      </div>
      <Modal
        title="Update lesson"
        centered
        visible={visible}
        footer={null}
        onCancel={() => setVisible(false)}
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
