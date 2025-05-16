"// use client";

import { useContext } from "react";

import { useQuery } from "@tanstack/react-query";
import { getProfile } from "../../apis/user";
import { Link } from "react-router-dom";
import ThemeContext from "../../context/themeContext";
import { FaUserCircle } from "react-icons/fa";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { Link as ScrollLink } from "react-scroll";

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  return (
    <header className="py-6 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between">
      <div className="flex items-center w-full md:2/3">
        <Link to="/" className="font-black text-[#026057] text-3xl mr-3">
          Verdant Homestay
        </Link>
        {darkTheme ? (
          <MdOutlineLightMode
            className="cursor-pointer text-2xl"
            onClick={() => {
              setDarkTheme(false);
              localStorage.removeItem("hotel-theme");
            }}
          />
        ) : (
          <MdDarkMode
            className="cursor-pointer text-2xl"
            onClick={() => {
              setDarkTheme(true);
              localStorage.setItem("hotel-theme", "true");
            }}
          />
        )}
      </div>
      <div className="flex w-full md:w-1/3 mt-4 items-center justify-between">
        <ul className="flex items-center justify-between flex-1">
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link to="/" className="font-bold">
              Home
            </Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <Link to="/rooms" className="font-bold">
              Rooms
            </Link>
          </li>
          <li className="hover:-translate-y-2 duration-500 transition-all">
            <ScrollLink
              to="footer"
              spy={true}
              smooth={true}
              offset={50}
              duration={500}
              className="font-bold cursor-pointer"
            >
              Contact
            </ScrollLink>
          </li>
        </ul>
        <div className="ml-6">
          <Link to={data?.data ? `/profile` : "/login"}>
            <FaUserCircle className="cursor-pointer text-3xl" />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
