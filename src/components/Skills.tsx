"use client";

import { Activity } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "./ui/card";

export function Skills() {
  const radarData1 = [
    { subject: 'Threat Detection', A: 90, fullMark: 100 },
    { subject: 'Incident Response', A: 85, fullMark: 100 },
    { subject: 'Vuln Assessment', A: 88, fullMark: 100 },
    { subject: 'Sec Monitoring', A: 92, fullMark: 100 },
    { subject: 'SOC Operations', A: 85, fullMark: 100 },
  ];

  const radarData2 = [
    { subject: 'Linux', A: 95, fullMark: 100 },
    { subject: 'Python', A: 80, fullMark: 100 },
    { subject: 'SQL', A: 85, fullMark: 100 },
    { subject: 'Cloud Security', A: 75, fullMark: 100 },
    { subject: 'Digital Forensics', A: 80, fullMark: 100 },
  ];

  const skillProgress = [
    { name: "OWASP Top 10", progress: 90 },
    { name: "Risk Assessment", progress: 85 },
    { name: "MITRE ATT&CK", progress: 88 },
    { name: "Threat Intelligence", progress: 82 },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload }: { active?: boolean, payload?: any }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-soc-secondary/90 border border-soc-accent p-2 rounded shadow-lg backdrop-blur-sm">
          <p className="text-soc-accent font-mono text-xs">{`${payload[0].payload.subject}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="skills" className="h-full relative glassmorphism rounded-2xl p-6 md:p-8 overflow-hidden flex flex-col">
      
      <div className="flex items-center space-x-4 mb-8">
        <Activity className="w-8 h-8 text-soc-accent" />
        <h2 className="text-2xl md:text-3xl font-heading font-bold text-white">
          <span className="text-soc-success">./</span>skills_matrix
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          
          {/* Radar Chart 1 */}
          <Card className="hover:shadow-[0_0_30px_rgba(0,245,255,0.1)] transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-bold text-white mb-6 border-b border-white/10 pb-2 flex justify-between">
                <span>Core Competencies</span>
                <span className="text-soc-accent text-xs font-mono bg-soc-accent/10 px-2 py-1 rounded">Radar Scan Active</span>
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData1}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar name="Skills" dataKey="A" stroke="#00F5FF" fill="#00F5FF" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Radar Chart 2 */}
          <Card className="hover:shadow-[0_0_30px_rgba(0,255,136,0.1)] transition-shadow">
            <CardContent className="p-6">
              <h3 className="text-lg font-heading font-bold text-white mb-6 border-b border-white/10 pb-2 flex justify-between">
                <span>Technical Stack</span>
                <span className="text-soc-success text-xs font-mono bg-soc-success/10 px-2 py-1 rounded">System Validated</span>
              </h3>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData2}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontFamily: 'monospace' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Radar name="Skills" dataKey="A" stroke="#00FF88" fill="#00FF88" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Progress Bars */}
          <Card className="lg:col-span-2">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-heading font-bold text-white mb-6 border-b border-white/10 pb-2">Frameworks & Standards</h3>
                <div className="space-y-6">
                  {skillProgress.map((skill, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-white">{skill.name}</span>
                        <span className="text-soc-accent">{skill.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-soc-accent rounded-full relative"
                          style={{ width: `${skill.progress}%` }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/50 blur-[2px]"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-8 p-3 bg-soc-warning/10 border border-soc-warning/30 rounded text-xs font-mono text-soc-warning flex items-center">
                <span className="w-2 h-2 rounded-full bg-soc-warning animate-pulse mr-2"></span>
                Continuous Learning Mode Engaged
              </div>
            </CardContent>
          </Card>

        </div>
    </div>
  );
}
