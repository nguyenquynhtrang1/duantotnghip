import { Element } from "react-scroll";

const Footer = () => {
  return (
    <Element className="element" name="footer">
      <footer className="mt-16 element">
        <div className="container mx-auto px-4">
          <p className="font-black text-[#026057] text-2xl">Kayla Homestay</p>
          <h4 className="font-semibold text-[40px] py-6">Contact</h4>

          <div className="flex flex-wrap gap-16 items-center justify-between">
            <div className="flex-1">
              <ul>
                <li className="mb-2">
                  Full name: Kayla Homestay – Nhà của cây lá
                </li>
                <li className="mb-2">Business Line: Kinh doanh nhà nghỉ</li>
                <li className="mb-2">Official year of operation: 2019</li>
                <li className="mb-2">Address: Km1, Yên Bài, Ba Vì, Hà Nội</li>
                <li className="mb-2">Hotline: 092 205 1096</li>
                <li>Email: mycth.aichill@gmail.com</li>
              </ul>
            </div>

            <div className="flex-1 md:text-right">
              <p className="pb-4">Our Story</p>
              <p className="pb-4">Get in Touch</p>
              <p className="pb-4">Our Privacy Commitment</p>
              <p className="pb-4">Terms of service</p>
              <p>Customer Assistance</p>
            </div>

            <div className="flex-1 md:text-right">
              <p className="pb-4">Dining Experience</p>
              <p className="pb-4">Wellness</p>
              <p className="pb-4">Fitness</p>
              <p className="pb-4">Sports</p>
              <p>Events</p>
            </div>
          </div>
        </div>

        <div className="bg-[#b9b195] h-10 md:h-[70px] mt-16 w-full bottom-0 left-0" />
      </footer>
    </Element>
  );
};

export default Footer;
