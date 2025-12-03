import React, { useEffect, useRef, useState } from 'react';
import LiquidGlassCard from './LiquidGlassCard';
import { Icon } from '@iconify/react';
import { getSkills } from '../utils/dataManager';

interface Skill {
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
  barColor: string;
}

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const loadSkills = async () => {
      const storedSkills = await getSkills();
      if (storedSkills && storedSkills.length > 0) {
        setSkills(storedSkills);
      }
    };
    loadSkills();
  }, []);

  useEffect(() => {
    // Force visible on mobile to avoid intersection observer issues
    if (window.innerWidth < 768) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 relative overflow-hidden" ref={sectionRef}>
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-neon-blue/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 
            className={`font-pixel text-3xl md:text-4xl text-white mb-4 uppercase tracking-widest transition-all duration-700 ease-out transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
              Ability Matrix
            </span>
          </h2>
          <p 
            className={`font-mono text-slate-400 max-w-2xl mx-auto transition-all duration-700 delay-100 ease-out transform ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Technical proficiency and combat stats.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className={`transition-all duration-700 ease-out transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <LiquidGlassCard className="h-full p-6 group md:hover:-translate-y-2 transition-transform duration-300">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-slate-900/50 border border-slate-700/50 ${skill.color} md:group-hover:scale-110 transition-transform duration-300`}>
                      <Icon icon={skill.icon} width="24" height="24" />
                    </div>
                    <span className="font-mono text-xs text-slate-500 border border-slate-800 px-2 py-1 rounded-full bg-slate-900/30">
                      {skill.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-200 mb-1 group-hover:text-white transition-colors">
                    {skill.name}
                  </h3>
                  
                  <div className="mt-auto pt-4">
                    <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                      <span>Proficiency</span>
                      <span className={skill.color}>{skill.level}%</span>
                    </div>
                    <div className="h-2 bg-slate-900/50 rounded-full overflow-hidden border border-slate-800/50">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r from-slate-600 ${skill.barColor} relative overflow-hidden group-hover:animate-pulse`}
                        style={{ 
                          width: isVisible ? `${skill.level}%` : '0%',
                          transition: 'width 1.5s ease-out 0.5s'
                        }}
                      >
                        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </LiquidGlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;