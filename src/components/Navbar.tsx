"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "SOC Lab", href: "#soc-lab" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-soc-background/80 backdrop-blur-md border-b border-white/10" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Shield className="w-8 h-8 text-soc-accent group-hover:text-soc-success transition-colors" />
            <div className="absolute inset-0 bg-soc-accent blur-[10px] opacity-50 group-hover:bg-soc-success transition-colors rounded-full -z-10"></div>
          </div>
          <span className="font-heading font-bold text-xl tracking-wider text-white">Manoj Kr. Sharma</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-mono text-soc-success hover:text-soc-accent transition-colors relative group"
            >
              <span className="text-soc-success/50 mr-1">/</span>
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-soc-accent transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
          <Button variant="outline" className="font-mono" asChild>
            <a href="#contact">
              [ Schedule Interview ]
            </a>
          </Button>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-soc-secondary/95 backdrop-blur-lg border-b border-white/10 p-4 md:hidden flex flex-col space-y-4 shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-lg font-mono text-white hover:text-soc-accent border-b border-white/5 pb-2"
              >
                <span className="text-soc-success mr-2">{'>'}</span>
                {link.name}
              </Link>
            ))}
            <Button variant="outline" className="w-full mt-4 font-mono" asChild>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>
                [ Schedule Interview ]
              </a>
            </Button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
