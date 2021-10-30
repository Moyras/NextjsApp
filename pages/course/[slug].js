import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";

import { useRouter } from "next/router";
import PreviewModal from "../../components/modal/PreviewModal";
import { Context } from "../../context";
import { toast } from "react-toastify";

import SingleCourseJumbotron from "../../components/cards/SingleCourseJumbotron";
import SingleCourseLessons from "../../components/cards/SingleCourseLessons";

const SingleCourse = ({ course }) => {
  const [showModal, setShowModal] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState({});

  const {
    state: { user },
  } = useContext(Context);

  useEffect(() => {
    if (user && course) checkEnrollment();
  }, [user, course]);

  const checkEnrollment = async () => {
    try {
      const { data } = await axios.get(`http://138.197.183.149/api/check-enrollment/${course._id}`);
      setEnrolled(data);
    } catch (err) {
      console.log(err);
    }
  };
  const router = useRouter();

  const handlePaidEnrollment = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // check if user is logged in
      if (!user) router.push("/login");

      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      const { data } = await axios.post(`http://138.197.183.149/api/paid-enrollment/${course._id}`);
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);
      stripe.redirectToCheckout({ sessionId: data });
    } catch (err) {
      console.log(err);
      toast.error("Enrollment failed. Try again");
      setLoading(false);
    }
  };

  const handleFreeEnrollment = async (e) => {
    e.preventDefault();
    try {
      // check if user is logged in
      if (!user) router.push("/login");

      // check if already enrolled
      if (enrolled.status)
        return router.push(`/user/course/${enrolled.course.slug}`);
      setLoading(true);
      const { data } = await axios.post(`http://138.197.183.149/api/free-enrollment/${course._id}`);
      toast.success("Successful enrollment");

      setLoading(false);
      router.push(`/user/course/${data.course.slug}`);
    } catch (err) {
      console.log(err);
      toast.error("Enrollment failed. Try again");
      setLoading(false);
    }
  };

  return (
    <>
      <SingleCourseJumbotron
        course={course}
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
        setPreview={setPreview}
        user={user}
        loading={loading}
        handleFreeEnrollment={handleFreeEnrollment}
        handlePaidEnrollment={handlePaidEnrollment}
        enrolled={enrolled}
        setEnrolled={setEnrolled}
      />

      <PreviewModal
        showModal={showModal}
        setShowModal={setShowModal}
        preview={preview}
      />
      {course.lessons && (
        <SingleCourseLessons
          lessons={course.lessons}
          setPreview={setPreview}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </>
  );
};

export async function getServerSideProps({ query }) {
  const { data } = await axios.get(`http://138.197.183.149/api/course/${query.slug}`);
  return {
    props: { course: data },
  };
}

export default SingleCourse;
