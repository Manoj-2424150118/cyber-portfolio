"use client";

import { useState } from "react";
import { Send, MapPin, Mail, Calendar, Briefcase, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { InlineWidget } from "react-calendly";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 relative bg-black/60">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center space-x-4 mb-12">
          <Send className="w-8 h-8 text-soc-accent" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
            <span className="text-soc-success">./</span>secure_comm_channel
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Info & Calendly Placeholder */}
          <div className="space-y-8">
            <Card className="bg-soc-secondary/50 border-white/5">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-heading font-bold text-xl text-white mb-4">Direct Access</h3>
                
                <a href="mailto:sharmamanojkumar697@gmail.com" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-soc-accent transition-colors">
                    <Mail className="w-5 h-5 text-soc-success group-hover:text-soc-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-soc-success font-mono uppercase tracking-wider">Secure Email</p>
                    <p className="text-white font-medium group-hover:text-soc-accent transition-colors">sharmamanojkumar697@gmail.com</p>
                  </div>
                </a>

                <a href="https://www.linkedin.com/in/manoj-sharma-secops" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-[#0A66C2] transition-colors">
                    <Briefcase className="w-5 h-5 text-soc-success group-hover:text-[#0A66C2]" />
                  </div>
                  <div>
                    <p className="text-xs text-soc-success font-mono uppercase tracking-wider">Professional Network</p>
                    <p className="text-white font-medium group-hover:text-[#0A66C2] transition-colors">LinkedIn Profile</p>
                  </div>
                </a>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded bg-white/5 border border-white/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-soc-success" />
                  </div>
                  <div>
                    <p className="text-xs text-soc-success font-mono uppercase tracking-wider">Location Status</p>
                    <p className="text-white font-medium">Remote / Relocation Ready</p>
                  </div>
                </div>

              </CardContent>
            </Card>

            <Card className="bg-black border-soc-accent/20">
              <CardContent className="p-6 text-center">
                <Calendar className="w-8 h-8 text-soc-accent mx-auto mb-4" />
                <h3 className="font-heading font-bold text-lg text-white mb-2">Schedule a Technical Interview</h3>
                <p className="text-sm text-soc-success font-mono mb-6">Select a time that works for your team to discuss my portfolio and security mindset.</p>
                <div className="h-[500px] w-full rounded overflow-hidden bg-white/5 border border-white/10 relative">
                  {/* Overlay to ensure dark mode aesthetics match */}
                  <InlineWidget 
                    url="https://calendly.com/sharmamanojkumar697" 
                    styles={{ height: '100%', width: '100%' }}
                    pageSettings={{
                      backgroundColor: '02040A',
                      hideEventTypeDetails: false,
                      hideLandingPageDetails: false,
                      primaryColor: '00F5FF',
                      textColor: 'ffffff'
                    }}
                  />
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Contact Form */}
          <Card className="bg-soc-secondary/30 border-white/5 backdrop-blur-xl">
            <CardContent className="p-8">
              <h3 className="font-heading font-bold text-2xl text-white mb-2">Send an Encrypted Message</h3>
              <p className="text-sm text-soc-success font-mono mb-8">All fields are monitored and logged.</p>
              
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-xs text-soc-accent font-mono uppercase">Name / Organization</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-soc-accent focus:ring-1 focus:ring-soc-accent transition-all font-mono text-sm"
                    placeholder="John Doe"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-soc-accent font-mono uppercase">Return Address (Email)</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-soc-accent focus:ring-1 focus:ring-soc-accent transition-all font-mono text-sm"
                    placeholder="john@example.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs text-soc-accent font-mono uppercase">Payload (Message)</label>
                  <textarea 
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:outline-none focus:border-soc-accent focus:ring-1 focus:ring-soc-accent transition-all font-mono text-sm resize-none"
                    placeholder="Enter your message here..."
                    required
                    disabled={isSubmitting}
                  ></textarea>
                </div>
                
                {status === "error" && (
                  <p className="text-soc-danger text-xs font-mono">Transmission failed. Ensure SMTP is configured.</p>
                )}
                {status === "success" && (
                  <p className="text-soc-success text-xs font-mono flex items-center"><CheckCircle className="w-4 h-4 mr-2" /> Message Securely Sent</p>
                )}

                <Button 
                  disabled={isSubmitting || status === "success"}
                  className="w-full h-12 text-black bg-soc-accent hover:bg-soc-accent/90 shadow-[0_0_20px_rgba(0,245,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "TRANSMITTING..." : (
                    <>Transmit Data <Send className="w-4 h-4 ml-2" /></>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </section>
  );
}
