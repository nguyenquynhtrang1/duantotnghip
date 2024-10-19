"// use client";

import { useContext } from "react";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/user";
import { Link } from "react-router-dom";
import ThemeContext from "../../context/themeContext";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <header className="py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
      <div className="flex items-center w-full md:2/3">
        <Link to="/" className="font-black text-tertiary-dark">
          Kayla Homestay
        </Link>
        <ul className="flex items-center ml-5">
          <li className="flex items-center">
            {data?.data ? (
              <Link to={`/profile`}>
                <FaUserCircle className="cursor-pointer" />
              </Link>
            ) : (
              <Link to="/login">
                <FaUserCircle className="cursor-pointer" />
              </Link>
            )}
          </li>
          <li className="ml-2">
            {darkTheme ? (
              <MdOutlineLightMode
                className="cursor-pointer"
                onClick={() => {
                  setDarkTheme(false);
                  localStorage.removeItem("hotel-theme");
                }}
              />
            ) : (
              <MdDarkMode
                className="cursor-pointer"
                onClick={() => {
                  setDarkTheme(true);
                  localStorage.setItem("hotel-theme", "true");
                }}
              />
            )}
          </li>
        </ul>
      </div>

      <ul className="flex items-center justify-between w-full md:w-1/3 mt-4">
        <li className="hover:-translate-y-2 duration-500 transition-all">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:-translate-y-2 duration-500 transition-all">
          <Link to="/rooms">Rooms</Link>
        </li>
        <li className="hover:-translate-y-2 duration-500 transition-all">
          <Link to="/">Contact</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
