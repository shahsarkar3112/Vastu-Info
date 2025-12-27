
import React, { useState, useEffect } from 'react';

const TIPS = [
  {
    title: "Balance the Elements",
    text: "Ensure all five elements (Earth, Water, Fire, Air, Space) are balanced in your home for peak energy.",
    color: "bg-indigo-50 border-indigo-100 text-indigo-800"
  },
  {
    title: "Light & Air Flow",
    text: "Vastu is a science of architecture. Maximize cross-ventilation and morning sunlight from the East.",
    color: "bg-orange-50 border-orange-100 text-orange-800"
  },
  {
    title: "Color Psychology",
    text: "Colors affect your subconscious. Soft Earth tones in South-West provide grounding and stability.",
    color: "bg-emerald-50 border-emerald-100 text-emerald-800"
  },
  {
    title: "The Brahmastan",
    text: "Keep the center of your house clutter-free to allow universal energy to circulate freely.",
    color: "bg-rose-50 border-rose-100 text-rose-800"
  }
];

const InfoSlider: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border mb-6 h-32 flex flex-col justify-center px-8 transition-all duration-700">
      {TIPS.map((tip, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 flex flex-col justify-center px-8 transition-all duration-1000 ${
            idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12 pointer-events-none'
          } ${tip.color}`}
        >
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Vastu Tip #{idx + 1}</span>
            <div className="flex gap-1">
              {TIPS.map((_, dotIdx) => (
                <div key={dotIdx} className={`w-1 h-1 rounded-full ${dotIdx === current ? 'bg-current' : 'bg-current/20'}`} />
              ))}
            </div>
          </div>
          <h4 className="font-bold text-lg leading-tight mt-1">{tip.title}</h4>
          <p className="text-sm opacity-80 line-clamp-2">{tip.text}</p>
        </div>
      ))}
    </div>
  );
};

export default InfoSlider;
