import { useNavigate } from "react-router-dom";
import Search from "../Search/Search";

const PageSearch = () => {
  const navigate = useNavigate();
  return (
    <Search
      searchQueryDefault=""
      roomTypeFilterDefault=""
      onFilterClick={(search, roomType) => {
        navigate("/rooms", { state: { search, roomType } });
      }}
    />
  );
};

export default PageSearch;
