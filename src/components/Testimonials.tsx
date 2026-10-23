"use client";

import { useState, useEffect } from "react";
import { Star, User, Building2, Briefcase, Send, Loader2, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

interface Endorsement {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  createdAt: string;
}

export function Testimonials() {
  const [endorsements, setEndorsements] = useState<Endorsement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({ name: "", role: "", company: "", content: "", rating: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchEndorsements = async () => {
    try {
      const res = await fetch("/api/endorsements");
      if (res.ok) {
        const data = await res.json();
        setEndorsements(data);
      }
    } catch (error) {
      console.error("Error fetching endorsements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEndorsements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/endorsements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const newEndorsement = await res.json();
        setEndorsements([newEndorsement, ...endorsements]);
        setFormData({ name: "", role: "", company: "", content: "", rating: 5 });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error submitting endorsement:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const adminPass = window.prompt("Admin Authentication Required.\n\nPlease enter the secret key to delete this endorsement:");
    if (!adminPass) return; // User cancelled or entered blank

    try {
      const res = await fetch(`/api/endorsements?id=${id}`, { 
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${adminPass}`
        }
      });
      
      if (res.ok) {
        setEndorsements(endorsements.filter(e => e.id !== id));
        alert("Endorsement securely deleted.");
      } else {
        alert("Unauthorized: Incorrect Admin Key.");
      }
    } catch (error) {
      console.error("Error deleting endorsement:", error);
    }
  };

  return (
    <section id="endorsements" className="py-24 relative overflow-hidden z-10">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4">
            Professional <span className="text-soc-accent">Endorsements</span>
          </h2>
          <div className="w-24 h-1 bg-soc-accent mx-auto mb-6 shadow-[0_0_10px_rgba(0,245,255,0.5)]"></div>
          <p className="text-soc-success font-mono max-w-2xl mx-auto">
            Live Peer Review Feedback Network.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Submission Form */}
          <div className="lg:col-span-1">
            <div className="glassmorphism rounded-xl p-6 border border-white/10 sticky top-24">
              <h3 className="text-xl font-heading font-bold text-white mb-4 flex items-center">
                <Send className="w-5 h-5 mr-2 text-soc-accent" /> Leave an Endorsement
              </h3>
              
              {submitSuccess ? (
                <div className="bg-soc-success/20 border border-soc-success/50 p-4 rounded-lg text-center">
                  <p className="text-soc-success font-mono font-bold">Endorsement submitted successfully!</p>
                  <p className="text-soc-success/80 text-sm mt-2">Thank you for your feedback.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soc-success uppercase">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-soc-success/50" />
                      <input 
                        type="text" required
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-soc-accent focus:ring-1 focus:ring-soc-accent transition-all font-mono text-sm"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-soc-success uppercase">Role</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 w-4 h-4 text-soc-success/50" />
                        <input 
                          type="text" required
                          value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-soc-accent transition-all font-mono text-sm"
                          placeholder="CTO"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-soc-success uppercase">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 w-4 h-4 text-soc-success/50" />
                        <input 
                          type="text"
                          value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:border-soc-accent transition-all font-mono text-sm"
                          placeholder="Company Inc."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soc-success uppercase">Rating</label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star className={`w-5 h-5 ${formData.rating >= star ? 'text-soc-warning fill-soc-warning' : 'text-white/20'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono text-soc-success uppercase">Endorsement</label>
                    <textarea 
                      required rows={4}
                      value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-md py-2 px-4 text-white focus:outline-none focus:border-soc-accent transition-all font-mono text-sm resize-none"
                      placeholder="Share your experience working with Manoj..."
                    ></textarea>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full font-mono">
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    [ Submit Endorsement ]
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Endorsements List */}
          <div className="lg:col-span-2 space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-xl">
                <Loader2 className="w-8 h-8 text-soc-accent animate-spin" />
              </div>
            ) : endorsements.length === 0 ? (
              <div className="flex items-center justify-center h-64 border border-dashed border-white/10 rounded-xl bg-black/20">
                <p className="text-soc-success font-mono">No endorsements yet. Be the first to leave one!</p>
              </div>
            ) : (
              endorsements.map((review, index) => (
                <motion.div 
                  key={review.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glassmorphism p-6 rounded-xl border border-white/10 hover:border-soc-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-soc-secondary flex items-center justify-center border border-white/10 text-soc-accent font-bold text-xl">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-white font-bold">{review.name}</h4>
                        <p className="text-soc-success text-sm font-mono flex items-center">
                          {review.role} {review.company && <><span className="mx-2 text-white/20">|</span> {review.company}</>}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-soc-warning fill-soc-warning' : 'text-white/20'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 italic">&quot;{review.content}&quot;</p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs font-mono text-soc-success/50">
                    <div className="space-x-4">
                      <span>ID: {(review.id || 'TEMP').toString().substring(0, 8)}</span>
                      <span>{new Date(review.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>
                    {review.id && (
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="text-white/20 hover:text-soc-danger transition-colors"
                        title="Delete Endorsement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
