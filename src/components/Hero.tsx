"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ShieldAlert, Crosshair, Download, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { WorldMap } from "./WorldMap";

interface ThreatItem {
  title: string;
  link: string;
  pubDate: string;
}

export function Hero() {
  const [typedText, setTypedText] = useState("");
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const fullText = "Defending Digital Infrastructure Before Threats Become Breaches.";

  useEffect(() => {
    // Fetch live threat feed from The Hacker News RSS
    const fetchThreats = async () => {
      try {
        const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.feedburner.com/TheHackersNews');
        if (res.ok) {
          const data = await res.json();
          setThreats(data.items.slice(0, 10)); // Top 10 latest threats
        }
      } catch (e) {
        console.error("Failed to fetch live threats", e);
      }
    };
    fetchThreats();
    
    // Typewriter effect
    let i = 0;
    const typeWriter = () => {
      if (i < fullText.length) {
        setTypedText(fullText.substring(0, i + 1));
        i++;
        setTimeout(typeWriter, 50);
      }
    };
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Copy & CTA */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center space-x-2 bg-soc-success/10 border border-soc-success/30 px-4 py-2 rounded-full backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-soc-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-soc-success"></span>
              </span>
              <span className="text-soc-success text-xs font-mono uppercase tracking-wider">System Online • Monitoring Active</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight min-h-[120px] md:min-h-[140px]">
                <span>{typedText}</span><span className="animate-pulse text-soc-accent">_</span>
              </h1>
              
              <div className="glassmorphism p-6 rounded-lg border-l-4 border-l-soc-accent max-w-xl">
                <p className="text-lg text-soc-success mb-4">
                  Security Analyst specializing in:
                </p>
                <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {['Vulnerability Assessment', 'Threat Detection', 'Incident Response', 'Security Monitoring', 'Cloud Security', 'Linux Security'].map((skill, i) => (
                    <li key={i} className="flex items-center space-x-2 text-white">
                      <Crosshair className="w-4 h-4 text-soc-accent" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="outline" size="lg" className="font-mono" asChild>
                <a href="https://drive.google.com/file/d/1UxYGrohOKvI8EpzXv-gib-EJeK3dBEEZ/view" target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Resume.pdf
                </a>
              </Button>
              <Button variant="terminal" size="lg" className="font-mono" asChild>
                <a href="#contact">
                  <Calendar className="mr-2 h-4 w-4" /> /schedule
                </a>
              </Button>
            </div>

            {/* Metrics Counter */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-white/10">
              {[
                { label: "Vulnerabilities Identified", val: "15+" },
                { label: "Systems Assessed", val: "10+" },
                { label: "Attack Surface Reduction", val: "40%" },
                { label: "Incidents Escalated", val: "3" }
              ].map((metric, i) => (
                <div key={i} className="space-y-1">
                  <h4 className="text-2xl font-bold text-soc-accent font-mono">{metric.val}</h4>
                  <p className="text-xs text-soc-success uppercase tracking-wider">{metric.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Animated SOC Dashboard Simulation */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center perspective-[1000px]"
          >
            {/* 3D Dashboard Card */}
            <div className="w-full max-w-lg glassmorphism rounded-xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,245,255,0.15)] transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700 ease-out">
              
              {/* Dashboard Header */}
              <div className="bg-black/40 border-b border-white/10 p-3 flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-soc-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-soc-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-soc-success"></div>
                </div>
                <div className="font-mono text-xs text-soc-success flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1 text-soc-danger animate-pulse" />
                  SOC_COMMAND_CENTER_v2.1
                </div>
              </div>

              {/* Dashboard Body */}
              <div className="p-4 space-y-4 bg-black/20">
                {/* Global Attack Map (Simulated Live Tracking) */}
                <div className="h-48 rounded border border-white/5 bg-black/40 relative overflow-hidden flex items-center justify-center">
                  <WorldMap />
                </div>

                {/* Live Threat Feed */}
                <div className="space-y-2">
                  <h3 className="text-xs font-mono text-soc-accent uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>Live Threat Feed</span>
                    {threats.length === 0 && <span className="text-soc-success animate-pulse text-[10px]">SYNCING...</span>}
                  </h3>
                  <div className="space-y-2 overflow-hidden h-28 relative">
                    {threats.length > 0 ? (
                      <motion.div 
                        animate={{ y: [0, -(threats.length * 30)] }}
                        transition={{ repeat: Infinity, duration: threats.length * 2, ease: "linear" }}
                        className="space-y-2"
                      >
                        {threats.map((threat, i) => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1">
                            <span className="text-yellow-400 w-12 flex-shrink-0">{new Date(threat.pubDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <a href={threat.link} target="_blank" rel="noopener noreferrer" className="text-soc-danger hover:text-soc-accent truncate mx-2 flex-grow hover:underline">
                              [{threat.title}]
                            </a>
                            <span className="text-white/50 w-16 text-right flex-shrink-0">GLOBAL</span>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <div className="space-y-2 opacity-50">
                        {[1,2,3,4].map(i => (
                          <div key={i} className="flex justify-between items-center text-[10px] font-mono border-b border-white/5 pb-1">
                            <span className="text-muted-foreground bg-white/10 w-10 h-3 rounded animate-pulse"></span>
                            <span className="bg-white/10 w-40 h-3 rounded animate-pulse mx-2"></span>
                            <span className="bg-white/10 w-12 h-3 rounded animate-pulse"></span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
