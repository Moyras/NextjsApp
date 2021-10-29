import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { title, instructor, price, image, slug, paid, category } = course;

  return (
<Link href={`/course/${slug}`}>
  <a>
   Hola
  </a>
</Link>
  );
};

export default CourseCard;
