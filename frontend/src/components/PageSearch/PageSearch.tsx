import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";

const PageSearch = () => {
  const navigate = useNavigate();
  return (
    <Search
      searchQueryDefault=""
      roomTypeFilterDefault=""
      checkinDateDefault={null}
      checkoutDateDefault={null}
      onFilterClick={({ search, roomType, checkin, checkout }) => {
        navigate("/rooms", { state: { search, roomType, checkin, checkout } });
      }}
    />
  );
};

export default PageSearch;
