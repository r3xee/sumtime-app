import { MapPin, Mail, Phone, Instagram } from "lucide-react";
import { Link } from "react-router";

const contactData = [
  { icon: MapPin, title: "SMKN 8 Malang" },
  {
    icon: Phone,
    children: [
      "+62 818 0813 5357 (Aris)",
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
  { name: "Beranda", href: "/beranda" },
  { name: "Benefit", href: "/benefit" },
  { name: "Produk", href: "/produk" },
  { name: "Login", href: "/login" },
];

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-blue-50 to-white rounded-[60px]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-4">
              Hubungi Kami
            </h2>
            <div className="space-y-3">
              {contactData.map((item, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <item.icon className="text-gray-600 w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    {item.title && (
                      <p className="text-gray-700">{item.title}</p>
                    )}
                    {item.children &&
                      item.children.map((child, idx) => (
                        <p key={idx} className="text-gray-600">
                          {child}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-4">
              Navigasi
            </h2>
            <nav className="space-y-2">
              {navigationData.map((item, index) => (
                <div key={index}>
                  <Link
                    to={item.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 block"
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div>
            <h2 className="font-semibold text-lg text-gray-800 mb-4">
              Ikuti Kami
            </h2>

            <a
              href="https://instagram.com/dimsyumss"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 w-fit"
            >
              <Instagram className="w-5 h-5" />
              <span className="text-sm">@dimsyumss</span>
            </a>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-1">
              © 2025 Dimsyumss - Project KIK. All Rights Reserved
            </p>
            <p className="text-gray-500">Aris, Rossy, Yuni</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
