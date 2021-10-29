import { Card, Badge } from "antd";
import Link from "next/link";
import { currencyFormatter } from "../../utils/helpers";

const { Meta } = Card;

const CourseCard = ({ course }) => {
  const { title, instructor, price, image, slug, paid, category } = course;

  return (
<Link href={`/course/${slug}`}>
  <a>
    <Card
      className="mb-4"
      cover={
        <img
          src={image.Location}
          alt={title}
          style={{ height: "300px", objectFit: "cover" }}
          className="p-1"
        />
      }
    >
Hola
    </Card>
  </a>
</Link>
  );
};

export default CourseCard;
