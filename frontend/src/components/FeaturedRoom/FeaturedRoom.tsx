import { FC } from "react";
import { Room } from "../../types/room";
import { Link } from "react-router-dom";
import { convertToVND } from "../../libs";

type Props = {
  featuredRoom?: Room;
};

const FeaturedRoom: FC<Props> = (props) => {
  const { featuredRoom } = props;

  return (
    <section className="flex md:flex-row flex-col px-4 py-10 items-center gap-12 container mx-auto">
      <div className="md:grid gap-8 grid-cols-1">
        <div className="rounded-2xl overflow-hidden h-48 mb-4 md:mb-0">
          <img
            src={featuredRoom?.photos[0]}
            alt={featuredRoom?.name}
            width={300}
            height={300}
            className="img scale-animation"
          />
        </div>
        <div className="grid grid-cols-2 gap-8 h-48">
          {featuredRoom?.photos.splice(1, 2).map((url) => (
            <div key={url} className="rounded-2xl overflow-hidden">
              <img
                src={url}
                alt=""
                width={300}
                height={300}
                className="img scale-animation"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="md:py-10 md:w-1/2 text-left">
        <h3 className="font-heading mb-12">Featured Room</h3>
        <p className="font-normal max-w-lg whitespace-pre-wrap break-words">
          {featuredRoom?.description}
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between mt-5">
          <div className="flex mb-3 md:mb-0">
            <div className="flex gap-3 flex-col items-center justify-center mr-4">
              <p className="text-xs lg:text-xl text-center">Start From</p>
              <p className="md:font-bold flex font-medium text-lg xl:text-5xl">
                {convertToVND(featuredRoom?.price as number)}
              </p>
            </div>
            <div className="flex gap-3 flex-col items-center justify-center mr-4">
              <p className="text-xs lg:text-xl text-center">Discount</p>
              <p className="md:font-bold flex font-medium text-lg xl:text-5xl">
                {featuredRoom?.discount}%
              </p>
            </div>
          </div>

          <Link
            to={`/rooms/${featuredRoom?._id}`}
            className="border h-fit text-center border-[#b9b195] text-[#b9b195] px-3 py-2 lg:py-5 lg:px-7 rounded-2xl font-bold lg:text-xl"
          >
            More Details
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoom;
