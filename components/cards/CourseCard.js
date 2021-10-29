import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { title, instructor, price, image, slug, paid, category } = course;

  return (
 <pre>{JSON.stringify(course, null, 4)}</pre>
  );
};

export default CourseCard;
