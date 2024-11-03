const Gallery = () => {
  return (
    <div className="mx-auto container py-14 h-full">
      <div className="flex flex-wrap md:-m-2">
        <div className="flex w-1/2 flex-wrap">
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613583/hero-4_mtvbd8.jpg"
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613582/hero-9_hpo3cf.jpg"
              width={200}
              height={200}
            />
          </div>
          <div className="w-full p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613582/hero-7_lzcxlz.jpg"
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
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613582/hero-8_ursh69.jpg"
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613582/hero-3_ymzxpq.jpg"
              width={200}
              height={200}
            />
          </div>
          <div className="w-1/2 p-1 md:p-2 h-48">
            <img
              alt="gallery"
              className="img"
              src="https://res.cloudinary.com/dcimfzg6k/image/upload/v1730613582/hero-6_htazpu.jpg"
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
