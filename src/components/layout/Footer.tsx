import { Link } from "react-router-dom";
import { Leaf, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">CropAI</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm">
              Empowering farmers with AI-driven insights for healthier crops and better yields. 
              Detect diseases early, predict harvests accurately.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/detect" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/predict" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Yield Prediction
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                  About the Models
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} CropAI. Built with AI for sustainable farming.</p>
        </div>
      </div>
    </footer>
  );
}