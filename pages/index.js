import axios from "axios";
import CourseCard from "../components/cards/CourseCard";

const Index = ({ data }) => {

  return (
    <>
      <h1 className="square jumbotron text-center bg-primary">
        Online Education Marketplace
      </h1>
      <div className="container-fluid">
        <div className="row"><pre>{JSON.stringify(data, null,4)}</pre>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`http://138.197.183.149/api/courses`);
  return {
    props: { data },
  };
}

export default Index;
