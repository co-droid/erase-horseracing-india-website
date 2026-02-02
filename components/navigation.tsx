"use client"

import Link from "next/link"
import { Menu, X, Twitter, Linkedin, Instagram } from "lucide-react"
import { useState } from "react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const socialLinks = [
    { icon: Twitter, href: "https://twitter.com/erasehorse", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 font-serif text-lg font-bold hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
              <svg className="w-6 h-6 text-primary" viewBox="0 0 200 200" fill="currentColor">
                <circle cx="100" cy="60" r="25" />
                <path d="M 100 85 L 90 120 L 80 140 M 100 85 L 110 120 L 120 140" />
              </svg>
            </div>
            <span className="hidden sm:inline">Erase Horseracing</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link href="/what-is-horseracing" className="text-sm font-medium hover:text-primary transition-colors">
              What Is Horseracing?
            </Link>
            <Link href="/killing-map" className="text-sm font-medium hover:text-primary transition-colors">
              Killing Map
            </Link>
            <Link href="/take-action" className="text-sm font-medium hover:text-primary transition-colors">
              Take Action
            </Link>
            <Link href="/updates" className="text-sm font-medium hover:text-primary transition-colors">
              Updates
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition-colors">
              Contact
            </Link>
            <Link href="/admin/login" className="text-sm font-medium hover:text-primary transition-colors">
              Admin
            </Link>

            {/* Desktop Social Icons */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t py-4 space-y-4">
            <Link
              href="/"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/what-is-horseracing"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              What Is Horseracing?
            </Link>
            <Link
              href="/killing-map"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Killing Map
            </Link>
            <Link
              href="/take-action"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Take Action
            </Link>
            <Link
              href="/updates"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Updates
            </Link>
            <Link
              href="/contact"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            <Link
              href="/admin/login"
              className="block py-2 text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>

            {/* Mobile Social Icons */}
            <div className="flex items-center gap-3 pt-4 border-t">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
