"use client";

import { useState, useEffect } from "react";
import { Activity, AlertTriangle, Shield, Server, Network } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const THREAT_SIGNATURES = [
  { event: "Cobalt Strike Beacon HTTP (C2)", severity: "critical" },
  { event: "Log4Shell JNDI Injection Attempt", severity: "critical" },
  { event: "Kerberos TGS Request (Kerberoasting)", severity: "high" },
  { event: "Mimikatz LSASS Memory Access", severity: "critical" },
  { event: "AWS IAM Privilege Escalation", severity: "high" },
  { event: "Suspicious PowerShell Execution (B64)", severity: "high" },
  { event: "Nmap SYN Scan (Port 443)", severity: "medium" },
  { event: "SSH Brute Force Attempt", severity: "medium" },
  { event: "Suspicious RDP Login (Off-Hours)", severity: "medium" },
  { event: "SQL Injection (UNION SELECT)", severity: "high" },
  { event: "SMBv1 Connection Attempt", severity: "low" },
  { event: "Unauthorized DNS Zone Transfer", severity: "medium" },
  { event: "Malicious File Download (EICAR)", severity: "low" },
  { event: "Outbound C2 Traffic (Tor Exit Node)", severity: "critical" },
];

const INCIDENT_STAGES = [
  { status: "INVESTIGATING...", target: "Auth Server (10.0.0.5)", type: "Credential Stuffing", color: "text-soc-warning" },
  { status: "CONTAINED", target: "Auth Server (10.0.0.5)", type: "Credential Stuffing", color: "text-soc-success" },
  { status: "ANALYZING...", target: "HR Database (10.0.4.12)", type: "SQL Injection", color: "text-[#FF9800]" },
  { status: "ACTIVE BREACH", target: "DC-01 (10.0.0.2)", type: "Kerberoasting (T1558.003)", color: "text-soc-danger" },
  { status: "MITIGATING...", target: "DC-01 (10.0.0.2)", type: "Kerberoasting (T1558.003)", color: "text-[#FF9800]" }
];

const generatePublicIP = () => `${Math.floor(Math.random() * (200 - 8 + 1)) + 8}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;
const generateInternalIP = () => `10.0.${Math.floor(Math.random() * 20)}.${Math.floor(Math.random() * 254) + 1}`;

interface SocLog {
  id: number;
  time: string;
  src: string;
  dest: string;
  event: string;
  severity: string;
}

interface TrafficPoint {
  time: string;
  traffic: number;
  anomalies: number;
}

interface SocThreatDetail {
  id: number;
  srcIp: string;
  dstIp: string;
  type: string;
  severity: string;
}

export function SocLab() {
  const [logs, setLogs] = useState<SocLog[]>([]);
  const [trafficData, setTrafficData] = useState<TrafficPoint[]>([]);
  const [incidentStage, setIncidentStage] = useState(0);
  const [sensorStatus, setSensorStatus] = useState({ core: 'ONLINE', log: 'ONLINE', edge: 'ONLINE' });
  const [incidentId, setIncidentId] = useState("INC-2026-089");

  // Initial Data population
  useEffect(() => {
    const initialLogs = Array.from({ length: 8 }).map((_, i) => {
      const sig = THREAT_SIGNATURES[Math.floor(Math.random() * THREAT_SIGNATURES.length)];
      return {
        id: Date.now() - i * 1000,
        time: new Date(Date.now() - i * 5000).toLocaleTimeString('en-US', { hour12: false }),
        src: generatePublicIP(),
        dest: generateInternalIP(),
        event: sig.event,
        severity: sig.severity
      };
    });
    setLogs(initialLogs);

    const initialTraffic = Array.from({ length: 15 }).map((_, i) => {
      const baseTraffic = 300 + Math.random() * 400;
      return {
        time: new Date(Date.now() - (15 - i) * 60000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' }),
        traffic: Math.floor(baseTraffic),
        anomalies: Math.floor(baseTraffic * (Math.random() * 0.15))
      };
    });
    setTrafficData(initialTraffic);
  }, []);

  // Live Logs listener from Hero Map (SOC_COMMAND_CENTER_v2.1)
  useEffect(() => {
    const handleNewThreat = (e: Event) => {
      const attack = (e as CustomEvent<SocThreatDetail>).detail;
      const timeStr = new Date(attack.id).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });
      
      const newLog = {
        id: attack.id,
        time: timeStr,
        src: attack.srcIp,
        dest: attack.dstIp,
        event: attack.type,
        severity: attack.severity
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 8));
    };

    window.addEventListener('new_soc_threat', handleNewThreat);
    return () => window.removeEventListener('new_soc_threat', handleNewThreat);
  }, []);

  // Live Traffic Generator
  useEffect(() => {
    const trafficInterval = setInterval(() => {
      const baseTraffic = 300 + Math.random() * 500;
      // 10% chance for a massive spike
      const isSpike = Math.random() > 0.9;
      const trafficVal = isSpike ? baseTraffic * 2.5 : baseTraffic;
      const anomaliesVal = isSpike ? trafficVal * 0.4 : trafficVal * (Math.random() * 0.1);

      const newData = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit' }),
        traffic: Math.floor(trafficVal),
        anomalies: Math.floor(anomaliesVal)
      };

      setTrafficData(prev => [...prev.slice(1), newData]);
    }, 5000);

    return () => clearInterval(trafficInterval);
  }, []);

  // Incident Lifecycle & Sensor Status Jitter
  useEffect(() => {
    const statusInterval = setInterval(() => {
      // Cycle incident stage occasionally
      if (Math.random() > 0.6) {
        setIncidentStage(prev => {
          const next = (prev + 1) % INCIDENT_STAGES.length;
          if (next === 0) setIncidentId(`INC-${new Date().getFullYear()}-${Math.floor(Math.random() * 900) + 100}`);
          return next;
        });
      }

      // Jitter sensors
      setSensorStatus({
        core: Math.random() > 0.95 ? 'DEGRADED' : 'ONLINE',
        log: Math.random() > 0.98 ? 'SYNCING...' : 'ONLINE',
        edge: Math.random() > 0.85 ? 'LATENCY' : 'ONLINE'
      });
    }, 4500);

    return () => clearInterval(statusInterval);
  }, []);

  const currentIncident = INCIDENT_STAGES[incidentStage];

  return (
    <section id="soc-lab" className="py-20 relative bg-[#02040A]">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center space-x-4 mb-12">
          <Activity className="w-8 h-8 text-soc-success animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            <span className="text-soc-success">./</span>inside_my_soc
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main SIEM Chart */}
          <Card className="lg:col-span-8 bg-black/60 border-soc-secondary">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-white font-heading font-bold text-lg">Network Traffic Analysis</h3>
                  <p className="text-soc-success text-xs font-mono">Real-time packet inspection & anomaly detection</p>
                </div>
                <div className="flex space-x-2">
                  <span className="flex items-center text-[10px] font-mono text-soc-accent"><span className="w-2 h-2 rounded-full bg-soc-accent mr-1"></span> Normal</span>
                  <span className="flex items-center text-[10px] font-mono text-soc-danger"><span className="w-2 h-2 rounded-full bg-soc-danger mr-1"></span> Anomalous</span>
                </div>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4D6D" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF4D6D" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#333" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} />
                    <YAxis stroke="#333" tick={{fill: '#666', fontSize: 10, fontFamily: 'monospace'}} />
                    <Tooltip contentStyle={{backgroundColor: '#0F172A', border: '1px solid #1E293B', borderRadius: '4px'}} />
                    <Area type="monotone" dataKey="traffic" stroke="#00F5FF" fillOpacity={1} fill="url(#colorTraffic)" isAnimationActive={false} />
                    <Area type="monotone" dataKey="anomalies" stroke="#FF4D6D" fillOpacity={1} fill="url(#colorAnomalies)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-black/60 border-soc-secondary h-[185px] transition-colors duration-500">
              <CardContent className="p-6">
                <h3 className="text-white font-heading font-bold text-sm mb-4 border-b border-white/10 pb-2">Sensor Status</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-soc-success flex items-center"><Shield className="w-3 h-3 mr-2 text-soc-success"/> Core Firewall</span>
                    <span className={`text-xs font-mono ${sensorStatus.core === 'ONLINE' ? 'text-soc-success' : 'text-soc-danger animate-pulse'}`}>{sensorStatus.core}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-soc-success flex items-center"><Server className="w-3 h-3 mr-2 text-soc-success"/> Log Aggregator</span>
                    <span className={`text-xs font-mono ${sensorStatus.log === 'ONLINE' ? 'text-soc-success' : 'text-soc-warning animate-pulse'}`}>{sensorStatus.log}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-soc-success flex items-center"><Network className="w-3 h-3 mr-2 text-soc-warning"/> Edge IDS Node 3</span>
                    <span className={`text-xs font-mono ${sensorStatus.edge === 'ONLINE' ? 'text-soc-success' : 'text-soc-warning animate-pulse'}`}>{sensorStatus.edge}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-[#1a0a0c] h-[185px] relative overflow-hidden transition-all duration-500 ${currentIncident.status === 'ACTIVE BREACH' ? 'border-soc-danger border-2' : 'border-soc-danger/30'}`}>
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <AlertTriangle className="w-24 h-24" />
              </div>
              <CardContent className="p-6 relative z-10">
                <h3 className={`${currentIncident.status === 'CONTAINED' ? 'text-soc-success' : 'text-soc-danger'} font-heading font-bold text-sm mb-2 flex items-center`}>
                  <AlertTriangle className={`w-4 h-4 mr-2 ${currentIncident.status === 'ACTIVE BREACH' ? 'animate-ping' : ''}`} /> Active Incident
                </h3>
                <div className="text-white font-mono text-xs space-y-2 mt-4">
                  <p><span className="text-soc-success">ID:</span> {incidentId}</p>
                  <p><span className="text-soc-success">Type:</span> {currentIncident.type}</p>
                  <p><span className="text-soc-success">Target:</span> {currentIncident.target}</p>
                  <p><span className="text-soc-success">Status:</span> <span className={`${currentIncident.color} animate-pulse`}>{currentIncident.status}</span></p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Logs Stream */}
          <Card className="lg:col-span-12 bg-black/80 border-white/10 font-mono text-[10px] sm:text-xs">
            <CardContent className="p-0">
              <div className="bg-white/5 p-3 flex justify-between items-center border-b border-white/10">
                <span className="text-soc-accent uppercase tracking-widest flex items-center">
                  <span className="w-2 h-2 rounded-full bg-soc-accent animate-ping mr-2"></span>
                  Live Event Stream
                </span>
                <span className="text-soc-success">Rows: 8</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-soc-success border-b border-white/5 bg-white/5">
                      <th className="p-3 font-normal">TIME</th>
                      <th className="p-3 font-normal">SOURCE IP</th>
                      <th className="p-3 font-normal">DESTINATION IP</th>
                      <th className="p-3 font-normal">EVENT SIGNATURE</th>
                      <th className="p-3 font-normal">SEVERITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-3 text-soc-success">{log.time}</td>
                        <td className="p-3 text-white/80">{log.src}</td>
                        <td className="p-3 text-white/80">{log.dest}</td>
                        <td className="p-3 text-white">{log.event}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded border ${
                            log.severity === 'critical' ? 'bg-soc-danger/10 border-soc-danger/30 text-soc-danger' :
                            log.severity === 'high' ? 'bg-[#FF9800]/10 border-[#FF9800]/30 text-[#FF9800]' :
                            log.severity === 'medium' ? 'bg-soc-warning/10 border-soc-warning/30 text-soc-warning' :
                            'bg-soc-success/10 border-soc-success/30 text-soc-success'
                          }`}>
                            {log.severity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
