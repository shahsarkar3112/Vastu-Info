
import React, { useState, useCallback, useMemo } from 'react';
import { Direction, ZoneState, RoomType } from './types';
import { DIRECTIONS_CONFIG, COLOR_SUGGESTIONS, VASTU_RULES } from './constants';
import ZoneCard from './components/ZoneCard';
import ColorPicker from './components/ColorPicker';
import Logo from './components/Logo';
import InfoSlider from './components/InfoSlider';
import { getVastuAnalysis, getZoneRemedy } from './services/gemini';

type ReportLanguage = 'English' | 'Hindi' | 'Marathi';

const INITIAL_ZONES: ZoneState[] = [
  { direction: 'NW', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'N', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'NE', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'W', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'C', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'E', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'SW', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'S', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
  { direction: 'SE', roomType: 'empty', wallColors: ['#ffffff', '#ffffff', '#ffffff', '#ffffff'] },
];

const App: React.FC = () => {
  const [zones, setZones] = useState<ZoneState[]>(INITIAL_ZONES);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showRemedy, setShowRemedy] = useState<string | null>(null);
  const [language, setLanguage] = useState<ReportLanguage>('English');

  const activeZone = activeIndex !== null ? zones[activeIndex] : null;

  const updateZone = useCallback((index: number, updates: Partial<ZoneState>) => {
    setZones(prev => prev.map((z, i) => i === index ? { ...z, ...updates } : z));
  }, []);

  const overallScore = useMemo(() => {
    let score = 50;
    zones.forEach(z => {
      const rule = VASTU_RULES[z.direction]?.[z.roomType];
      if (rule) score += rule.score;
    });
    return Math.min(Math.max(score, 0), 100);
  }, [zones]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const report = await getVastuAnalysis(zones, language);
    setAiReport(report);
    setIsAnalyzing(false);
  };

  const exportToWord = () => {
    if (!aiReport) {
      alert("Please generate the AI analysis report first before exporting.");
      return;
    }

    const formattedReport = aiReport
      .replace(/## (.*)/g, '<h2>$1</h2>')
      .replace(/### (.*)/g, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    const scoreColor = overallScore > 75 ? '#10b981' : overallScore > 40 ? '#f59e0b' : '#ef4444';

    const headerHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #6366f1; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #4f46e5; margin: 0;">VastuArchitect Pro - Scientific Audit</h1>
        <p style="color: #666;">Generated on: ${new Date().toLocaleDateString()} | Language: ${language}</p>
        <div style="margin-top: 15px; font-size: 18px; font-weight: bold;">
          Overall Vastu Compliance Score: <span style="color: ${scoreColor}; font-size: 24px;">${overallScore}%</span>
        </div>
      </div>
    `;

    const summaryTable = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-family: Arial, sans-serif;">
        <tr style="background-color: #f1f5f9;">
          <th style="border: 1px solid #ddd; padding: 8px;">Zone</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Room Type</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Vastu Status</th>
        </tr>
        ${zones.map(z => `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">${DIRECTIONS_CONFIG[z.direction].label}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${z.roomType.replace('_', ' ')}</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${VASTU_RULES[z.direction]?.[z.roomType]?.status || 'N/A'}</td>
          </tr>
        `).join('')}
      </table>
    `;

    const fullContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Vastu Audit Report</title>
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.6; }
          h2 { color: #312e81; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-top: 25px; }
          h3 { color: #4338ca; }
          strong { color: #1e1b4b; }
        </style>
      </head>
      <body>
        ${headerHtml}
        ${summaryTable}
        <div style="font-family: Arial, sans-serif;">
          ${formattedReport}
        </div>
        <hr/>
        <p style="font-size: 10px; color: #999; text-align: center;">VastuArchitect Pro - AI-Powered Architectural Logic</p>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', fullContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Vastu_Scientific_Audit_${language}_${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleQuickRemedy = async () => {
    if (!activeZone) return;
    setShowRemedy(`Generating ${language} remedies...`);
    const remedy = await getZoneRemedy(activeZone, language);
    setShowRemedy(remedy);
  };

  return (
    <div className="min-h-screen grid-pattern">
      <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight tracking-tight">VastuArchitect Pro</h1>
            <p className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase">Scientific Audit & Energy Balance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
            {(['English', 'Hindi', 'Marathi'] as ReportLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  language === lang ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
          
          <button 
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 active:scale-95"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            )}
            {isAnalyzing ? 'Auditing...' : 'Run Analysis'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          {/* Vastu Tips Slider */}
          <InfoSlider />

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Mandala Grid Layout</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-tighter">Energy Optimized</span>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Compliance</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${overallScore > 75 ? 'bg-emerald-500' : overallScore > 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${overallScore}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-black text-indigo-600 animate-pulse mb-1 tracking-[0.2em]">NORTH</span>
                <div className="w-6 h-6 border-2 border-indigo-600 rounded-full flex items-center justify-center">
                  <div className="w-1 h-3 bg-indigo-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {zones.map((zone, idx) => (
                <ZoneCard 
                  key={zone.direction} 
                  state={zone} 
                  isActive={activeIndex === idx}
                  onClick={() => setActiveIndex(idx)}
                  onChangeRoom={(type) => updateZone(idx, { roomType: type })}
                />
              ))}
            </div>
          </div>

          {aiReport && (
            <div className="mt-8 bg-white rounded-3xl p-8 shadow-md border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Scientific Vastu Audit</h3>
                    <p className="text-xs text-slate-500">Comprehensive report in {language}</p>
                  </div>
                </div>
                <button 
                  onClick={exportToWord}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-4 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                  Export (.doc)
                </button>
              </div>
              <div className="prose prose-indigo max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">
                {aiReport}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 sticky top-24">
            {activeZone ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{DIRECTIONS_CONFIG[activeZone.direction].label}</h3>
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">{DIRECTIONS_CONFIG[activeZone.direction].element} Zone</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center border border-indigo-100 text-indigo-600 font-bold">
                    {activeZone.direction}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleQuickRemedy}
                    className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors active:scale-95 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase">Quick Remedy</span>
                  </button>
                  <button onClick={exportToWord} className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 mb-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Save Audit</span>
                  </button>
                </div>

                {showRemedy && (
                  <div className="p-4 rounded-2xl bg-indigo-600 text-white text-xs font-medium relative animate-in zoom-in duration-300">
                    <button onClick={() => setShowRemedy(null)} className="absolute top-1 right-2 text-white/50 hover:text-white text-lg">×</button>
                    <div className="font-bold uppercase tracking-widest text-[8px] mb-1 text-indigo-200">AI Recommendation</div>
                    <div className="whitespace-pre-wrap">{showRemedy}</div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-100 pb-2">Wall Color Analysis</h4>
                  {['North', 'East', 'South', 'West'].map((wall, wIdx) => (
                    <ColorPicker
                      key={wall}
                      label={`${wall} Wall`}
                      selected={activeZone.wallColors[wIdx]}
                      direction={activeZone.direction}
                      options={COLOR_SUGGESTIONS[activeZone.direction]}
                      onSelect={(color) => {
                        const newColors = [...activeZone.wallColors];
                        newColors[wIdx] = color;
                        updateZone(activeIndex!, { wallColors: newColors });
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-slate-400 max-w-[200px] mx-auto">Select a zone from the Mandala to configure rooms and colors.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-300 mb-2">
           <Logo />
           <span className="font-bold text-xs uppercase tracking-[0.3em]">VastuArchitect Pro</span>
        </div>
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          Precision Architectural Logic • Multi-Language Support • Scientific Analysis
        </p>
      </footer>
    </div>
  );
};

export default App;
