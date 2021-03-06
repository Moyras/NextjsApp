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
          src={(image && image.Location) ? (image.Location) : ("https://martialartsplusinc.com/wp-content/uploads/2017/04/default-image.jpg")}
          alt={title}
          style={{ height: "300px", objectFit: "cover" }}
          className="p-1"
        />
      }
    >
      <h2 className="font-weight-bold">{title}</h2>
      <p>by {instructor.name}</p>
      <Badge
        count={category}
        style={{ backgroundColor: "#03a9f4" }}
        className="pb-2 mr-2"
      />
      <h4 className="pt-2">
        {paid ? currencyFormatter({ amount: price, currency: "usd" }) : "Free"}{" "}
      </h4>
    </Card>
  </a>
</Link>
  );
};

export default CourseCard;
