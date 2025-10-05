import { Link, useLocation } from "react-router-dom";
import { Activity } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Diabetes", path: "/diabetes" },
    { name: "Parkinsons", path: "/parkinsons" },
    { name: "Heart Disease", path: "/heart-disease" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            <Activity className="h-6 w-6" />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Multiple Disease Predictor
            </span>
          </Link>
          
          <nav>
            <ul className="flex items-center gap-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-glow"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
