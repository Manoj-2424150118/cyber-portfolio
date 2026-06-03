import { Award, ExternalLink, CheckCircle } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";

export function Certifications() {
  const certifications = [
    {
      title: "Google Cybersecurity Professional Certificate",
      issuer: "Google",
      date: "2025",
      verified: true,
      credentialUrl: "https://www.coursera.org/account/accomplishments/specialization/0QQA98KOB70G",
      tags: ["Linux", "Python", "SQL", "SIEM"]
    },
    {
      title: "Digital Forensics Essentials",
      issuer: "EC-Council",
      date: "2023",
      verified: true,
      credentialUrl: "#",
      tags: ["Forensics", "Evidence Handling", "ID: 249776"]
    },
    {
      title: "Ethical Hacking Essentials",
      issuer: "EC-Council",
      date: "2023",
      verified: true,
      credentialUrl: "#",
      tags: ["Pen Testing", "Vulnerability Assessment", "ID: 235083"]
    },
    {
      title: "Python Certification",
      issuer: "Various",
      date: "2022",
      verified: true,
      credentialUrl: "https://drive.google.com/file/d/1KLXjpZk2y-QjtTZuk0YP3IaHiDj7auZi/view",
      tags: ["Scripting", "Automation"]
    }
  ];

  return (
    <div id="certifications" className="h-full relative glassmorphism rounded-2xl p-6 md:p-8 overflow-hidden flex flex-col">
      
      <div className="flex items-center space-x-4 mb-8">
        <Award className="w-8 h-8 text-soc-success" />
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
          <span className="text-soc-success">./</span>certifications
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Main Certifications List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-2">Active Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.map((cert, i) => (
                <Card key={i} className="hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-soc-accent group-hover:shadow-[0_0_15px_rgba(0,245,255,0.8)] transition-shadow"></div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/5 rounded-lg">
                        <Award className="w-6 h-6 text-soc-accent" />
                      </div>
                      {cert.verified && (
                        <span className="flex items-center text-soc-success text-xs font-mono bg-soc-success/10 px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </div>
                    {cert.credentialUrl !== '#' ? (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="block hover:underline hover:text-soc-accent transition-colors">
                        <h4 className="font-heading font-bold text-lg text-white leading-tight mb-2">{cert.title}</h4>
                      </a>
                    ) : (
                      <h4 className="font-heading font-bold text-lg text-white leading-tight mb-2">{cert.title}</h4>
                    )}
                    <p className="text-soc-success text-sm font-mono mb-4">{cert.issuer} • {cert.date}</p>
                    <div className="flex flex-wrap gap-2">
                      {cert.tags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-mono px-2 py-1 bg-white/5 border border-white/10 rounded text-white/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t border-white/5 mt-4">
                    <Button variant="ghost" className="w-full justify-between font-mono text-xs text-soc-warning hover:text-soc-warning/80 hover:bg-transparent px-2" asChild>
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                        Verify Credential <ExternalLink className="w-3 h-3 ml-2" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* LinkedIn & Featured Badges */}
          <div className="space-y-8">
            <h3 className="text-xl font-heading font-bold text-white mb-6 border-b border-white/10 pb-2">Professional Identity</h3>
            
            <Card className="bg-black/40 border-soc-accent/30 shadow-[0_0_20px_rgba(0,245,255,0.05)]">
              <CardContent className="p-6">
                <h4 className="font-mono text-sm text-soc-accent mb-4 uppercase tracking-wider flex items-center">
                  <span className="w-2 h-2 rounded-full bg-soc-accent animate-pulse mr-2"></span>
                  LinkedIn Live Integration
                </h4>
                
                <div className="bg-white rounded-lg p-4 flex justify-center min-h-[300px] items-center">
                  <div className="badge-base LI-profile-badge" data-locale="en_US" data-size="medium" data-theme="light" data-type="VERTICAL" data-vanity="manojkumarsharma-security" data-version="v1">
                    <a className="badge-base__link LI-simple-link" href="https://www.linkedin.com/in/manoj-sharma-secops?trk=profile-badge">
                      Manoj Kumar Sharma
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1C1C1C] border-[#1C1C1C]">
              <CardContent className="p-6 text-center">
                <h4 className="font-mono text-xs text-soc-success mb-4 uppercase tracking-wider">Featured Credly Badge</h4>
                <a href="https://www.credly.com/badges/674a29b1-0c22-419d-b6ff-cb7caa24b0e6/public_url" target="_blank" rel="noopener noreferrer" className="block w-48 h-48 mx-auto hover:scale-105 transition-transform duration-300">
                  <img src="/image-removebg-preview.png" alt="Google Cybersecurity Professional" className="w-full h-full object-contain" />
                </a>
              </CardContent>
            </Card>

          </div>
        </div>
    </div>
  );
}
