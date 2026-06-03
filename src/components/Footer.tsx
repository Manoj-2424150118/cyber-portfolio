import Link from "next/link";
import { Shield, Code, Briefcase, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-soc-background border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-soc-accent opacity-20 blur-[20px]"></div>
      
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group mb-6 inline-flex">
              <Shield className="w-8 h-8 text-soc-accent" />
              <span className="font-heading font-bold text-xl tracking-wider text-white">Manoj Kr. Sharma</span>
            </Link>
            <p className="text-soc-success mb-6 max-w-md font-mono text-sm">
              Defending digital infrastructure before threats become breaches. 
              Specializing in Vulnerability Assessment, Threat Detection, and Incident Response.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-soc-success hover:text-soc-accent hover:border-soc-accent hover:shadow-[0_0_10px_rgba(0,245,255,0.3)] transition-all">
                <Code size={20} />
              </a>
              <a href="https://www.linkedin.com/in/manoj-sharma-secops" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-soc-success hover:text-[#0A66C2] hover:border-[#0A66C2] hover:shadow-[0_0_10px_rgba(10,102,194,0.3)] transition-all">
                <Briefcase size={20} />
              </a>
              <a href="mailto:sharmamanojkumar697@gmail.com" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-soc-success hover:text-soc-success hover:border-soc-success hover:shadow-[0_0_10px_rgba(0,255,136,0.3)] transition-all">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3 font-mono text-sm">
              <li><Link href="#about" className="text-soc-success hover:text-soc-accent transition-colors">/about</Link></li>
              <li><Link href="#skills" className="text-soc-success hover:text-soc-accent transition-colors">/skills</Link></li>
              <li><Link href="#projects" className="text-soc-success hover:text-soc-accent transition-colors">/projects</Link></li>
              <li><Link href="#soc-lab" className="text-soc-success hover:text-soc-accent transition-colors">/soc-lab</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-heading font-semibold mb-6">Status</h4>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-soc-accent shrink-0 mt-0.5" />
                <span className="text-soc-success">Available for remote relocation opportunities.</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-success opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-soc-success"></span>
                </div>
                <span className="text-soc-success">Open to New Opportunities</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between font-mono text-xs text-soc-success">
          <p>© {new Date().getFullYear()} Manoj Kumar Sharma. All rights reserved.</p>
          <p className="mt-4 md:mt-0 flex items-center">
            Designed for <Shield className="w-3 h-3 mx-2 text-soc-accent" /> Security Teams
          </p>
        </div>
      </div>
    </footer>
  );
}
