import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { getRooms } from "../apis/room";
import RoomCard from "../components/RoomCard/RoomCard";
import Search from "../components/Search/Search";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
const LIMIT = 10;
const Rooms = () => {
  const { state } = useLocation();
  const [params, setParams] = useState({
    page: 1,
    limit: LIMIT,
    search: state?.search || "",
    roomTypes: state?.roomType ? [state.roomType] : [],
    checkin: state?.checkin,
    checkout: state?.checkout,
  });

  const { data } = useQuery({
    queryKey: ["ListRooms", JSON.stringify(params)],
    queryFn: () => getRooms(params),
  });

  return (
    <div className="container mx-auto pt-10">
      <Search
        roomTypeFilterDefault={params.roomTypes?.[0]}
        searchQueryDefault={params.search}
        checkinDateDefault={params.checkin}
        checkoutDateDefault={params.checkout}
        onFilterClick={({ search, roomType, checkin, checkout }) => {
          setParams({
            ...params,
            search,
            roomTypes: [roomType],
            checkin,
            checkout,
          });
        }}
      />
      {data?.data && data.data.length > 0 && (
        <div className="flex mt-20 gap-5 flex-wrap">
          {data.data.map((room) => (
            <RoomCard key={room._id} room={room} />
          ))}
        </div>
      )}
      <ReactPaginate
        pageCount={data?.data ? Math.ceil(data.total / LIMIT) : 0}
        pageRangeDisplayed={5}
        marginPagesDisplayed={2}
        previousLabel={<FaAngleLeft />}
        nextLabel={<FaAngleRight />}
        containerClassName="flex space-x-2 justify-end mt-5"
        pageClassName="cursor-pointer w-[30px] h-[30px] border border-gray-300"
        pageLinkClassName="w-full h-full flex items-center justify-center"
        activeClassName="bg-[#488a4e] text-white"
        disabledClassName="cursor-not-allowed bg-gray-300"
        previousClassName="cursor-pointer flex items-center justify-center px-2 py-1 border border-gray-300"
        nextClassName="cursor-pointer flex items-center justify-center px-2 py-1 border border-gray-300"
        onPageChange={({ selected }) => {
          setParams({ ...params, page: selected + 1 });
        }}
      />
    </div>
  );
};

export default Rooms;
