import { useState } from 'react';

export default function App() {
  const [copied, setCopied] = useState(false);

  const instructions = `# Drop notes.html into your repo root (next to eigen.html)
# Then link to it from eigen.html or any pillar page:
#
#   <a href="notes.html">the notes tablet ↗</a>
#
# That's it — single file, no build step, no dependencies.
# It uses the same CSS variables, localStorage, and aesthetic
# as the rest of the inn.visible site.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(instructions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-[#e8e4d8] font-mono flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 70} y1="0" x2={i * 70} y2="600" stroke="#58a36a" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 70} x2="800" y2={i * 70} stroke="#58a36a" strokeWidth="0.5" />
          ))}
          <path d="M200,600 Q200,200 400,150 Q600,200 600,600" fill="none" stroke="#58a36a" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_-10%,rgba(88,163,106,0.06),transparent_55%)]" />

      <div className="relative z-10 max-w-2xl w-full text-center">
        {/* Insignia */}
        <svg width="48" height="48" viewBox="0 0 56 56" fill="none" stroke="#58a36a" strokeWidth="3" className="mx-auto mb-6 opacity-60">
          <path d="M16 40 L24 16 L44 16 L36 40 Z"/>
          <line x1="10" y1="46" x2="44" y2="12"/>
          <path d="M44 12 l-8 1.5 M44 12 l-1.5 8"/>
        </svg>

        <h1 className="text-[#58a36a] text-sm tracking-[0.35em] mb-2">EIGEN DYNAMICS</h1>
        <p className="text-[#5c6875] text-xs tracking-widest mb-8">the notes tablet · ready to deploy</p>

        {/* The file card */}
        <div className="border border-[#223041] bg-[#0e141b] p-6 text-left mb-6">
          <div className="text-[#93a1b0] text-xs tracking-wider mb-3" style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>
            the file · notes.html
          </div>
          <div className="text-[#e8e4d8] text-xs leading-relaxed mb-4">
            A single self-contained HTML file — no build step, no dependencies.
            Uses the same CSS variables, localStorage, and aesthetic as your existing pages.
            Drop it next to <code className="text-[#58a36a]">eigen.html</code> and link to it.
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] tracking-wider">
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">write</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">auto-save</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">tags</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">search</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">sort ×4</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">pin</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">bulk select</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">export json</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">import json</span>
            <span className="border border-[#58a36a]/30 text-[#58a36a] px-2 py-1">ctrl+n</span>
          </div>
        </div>

        {/* How to add */}
        <div className="border border-[#223041] bg-[#0e141b] p-6 text-left mb-6">
          <div className="text-[#d9a83a] text-xs tracking-wider mb-3">how to add to your repo</div>
          <pre className="text-[#93a1b0] text-[11px] leading-relaxed whitespace-pre-wrap font-mono">
{`1. copy notes.html into your repo root
   (next to eigen.html, axiom.html, etc.)

2. git add notes.html
   git commit -m "eigen: add the notes tablet"
   git push

3. link to it from eigen.html:
   <a href="notes.html">the notes tablet ↗</a>

   — or add it to the footer nav

4. done. it lives in the glass with the rest.`}
          </pre>
        </div>

        {/* Quick link */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/notes.html"
            className="border border-[#58a36a] text-[#58a36a] text-[10px] tracking-[0.15em] px-5 py-2.5 hover:bg-[#58a36a] hover:text-[#0a0d12] transition-all duration-200 no-underline"
          >
            open the notes tablet ↗
          </a>
          <button
            onClick={handleCopy}
            className="border border-[#223041] text-[#93a1b0] text-[10px] tracking-[0.15em] px-5 py-2.5 hover:border-[#93a1b0] hover:text-[#e8e4d8] transition-all duration-200 bg-transparent cursor-pointer font-mono"
          >
            {copied ? '✓ copied' : 'copy instructions'}
          </button>
        </div>

        {/* Integration note */}
        <div className="mt-8 text-[#3a4a5c] text-[10px] tracking-wider leading-relaxed max-w-md mx-auto">
          the notes tablet uses <code className="text-[#5c6875]">localStorage</code> keyed as <code className="text-[#5c6875]">eigen_notes</code> ·
          nothing leaves the glass · same pattern as the shelf on eigen.html ·
          export/import json for portability
        </div>
      </div>
    </div>
  );
}
