import { Skill, Achievement } from "@/lib/types";

const frontendSkills: Skill[] = [
  { name: "React", level: 95, icon: "/pixel-icons/pixel-react.png" },
  { name: "JavaScript", level: 92, icon: "/pixel-icons/pixel-javascript.png" },
  { name: "TypeScript", level: 85, icon: "/pixel-icons/pixel-typescript.png" },
  { name: "Tailwind CSS", level: 88, icon: "/pixel-icons/pixel-tailwind.png" },
];

const backendSkills: Skill[] = [
  { name: "Node.js", level: 88, icon: "/pixel-icons/pixel-nodejs.png" },
  { name: "MongoDB", level: 80, icon: "/pixel-icons/pixel-mongodb.png" },
  { name: "PostgreSQL", level: 78, icon: "/pixel-icons/pixel-postgresql.png" },
  { name: "Firebase", level: 85, icon: "/pixel-icons/pixel-firebase.png" },
  { name: "Supabase", level: 80, icon: "/pixel-icons/pixel-supabase.png" },
];

const toolsSkills: Skill[] = [
  { name: "Git", level: 95, icon: "/pixel-icons/pixel-git.png" },
];

const achievements: Achievement[] = [
  {
    icon: "🏆",
    title: "CODE MASTER",
    description: "5+ Years Experience",
    color: "neon-green",
  },
  {
    icon: "🎯",
    title: "PROJECT HERO",
    description: "50+ Projects Completed",
    color: "hot-pink",
  },
  {
    icon: "⚡",
    title: "SPEED DEMON",
    description: "Lightning Fast Delivery",
    color: "pixel-orange",
  },
  {
    icon: "🎮",
    title: "PIXEL PERFECTIONIST",
    description: "Attention to Detail",
    color: "neon-green",
  },
];

function SkillCategory({ title, skills, borderColor }: { title: string; skills: Skill[]; borderColor: string }) {
  return (
    <div className={`bg-[var(--dark-navy)] p-6 rounded-lg border-2 border-[var(--${borderColor})]`}>
      <h3 className="font-pixel text-sm text-[var(--pixel-orange)] mb-6">{title}</h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-retro text-sm text-[var(--light-grey)]">{skill.name}</span>
              <span className={`font-pixel text-xs text-[var(--${borderColor})]`}>{skill.level}%</span>
            </div>
            <div className="w-full bg-[var(--darker-blue)] h-2 rounded">
              <div 
                className="skill-bar h-2 rounded"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="py-20 bg-[var(--darker-blue)] scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-pixel text-xl md:text-2xl text-[var(--neon-green)] mb-4">
            SKILLS
          </h2>
          <div className="font-retro text-lg text-[var(--light-grey)]">
            My technical abilities and experience levels
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[
            ...frontendSkills,
            ...backendSkills,
            ...toolsSkills,
          ].map((skill) => (
            <div
              key={skill.name}
              className="bg-[var(--dark-navy)] p-4 rounded-lg border-2 border-[var(--pixel-orange)] text-center flex flex-col items-center justify-center"
            >
              {skill.icon && (
                <img src={skill.icon} alt={skill.name} className="max-w-full h-auto mb-2" style={{ maxHeight: '48px' }} />
              )}
              <span className="font-retro text-sm text-[var(--light-grey)]">{skill.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <h3 className="font-pixel text-lg text-[var(--neon-green)] text-center mb-8">
            ACHIEVEMENTS UNLOCKED
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className={`bg-[var(--dark-navy)] p-4 rounded-lg border-2 border-[var(--${achievement.color})] text-center`}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className={`font-pixel text-xs text-[var(--${achievement.color})] mb-2`}>
                  {achievement.title}
                </div>
                <div className="font-retro text-sm text-[var(--light-grey)]">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
