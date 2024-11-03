import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, FC, useState } from "react";
import { getRoomTypes } from "../../apis/roomType";
import DatePicker from "react-datepicker";

type Props = {
  roomTypeFilterDefault: string;
  searchQueryDefault: string;
  checkinDateDefault: Date | null;
  checkoutDateDefault: Date | null;
  onFilterClick: ({
    search,
    roomType,
    checkin,
    checkout,
  }: {
    search?: string;
    roomType?: string;
    checkin?: string;
    checkout?: string;
  }) => void;
};

const Search: FC<Props> = ({
  roomTypeFilterDefault,
  searchQueryDefault,
  checkinDateDefault,
  checkoutDateDefault,
  onFilterClick,
}) => {
  const [search, setSearch] = useState(searchQueryDefault);
  const [roomType, setRoomType] = useState(roomTypeFilterDefault);
  const [checkinDate, setCheckinDate] = useState<Date | null>(
    checkinDateDefault
  );
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(
    checkoutDateDefault
  );

  const { data } = useQuery({
    queryKey: ["ListRoomTypes"],
    queryFn: () => getRoomTypes({ page: 1, limit: 0 }),
  });

  const handleRoomTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setRoomType(event.target.value);
  };

  const handleSearchQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleFilterClick = () => {
    onFilterClick({
      search,
      roomType,
      checkin: checkinDate?.toISOString(),
      checkout: checkoutDate?.toISOString(),
    });
  };

  return (
    <section className="bg-[#b9b195] px-4 py-6 rounded-lg">
      <div className="container mx-auto flex gap-4 flex-wrap justify-between items-center">
        <div className="w-full md:1/4 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black">
            Room Type
          </label>
          <div className="relative">
            <select
              value={roomType}
              onChange={handleRoomTypeChange}
              className="w-full px-4 py-2 capitalize rounded leading-tight dark:bg-black focus:outline-none"
            >
              <option value="">All</option>
              {data?.data.map((roomType) => (
                <option key={roomType._id} value={roomType._id}>
                  {roomType.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="w-full md:1/4 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black">
            Check-in & Check-out
          </label>
          <DatePicker
            selected={checkinDate}
            selectsRange
            selectsDisabledDaysInRange
            startDate={checkinDate ?? undefined}
            endDate={checkoutDate ?? undefined}
            onChange={(dates) => {
              if (dates instanceof Array) {
                setCheckinDate(dates[0]);
                setCheckoutDate(dates[1]);
              }
            }}
            isClearable
            dateFormat="dd/MM/yyyy"
            placeholderText="Check-in & Check-out"
            minDate={new Date()}
            className="h-[44px] w-[250px] px-4 rounded dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white"
          />
        </div>

        <div className="w-full md:1/4 lg:w-auto mb-4 md:mb-0">
          <label className="block text-sm font-medium mb-2 text-black">
            Search
          </label>
          <input
            type="search"
            id="search"
            placeholder="Search..."
            className="w-full px-4 py-3 rounded leading-tight dark:bg-black focus:outline-none placeholder:text-black dark:placeholder:text-white"
            value={search}
            onChange={handleSearchQueryChange}
          />
        </div>

        <button
          className="btn-primary"
          type="button"
          onClick={handleFilterClick}
        >
          Search
        </button>
      </div>
    </section>
  );
};

export default Search;
