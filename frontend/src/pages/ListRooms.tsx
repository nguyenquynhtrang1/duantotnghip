import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getRooms } from "../apis/room";
import RoomCard from "../components/RoomCard/RoomCard";
import Search from "../components/Search/Search";

const Rooms = () => {
  const { state } = useLocation();
  const [params, setParams] = useState({
    page: 1,
    limit: 0,
    search: state?.search || "",
    roomType: state?.roomType || "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["ListRooms", JSON.stringify(params)],
    queryFn: () => getRooms(params),
  });

  return (
    <div className="container mx-auto pt-10">
      <Search
        roomTypeFilterDefault={params.roomType}
        searchQueryDefault={params.search}
        onFilterClick={(search, roomType) => {
          setParams({ ...params, search, roomType });
        }}
      />
      {!isLoading && (
        <div className="flex mt-20 gap-5 flex-wrap">
          {data?.data.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
