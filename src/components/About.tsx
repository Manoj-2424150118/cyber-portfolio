import { Terminal, GraduationCap, Briefcase, Target, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function About() {
  const timeline = [
    {
      year: "Present",
      title: "Security Analyst",
      href: "https://drive.google.com/drive/folders/1MBg7yPfnWE3tcTdfwDyLy_JNqgVUFihd",
      company: "Plasmid Innovation Ltd.",
      icon: <Briefcase className="w-5 h-5 text-soc-accent" />,
      desc: "Identifying vulnerabilities, assessing production systems, and escalating security incidents to fortify enterprise infrastructure."
    },
    {
      year: "2025",
      title: "Cybersecurity Certification",
      href: "https://www.coursera.org/account/accomplishments/specialization/0QQA98KOB70G",
      company: "Google",
      icon: <GraduationCap className="w-5 h-5 text-soc-success" />,
      desc: "Completed Google Cybersecurity Professional Certificate, mastering Linux, Python, SQL, and SIEM tools."
    },
    {
      year: "2022",
      title: "IT Foundations & Security",
      company: "Various Platforms",
      icon: <ShieldCheck className="w-5 h-5 text-soc-warning" />,
      desc: "Built foundational knowledge in network security, threat modeling, and incident response frameworks."
    }
  ];

  const coreValues = [
    "Proactive Defense",
    "Continuous Learning",
    "Analytical Rigor",
    "Clear Communication",
    "Ethical Hacking"
  ];

  return (
    <div id="about" className="h-full relative glassmorphism rounded-2xl p-6 md:p-8 overflow-hidden flex flex-col">
      <div className="flex items-center space-x-4 mb-8">
        <Terminal className="w-8 h-8 text-soc-accent" />
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
          <span className="text-soc-success">./</span>whoami
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow">
          
          {/* Mission & Profile */}
          <div className="lg:col-span-7 space-y-8">
            <div className="glassmorphism p-8 rounded-xl border-t-4 border-t-soc-accent relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck className="w-32 h-32 text-soc-accent" />
              </div>
              
              <h3 className="text-2xl font-heading font-bold text-white mb-4">Mission Statement</h3>
              <p className="text-soc-success font-mono text-sm leading-relaxed mb-6">
                I am a proactive Security Analyst who combines technical investigation, vulnerability assessment, digital forensics, and security monitoring to help organizations reduce risk and strengthen resilience. My goal is to stay one step ahead of threat actors by continuously hunting for vulnerabilities and implementing robust defense mechanisms.
              </p>
              
              <h3 className="text-xl font-heading font-bold text-white mb-4 mt-8">Core Values</h3>
              <div className="flex flex-wrap gap-3">
                {coreValues.map((value, i) => (
                  <span key={i} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 text-soc-accent font-mono text-xs flex items-center space-x-2">
                    <Target className="w-3 h-3" />
                    <span>{value}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-5">
            <h3 className="text-2xl font-heading font-bold text-white mb-8 flex items-center">
              <span className="text-soc-warning mr-2">{"{"}</span>
              Career Journey
              <span className="text-soc-warning ml-2">{"}"}</span>
            </h3>
            
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              {timeline.map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-soc-background bg-soc-secondary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:border-soc-accent/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-soc-accent font-mono text-xs font-bold">{item.year}</span>
                      </div>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-heading font-bold text-lg text-white hover:text-soc-accent hover:underline transition-colors block">{item.title}</a>
                      ) : (
                        <h4 className="font-heading font-bold text-lg text-white">{item.title}</h4>
                      )}
                      <h5 className="text-sm text-soc-success mb-2 font-mono">{item.company}</h5>
                      <p className="text-xs text-soc-success font-mono">{item.desc}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
  );
}
