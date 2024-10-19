import HeroSection from "../components/HeroSection/HeroSection";
import PageSearch from "../components/PageSearch/PageSearch";
import FeaturedRoom from "../components/FeaturedRoom/FeaturedRoom";
import Gallery from "../components/Gallery/Gallery";
import NewsLetter from "../components/NewsLetter/NewsLetter";
import { getRooms } from "../apis/room";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const { data } = useQuery({
    queryKey: ["featuredRoom"],
    queryFn: () => getRooms({ limit: 1 }),
  });
  return (
    <>
      <HeroSection />
      <PageSearch />
      {data?.data && <FeaturedRoom featuredRoom={data.data[0]} />}
      <Gallery />
      <NewsLetter />
    </>
  );
}
