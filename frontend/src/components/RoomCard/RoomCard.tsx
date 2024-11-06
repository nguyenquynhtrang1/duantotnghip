import { FC } from "react";
import { Room } from "../../types/room";
import { Link } from "react-router-dom";
import { convertToVND } from "../../libs";

type Props = {
  room: Room;
};

const RoomCard: FC<Props> = (props) => {
  const {
    room: { _id, name, price, description, photos, roomType },
  } = props;

  return (
    <div className="rounded-xl w-72 mb-10 mx-auto md:mx-0 overflow-hidden text-black">
      <div className="h-60 overflow-hidden">
        <img
          src={photos[0]}
          alt={name}
          width={250}
          height={250}
          className="img scale-animation"
        />
      </div>

      <div className="p-4 bg-white">
        <div className="flex justify-between text-xl font-semibold">
          <p>{name}</p>
          <p>{convertToVND(price)}</p>
        </div>

        <p className="pt-2 text-xs">{roomType?.name} Room</p>
        <p className="mt-3 mb-6 line-clamp-3 h-[72px]">{description}</p>

        <Link
          to={`/rooms/${_id}`}
          className="bg-primary inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold hover:-translate-y-2 hover:shadow-lg transition-all duration-500"
        >
          BOOK NOW
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
