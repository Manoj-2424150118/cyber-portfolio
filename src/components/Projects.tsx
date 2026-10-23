import { FolderGit2, ShieldAlert, ChevronRight, Bug, Terminal } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export function Projects() {
  const projects = [
    {
      title: "Secure Password Generator",
      role: "Security Engineer",
      threatModel: "CWE-338: Weak PRNG, Offline Dictionary Attacks (T1110.002)",
      tools: ["Python (secrets)", "PyCryptodome", "Argon2", "Tkinter"],
      methodology: "Engineered a deterministic CSPRNG architecture to bypass inherent native pseudo-random flaws, ensuring cryptographic uniform distribution.",
      findings: "Standard library PRNGs (e.g., random) lack sufficient entropy pools, allowing attackers to predict key generation states.",
      remediation: "Implemented OS-level secure randomness (urandom) with customizable character matrices to mathematically defeat brute-force limits.",
      outcome: "Generated passwords exceed NIST SP 800-63B entropy requirements (128+ bits).",
      severity: "HIGH",
      scoreLabel: "Risk Mitigated (CVSS)",
      riskScore: 8.1,
      mitre: ["T1110", "T1110.002", "CWE-338"],
      githubUrl: "https://github.com/Manoj-2424150118/SecurePasswordGenerator"
    },
    {
      title: "Deceptive-Net: Honey-Token Framework",
      role: "Security Researcher",
      threatModel: "Credential Dumping (T1003), Lateral Movement (T1210), Kerberoasting",
      tools: ["Python", "Active Directory (LDAP)", "Docker", "Splunk SIEM"],
      methodology: "Automated the generation and strategic scattering of high-fidelity decoy credentials into LSASS memory, SYSVOL, and cloud vaults.",
      findings: "Standard EDR heuristics often fail to detect passive memory-resident credential harvesting until the exfiltration phase.",
      remediation: "Deployed deceptive AWS IAM keys and AD Service Accounts that immediately trigger zero-false-positive beacons upon access.",
      outcome: "Reduced threat dwell time from average 21 days to < 5 minutes.",
      severity: "CRITICAL",
      scoreLabel: "Detection Fidelity",
      riskScore: 9.9,
      mitre: ["T1556", "T1078", "T1558.003"],
      githubUrl: "https://github.com/Manoj-2424150118/Deceptive-Net-A-Honey-Token-Generative-Framework"
    }
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center space-x-4 mb-12">
          <FolderGit2 className="w-8 h-8 text-soc-accent" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            <span className="text-soc-success">./</span>Projects
          </h2>
        </div>

        <div className="space-y-12">
          {projects.map((project, i) => (
            <Card key={i} className="overflow-hidden border-white/10 bg-black/40 backdrop-blur-xl group hover:border-soc-accent/50 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Left Side: Summary & Metrics */}
                <div className="lg:col-span-4 bg-soc-secondary/50 p-8 border-r border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Bug className={`w-5 h-5 ${project.severity === 'CRITICAL' ? 'text-soc-danger' : 'text-soc-warning'}`} />
                      <span className={`text-xs font-mono font-bold px-2 py-1 rounded bg-black/50 ${project.severity === 'CRITICAL' ? 'text-soc-danger' : 'text-soc-warning'}`}>
                        SEVERITY: {project.severity}
                      </span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-soc-accent font-mono text-sm mb-8">{project.role}</p>

                    <div className="space-y-6">
                      <div>
                        <p className="text-xs text-soc-success uppercase tracking-wider mb-1">{project.scoreLabel}</p>
                        <div className="flex items-end space-x-2">
                          <span className={`text-4xl font-mono font-bold ${project.severity === 'CRITICAL' ? 'text-soc-danger' : 'text-soc-warning'}`}>{project.riskScore}</span>
                          <span className="text-soc-success mb-1">/10</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-soc-success uppercase tracking-wider mb-2">MITRE ATT&CK</p>
                        <div className="flex flex-wrap gap-2">
                          {project.mitre.map(m => (
                            <span key={m} className="px-2 py-1 bg-white/5 border border-white/10 rounded font-mono text-xs text-white/70">{m}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-white/10">
                    <Button variant="outline" className="w-full font-mono text-xs group-hover:bg-soc-accent group-hover:text-black transition-all" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <FolderGit2 className="w-4 h-4 mr-2" /> View on GitHub
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Right Side: Technical Details */}
                <div className="lg:col-span-8 p-8 space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white mb-2 flex items-center">
                        <ShieldAlert className="w-4 h-4 mr-2 text-soc-success" /> Threat Model
                      </h4>
                      <p className="text-sm text-soc-success font-mono">{project.threatModel}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white mb-2 flex items-center">
                        <Terminal className="w-4 h-4 mr-2 text-soc-success" /> Tools Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tools.map(t => (
                          <span key={t} className="text-xs font-mono text-soc-accent">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <div>
                      <h4 className="text-sm font-heading font-bold text-white mb-1">Methodology</h4>
                      <p className="text-sm text-soc-success leading-relaxed">{project.methodology}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-soc-danger mb-1">Key Findings</h4>
                      <p className="text-sm text-soc-success leading-relaxed">{project.findings}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-heading font-bold text-soc-warning mb-1">Remediation Steps</h4>
                      <p className="text-sm text-soc-success leading-relaxed">{project.remediation}</p>
                    </div>
                    <div className="bg-soc-success/10 border border-soc-success/20 p-4 rounded-lg mt-4">
                      <h4 className="text-sm font-heading font-bold text-soc-success mb-1 flex items-center">
                        <ChevronRight className="w-4 h-4 mr-1" /> Business Outcome
                      </h4>
                      <p className="text-sm text-white/90 font-mono">{project.outcome}</p>
                    </div>
                  </div>

                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
