import { Element } from "react-scroll";

const Footer = () => {
  return (
    <Element className="element" name="footer">
      <footer className="mt-16 element">
        <div className="container mx-auto px-4">
          <p className="font-black text-[#026057] text-2xl">Verdant Homestay</p>
          <h4 className="font-semibold text-[40px] py-6">Contact</h4>

          <div className="flex flex-wrap gap-16 items-center justify-between">
            <div className="flex-1">
              <ul>
                <li className="mb-2">Full name: Verdant Homestay</li>
                <li className="mb-2">Business Line: Kinh doanh nhà nghỉ</li>
                <li className="mb-2">Office year of operation: 2025</li>
                <li className="mb-2">Address: Hà nội</li>
                <li className="mb-2">Hotline: 0385682408</li>
                <li>Email: ngocmg.work@gmail.com</li>
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
