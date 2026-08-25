import React from 'react';
import { Mail, MessageCircle, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import InteractiveText from './InteractiveText';

export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      {/* Background Ambient Glow */}
      <div className="contact-ambient-glow"></div>

      <div className="contact-container">
        <div className="contact-layout-grid">
          {/* Left Column: Information & Interactive Contact Cards */}
          <div className="contact-left-col">
            <div className="contact-badge">
              <span className="badge-dot"></span>
              <span className="badge-text">LET'S CONNECT</span>
            </div>

            <h2 className="contact-title">
              <span className="contact-line-1 title-white">
                <InteractiveText text="START A CONVERSATION." smokeType="hero" />
              </span>
              <br />
              <span className="contact-line-2 title-crimson">
                <InteractiveText text="BUILD SOMETHING IMPACTFUL." isRed={true} smokeType="hero" />
              </span>
            </h2>

            <div className="contact-cards-stack">
              {/* Email */}
              <a href="mailto:haafizkassim786@gmail.com" className="contact-card email-card">
                <div className="contact-card-icon">
                  <Mail size={22} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">DIRECT EMAIL</span>
                  <span className="contact-card-value">haafizkassim786@gmail.com</span>
                </div>
                <ArrowUpRight className="contact-arrow" size={18} />
              </a>

              {/* Phone / WhatsApp */}
              <a href="tel:8610065701" className="contact-card phone-card">
                <div className="contact-card-icon">
                  <MessageCircle size={22} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">PHONE &amp; WHATSAPP</span>
                  <span className="contact-card-value">+91 86100 65701</span>
                </div>
                <ArrowUpRight className="contact-arrow" size={18} />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/mohamed-kassim-m-570780340/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card linkedin-card"
              >
                <div className="contact-card-icon">
                  <Linkedin size={22} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">LINKEDIN NETWORK</span>
                  <span className="contact-card-value">mohamed-kassim-m</span>
                </div>
                <ArrowUpRight className="contact-arrow" size={18} />
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/Mohamedkassim786"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card github-card"
              >
                <div className="contact-card-icon">
                  <Github size={22} />
                </div>
                <div className="contact-card-info">
                  <span className="contact-card-label">GITHUB CODEBASE</span>
                  <span className="contact-card-value">@Mohamedkassim786</span>
                </div>
                <ArrowUpRight className="contact-arrow" size={18} />
              </a>
            </div>
          </div>

          {/* Right Column: Standalone Portrait Photo */}
          <div className="contact-right-col">
            <div className="contact-photo-standalone">
              <div className="photo-ambient-halo"></div>
              <img
                src="/assets/final%20image%20phot.png"
                alt="Mohamed Kassim M"
                className="contact-photo-hero"
                loading="lazy"
              />
              <div className="photo-bottom-fade"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Mohamed Kassim M &middot; Built with Code &amp; AI</p>
        </footer>
      </div>
    </section>
  );
}
