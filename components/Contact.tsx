
import React, { useState } from 'react';
import { CheckCircle, ArrowRight, MapPin } from 'lucide-react';
import LiquidGlassCard from './LiquidGlassCard';
import GithubIcon from '../icons/github.svg';
import LinkedinIcon from '../icons/linkedin.svg';
import EnvelopeIcon from '../icons/envelope-solid.svg';

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'sushilpatel5113@gmail.com';

// SVG Icon Component
const SvgIcon: React.FC<{ src: string; size?: number }> = ({ src, size = 28 }) => (
  <img src={src} alt="" style={{ width: `${size}px`, height: `${size}px` }} className="brightness-0 invert" />
);

// Modern Input with Floating Label and Focus Ring
const ModernInput: React.FC<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & { label: string; isTextarea?: boolean }> = ({ 
  label, 
  id, 
  isTextarea = false, 
  ...props 
}) => {
  const baseClasses = "peer w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-slate-100 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-neon-green/50 focus:border-transparent focus:bg-white/10 transition-all duration-300 font-sans text-sm";
  const labelClasses = "absolute left-4 top-4 text-slate-400 text-sm transition-all duration-300 pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:bg-transparent peer-placeholder-shown:px-0 peer-focus:-top-3 peer-focus:text-xs peer-focus:text-neon-green bg-slate-950 px-1 rounded peer-focus:bg-slate-950 peer-focus:px-1";

  return (
    <div className="relative mt-2">
      {isTextarea ? (
        <textarea id={id} className={`${baseClasses} min-h-[150px] resize-none`} placeholder={label} {...props as any} />
      ) : (
        <input id={id} className={baseClasses} placeholder={label} {...props} />
      )}
      <label htmlFor={id} className={labelClasses}>
        {label}
      </label>
    </div>
  );
};

// Modern Social Button
const SocialButton: React.FC<{ iconSrc: string; label: string; href: string; color: string }> = ({ 
  iconSrc, label, href, color 
}) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className="group flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 md:hover:-translate-y-1 md:hover:shadow-lg"
  >
    <div className={`p-3 rounded-full bg-slate-900/50 text-slate-300 group-hover:text-white transition-colors md:group-hover:scale-110 duration-300`}>
      <SvgIcon src={iconSrc} size={28} />
    </div>
    <span className="text-xs font-medium text-slate-400 group-hover:text-neon-green transition-colors">{label}</span>
  </a>
);

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleInputChange = (
    field: keyof typeof formData,
  ) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === 'submitting') return;

    setFormState('submitting');

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim() || 'Portfolio Contact',
      message: formData.message.trim(),
    };

    const bodyLines = [
      'Hi Sushil,',
      '',
      trimmed.message || 'Dropping a quick hello from the portfolio site.',
      '',
      `— ${trimmed.name || 'Anonymous'} (${trimmed.email || 'no-email-provided'})`,
    ];

    const params = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: CONTACT_EMAIL,
      su: trimmed.subject,
      body: bodyLines.join('\n'),
    });

    const gmailUrl = `https://mail.google.com/mail/?${params.toString()}`;
    const popup = window.open(gmailUrl, '_blank', 'noopener,noreferrer');

    if (!popup) {
      const fallbackBody = encodeURIComponent(bodyLines.join('\n'));
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(trimmed.subject)}&body=${fallbackBody}`;
    }

    setFormState('success');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setFormState('idle'), 2500);
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Context & Socials */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-neon-green/20 rounded-full bg-neon-green/5 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-neon-green tracking-wide">Available for new projects</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                Let's work<br />together.
              </h2>
              
              <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                Building a new product or improving an existing one? I'm here to help turn your vision into a performant digital experience.
              </p>
            </div>

            <div className="space-y-4">
               <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Connect</h3>
              <div className="grid grid-cols-3 gap-4">
                <SocialButton iconSrc={EnvelopeIcon} label="Email" href={`mailto:${CONTACT_EMAIL}`} color="neon-green" />
                <SocialButton iconSrc={GithubIcon} label="GitHub" href="#" color="white" />
                <SocialButton iconSrc={LinkedinIcon} label="LinkedIn" href="#" color="blue" />
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-sm bg-white/5 p-4 rounded-xl border border-white/5 w-fit">
              <MapPin size={16} className="text-neon-purple" />
              <span>Based in Chhattisgarh, India • GMT+5:30</span>
            </div>
          </div>

          {/* Right Column: Modern Form */}
          <LiquidGlassCard className="p-1 rounded-3xl">
            <div className="bg-slate-900/60 p-6 md:p-8 rounded-[22px] backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                Send a message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ModernInput
                    id="name"
                    label="Name"
                    required
                    value={formData.name}
                    onChange={handleInputChange('name')}
                  />
                  <ModernInput
                    id="email"
                    type="email"
                    label="Email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                  />
                </div>
                
                <ModernInput
                  id="subject"
                  label="Subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange('subject')}
                />
                
                <ModernInput
                  id="message"
                  label="Message"
                  isTextarea
                  required
                  value={formData.message}
                  onChange={handleInputChange('message')}
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={formState !== 'idle'}
                    className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-neon-green to-emerald-500 p-[1px] focus:outline-none focus:ring-2 focus:ring-neon-green focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <div className="relative bg-slate-900 group-hover:bg-transparent transition-colors duration-300 rounded-[11px] px-8 py-4">
                      <div className="flex items-center justify-center gap-2 text-white font-medium">
                        {formState === 'idle' && (
                          <>
                            Send Message 
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                        {formState === 'submitting' && (
                          <><span className="animate-spin mr-2">⟳</span> Sending...</>
                        )}
                        {formState === 'success' && (
                          <>Sent Successfully <CheckCircle size={18} /></>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </LiquidGlassCard>

        </div>
      </div>
    </section>
  );
};

export default Contact;
