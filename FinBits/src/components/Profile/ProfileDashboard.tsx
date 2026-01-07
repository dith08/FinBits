import React from 'react';


const ProfileDashboard: React.FC = () => {
  const skills: string[] = ['HTML', 'CSS', 'JS', 'React', 'Laravel'];

  return (
    <div className=" bg-black text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Section Main Skills */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Main Skills</h2>
          <div className="border border-zinc-800 rounded-xl p-6 flex flex-wrap gap-4">
            {skills.map((skill) => (
              <div 
                key={skill} 
                className="px-8 py-2 border-2 border-emerald-500 rounded-full text-sm font-bold tracking-wider hover:bg-emerald-500/10 transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Section Sub Skills */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-left">Sub Skills</h2>
          <div className="border border-zinc-800 rounded-xl p-6 flex flex-wrap gap-4">
            {skills.map((skill) => (
              <div 
                key={skill} 
                className="px-8 py-2 border-2 border-emerald-500 rounded-full text-sm font-bold tracking-wider hover:bg-emerald-500/10 transition-colors"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default ProfileDashboard;