import hero1 from "../../assets/hero-1.jpeg";
import hero2 from "../../assets/hero-2.jpeg";
import hero3 from "../../assets/hero-3.jpeg";

const Gallery = () => {
  return (
    <div className="mx-auto container py-14 h-full">
      <div className="flex flex-wrap md:-m-2">
        <div className="flex w-1/2 flex-wrap">
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero1}
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero2}
              width={200}
              height={200}
            />
          </div>
          <div className="w-full p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero3}
              width={200}
              height={200}
            />
          </div>
        </div>
        <div className="flex w-1/2 flex-wrap">
          <div className="w-full p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero1}
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero2}
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src={hero3}
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
