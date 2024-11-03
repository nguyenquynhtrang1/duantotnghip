import { FC } from "react";

import CountUpNumber from "../CountUpNumber/CountUpNumber";
import { getTotalByRoomType } from "../../apis/room";
import { useQuery } from "@tanstack/react-query";

type Props = {
  heading1: React.ReactNode;
  section2: React.ReactNode;
};

const ClientComponent: FC<Props> = (props) => {
  const { heading1, section2 } = props;
  const { data } = useQuery({
    queryKey: ["totalRoomsByRoomType"],
    queryFn: () => getTotalByRoomType(),
  });

  return (
    <section className="flex px-4 items-center gap-12 container mx-auto">
      <div className="py-10 h-full">
        {heading1}
        <div className="flex gap-5 flex-wrap">
          {data?.data.map((roomType) => (
            <div
              key={roomType.name}
              className="w-1/4 flex gap-3 flex-col items-center justify-center"
            >
              <p className="text-xs lg:text-xl text-center">{roomType.name}</p>
              <CountUpNumber duration={2000} endValue={roomType.total} />
            </div>
          ))}
        </div>
      </div>
      {section2}
    </section>
  );
};

export default ClientComponent;
