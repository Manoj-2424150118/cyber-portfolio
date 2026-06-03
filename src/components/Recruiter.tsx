import { CheckCircle2, UserCheck, MessageSquare, BrainCircuit, Search, Lock } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

export function Recruiter() {
  const qualities = [
    {
      icon: <Lock className="w-6 h-6 text-soc-accent" />,
      title: "Security Mindset",
      desc: "Always thinking like an attacker to build better defenses. Proactive threat hunting over reactive patching."
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-soc-success" />,
      title: "Communication Skills",
      desc: "Translating complex security vulnerabilities into actionable business risks for executive stakeholders."
    },
    {
      icon: <Search className="w-6 h-6 text-soc-warning" />,
      title: "Analytical & Detail-Oriented",
      desc: "Meticulous in log analysis and digital forensics, ensuring no stone is left unturned during an investigation."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-[#FF9800]" />,
      title: "Continuous Learning",
      desc: "Cybersecurity is a moving target. I stay updated with daily threat intelligence feeds and regular certifications."
    }
  ];

  return (
    <div id="recruiter" className="h-full relative glassmorphism rounded-2xl p-6 md:p-8 overflow-hidden flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-6 md:space-y-0">
        <div className="flex items-center space-x-4">
          <UserCheck className="w-8 h-8 text-soc-accent" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
            Why Hire Manoj?
          </h2>
        </div>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualities.map((q, i) => (
            <Card key={i} className="bg-soc-secondary/30 border-white/5 hover:border-white/20 transition-colors">
              <CardContent className="p-6">
                <div className="mb-4 p-3 bg-white/5 inline-block rounded-lg">
                  {q.icon}
                </div>
                <h3 className="font-heading font-bold text-white mb-2">{q.title}</h3>
                <p className="text-sm text-soc-success leading-relaxed">{q.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-soc-accent/5 border border-soc-accent/20 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8 max-w-2xl">
            <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center">
              <CheckCircle2 className="w-5 h-5 text-soc-accent mr-2" />
              Ready to Strengthen Your Security Posture?
            </h3>
            <p className="text-soc-success font-mono text-sm">
              I am actively looking for Security Analyst, SOC Analyst, Threat Analyst, or Junior Penetration Tester roles. Whether it&apos;s an immediate incident or long-term infrastructure hardening, I bring immediate value to the team.
            </p>
          </div>
          <div className="flex flex-col space-y-3 w-full md:w-auto">
            <Button className="w-full font-mono bg-soc-success text-black hover:bg-soc-success/90" asChild>
              <a href="https://drive.google.com/file/d/1UxYGrohOKvI8EpzXv-gib-EJeK3dBEEZ/view" target="_blank" rel="noopener noreferrer">
                Download Resume (PDF)
              </a>
            </Button>
            <Button variant="outline" className="w-full font-mono" asChild>
              <a href="https://www.linkedin.com/in/manoj-sharma-secops" target="_blank" rel="noopener noreferrer">
                View LinkedIn
              </a>
            </Button>
          </div>
        </div>
    </div>
  );
}
