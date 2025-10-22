import { Map, Mail, Phone, Instagram } from "lucide-react";
import { Link } from "react-router";

const contactData = [
  { icon: Map, title: "SMKN 8 Malang" },
  {
    icon: Phone,
    children: [
      "+62 818 0813 5357 (Aris femboy)",
      "+62 813 3094 8915 (Rossy)",
      "+62 823 3167 6450 (Yuni)",
    ],
  },
  {
    icon: Mail,
    title: "dimsyums@gmail.com",
  },
];

const navigationData = [
  {
    name: "Beranda",
    href: "/beranda",
  },
  {
    name: "Benefit",
    href: "/benefit",
  },
  {
    name: "Produk",
    href: "/produk",
  },
  {
    name: "Login",
    href: "/login",
  },
];

const Footer = () => {
  return (
    <>
      <div className="bg-white w-full rounded-tr-3xl rounded-tl-3xl shadow-xl ">
        <div className="max-w-6xl px-3 mx-auto flex items-start justify-between pb-16">
          <div className="">
            <h1 className="font-bold text-2xl mb-2">Hubungi Kami</h1>
            {contactData.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <item.icon className="text-black w-5 h-5 mt-1" />
                <div>
                  {item.title && <p className="text-black">{item.title}</p>}

                  {item.children &&
                    item.children.map((child, idx) => (
                      <p key={idx} className="text-black">
                        {child}
                      </p>
                    ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-2">Navigasi</h1>
            {navigationData.map((item, index) => (
              <div key={index}>
                <Link to={item.href}>{item.name}</Link>
              </div>
            ))}
          </div>
          <div>
            <h1 className="font-bold text-2xl mb-2">Ikuti Kami</h1>
            <div className="flex items-center gap-2">
              <Instagram />
              <p className="text-black">@dimsyumss</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#AFDDFF] w-full">
        <div className="w-fit mx-auto py-3 text-center font-bold text-sm">
          <p>©2025 Dimsyumss - Project KIK. All Rights Reversed</p>
          <p>Aris, Rossy, Yuni</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
