import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";
import Item from "antd/lib/list/Item";

const CourseView = () => {
  const [course, setCourse] = useState({});

  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload video");
  const [progress, setProgress] = useState(0);
  // student count
  const [students, setStudent] = useState(0);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
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
    try {
      const { data } = await axios.post("/api/instructor/student-count", {
        courseId: course._id,
      });
      setStudent(data.length);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `/api/course/lesson/${course.slug}/${course.instructor._id}`,
        values
      );

      setValues({ ...values, title: "", content: "", video: {} });
      setProgress(0);
      setVisible(false);
      setUploadButtonText("Upload video");
      setCourse(data);
      toast.success("Lesson added");
    } catch (err) {
      console.log(err);
      toast.error("Lesson add failed");
    }
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setUploadButtonText(file.name);
      } else {
        handleVideoRemove();
        return;
      }
      setUploading(true);
      const videoData = new FormData();
      videoData.append("video", file);
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

      // once response is recived

      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
      toast.error("Video upload failed");
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
      setUploadButtonText("Upload video");
    } catch (err) {
      console.log(err);
      toast.error("Video remove failed");
      setUploading(false);
    }
  };

  const handlePublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live in ther marketplace for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${courseId}`);
      setCourse(data);
      toast.success("Congrats! Your course is live");
    } catch (err) {
      toast.error("Course publish failed, Try again!");
      console.log(err);
    }
  };

  const handleUnpublish = async (e, courseId) => {
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it not will be available for users to enroll"
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${courseId}`);
      setCourse(data);
      toast.success("Your course is unpublished");
    } catch (err) {
      console.log(err);
      toast.error("Course unpublish failed, Try again!");
    }
  };

  return (
    <InstructorRoute>
      <div className="container-fluid pt-3">
        {course && (
          <div>
            <div className="container-fluid d-flex pt1">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.jpeg"}
              />
              <div className="px-3 ">
                <div className="row w-100">
                  <div className="col">
                    <h5 className="mt-2 text-primary">{course.title}</h5>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons && course.lessons.length} lessons
                    </p>
                    <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                      {course.category}
                    </p>
                  </div>
                  <div className="d-flex col-1">
                    <Tooltip
                      title={`${students} enrolled`}
                      className="h4 pointer text-info p-4 float-end"
                    >
                      <UserSwitchOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                      />
                    </Tooltip>
                    <Tooltip
                      title="Edit"
                      className="h4 pointer text-warning p-4"
                    >
                      <EditOutlined
                        onClick={() =>
                          router.push(`/instructor/course/edit/${slug}`)
                        }
                      />
                    </Tooltip>
                    {course.lessons && course.lessons.length < 5 ? (
                      <Tooltip
                        title="Min 5 lessons required to publish"
                        className="h4 pointer text-danger py-4"
                      >
                        <QuestionOutlined />
                      </Tooltip>
                    ) : course.published ? (
                      <Tooltip
                        title="Unpublish"
                        className="h4 pointer text-danger py-4"
                      >
                        <CloseOutlined
                          onClick={(e) => handleUnpublish(e, course._id)}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        title="Publish"
                        className="h4 pointer text-succes py-4"
                      >
                        <CheckOutlined
                          onClick={(e) => handlePublish(e, course._id)}
                        />
                      </Tooltip>
                    )}
                    {/* <Tooltip
                      title="Publish"
                      className="h4 pointer text-danger py-4"
                    >
                      
                    </Tooltip> */}
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="row ms-4 mt-2">
              <div className="col">
                <ReactMarkdown children={course.description} />
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
                Add lesson
              </Button>
              <br />
              <Modal
                title="+ Add lesson"
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
                      <Item>
                        <Item.Meta
                          avatar={<Avatar>{index + 1}</Avatar>}
                          title={item.title}
                        ></Item.Meta>
                      </Item>
                    )}
                  ></List>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
