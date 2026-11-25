import React from 'react';

// Flat-vector editorial illustrations, one per curriculum part.
export function ChapterIllustration({ chapterNumber }: { chapterNumber: number }) {
  if (chapterNumber <= 2) {
    // Part I: AI fundamentals — a small neural network
    const layers = [
      [40, 75, 110],
      [55, 95],
      [40, 75, 110],
    ];
    const xs = [60, 110, 160];
    return (
      <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
        <rect x="14" y="14" width="192" height="122" rx="12" fill="#FDF7EE" stroke="#E8DEC9" strokeWidth="1.5" />
        {layers.slice(0, -1).map((ys, li) =>
          ys.map((y1) =>
            layers[li + 1].map((y2) => (
              <line key={`${li}-${y1}-${y2}`} x1={xs[li]} y1={y1} x2={xs[li + 1]} y2={y2} stroke="#1F2937" strokeOpacity="0.35" strokeWidth="1.3" />
            ))
          )
        )}
        {layers.map((ys, li) =>
          ys.map((y) => (
            <circle key={`${li}-${y}`} cx={xs[li]} cy={y} r="9" fill={li === 1 ? '#D94436' : '#FFFDF9'} stroke="#1F2937" strokeWidth="1.8" />
          ))
        )}
        <text x="186" y="80" textAnchor="middle" fill="#1F2937" fontSize="9" fontWeight="700" fontFamily="monospace">
          next
        </text>
        <text x="186" y="92" textAnchor="middle" fill="#D94436" fontSize="9" fontWeight="700" fontFamily="monospace">
          token
        </text>
      </svg>
    );
  }
  if (chapterNumber <= 5) {
    // Part II: agent core loop
    return (
      <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
        <rect x="14" y="14" width="192" height="122" rx="12" fill="#FDF2F0" stroke="#E5DFD3" strokeWidth="1.5" />
        <circle cx="110" cy="75" r="34" stroke="#D94436" strokeWidth="2.5" strokeDasharray="6 4" />
        <rect x="82" y="55" width="56" height="40" rx="8" fill="#1F2937" />
        <text x="110" y="79" textAnchor="middle" fill="#FAF5E8" fontSize="11" fontWeight="700" fontFamily="monospace">AGENT</text>
        <circle cx="48" cy="48" r="13" fill="#FFFDF9" stroke="#1F2937" strokeWidth="2" />
        <circle cx="172" cy="48" r="13" fill="#FFFDF9" stroke="#D94436" strokeWidth="2" />
        <circle cx="172" cy="102" r="13" fill="#FFFDF9" stroke="#0D9488" strokeWidth="2" />
        <circle cx="48" cy="102" r="13" fill="#FFFDF9" stroke="#D97706" strokeWidth="2" />
        <path d="M61 52 L82 65 M159 52 L138 65 M159 98 L138 85 M61 98 L82 85" stroke="#1F2937" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }
  if (chapterNumber <= 10) {
    // Part III: models, routers, training & frameworks
    return (
      <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
        <rect x="14" y="14" width="192" height="122" rx="12" fill="#F4FBF9" stroke="#D7EBE6" strokeWidth="1.5" />
        <rect x="30" y="52" width="56" height="46" rx="8" fill="#1F2937" />
        <text x="58" y="79" textAnchor="middle" fill="#FFFDF9" fontSize="10" fontWeight="700" fontFamily="monospace">ROUTER</text>
        <path d="M86 75 H122 M122 44 H142 M122 75 H142 M122 106 H142 M122 44 V106" stroke="#D94436" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="142" y="32" width="46" height="24" rx="5" fill="#FFFDF9" stroke="#1F2937" strokeWidth="1.8" />
        <rect x="142" y="63" width="46" height="24" rx="5" fill="#D94436" />
        <rect x="142" y="94" width="46" height="24" rx="5" fill="#FFFDF9" stroke="#0D9488" strokeWidth="1.8" />
        <text x="165" y="48" textAnchor="middle" fill="#1F2937" fontSize="8.5" fontWeight="700" fontFamily="monospace">SLM</text>
        <text x="165" y="79" textAnchor="middle" fill="#FFFDF9" fontSize="8.5" fontWeight="700" fontFamily="monospace">PRO</text>
        <text x="165" y="110" textAnchor="middle" fill="#0D9488" fontSize="8.5" fontWeight="700" fontFamily="monospace">OPEN</text>
      </svg>
    );
  }
  if (chapterNumber <= 13) {
    // Part IV: multi-agent, A2A & cloud
    return (
      <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
        <rect x="14" y="14" width="192" height="122" rx="12" fill="#FDF7EE" stroke="#E8DEC9" strokeWidth="1.5" />
        <path d="M110 48 L58 102 M110 48 L110 102 M110 48 L162 102" stroke="#1F2937" strokeWidth="2" strokeDasharray="4 3" />
        <rect x="78" y="28" width="64" height="28" rx="7" fill="#D94436" />
        <text x="110" y="46" textAnchor="middle" fill="#FFFDF9" fontSize="9.5" fontWeight="700" fontFamily="monospace">ORCH</text>
        <rect x="34" y="96" width="48" height="26" rx="6" fill="#1F2937" />
        <rect x="86" y="96" width="48" height="26" rx="6" fill="#0D9488" />
        <rect x="138" y="96" width="48" height="26" rx="6" fill="#1F2937" />
        <text x="58" y="112" textAnchor="middle" fill="#FFFDF9" fontSize="8.5" fontFamily="monospace">A1</text>
        <text x="110" y="112" textAnchor="middle" fill="#FFFDF9" fontSize="8.5" fontFamily="monospace">A2A</text>
        <text x="162" y="112" textAnchor="middle" fill="#FFFDF9" fontSize="8.5" fontFamily="monospace">A3</text>
      </svg>
    );
  }
  if (chapterNumber <= 17) {
    // Part V: production shield
    return (
      <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
        <rect x="14" y="14" width="192" height="122" rx="12" fill="#F7F5F0" stroke="#E5DFD3" strokeWidth="1.5" />
        <path d="M110 26 L156 44 V78 C156 104 134 118 110 126 C86 118 64 104 64 78 V44 L110 26Z" fill="#FFFDF9" stroke="#1F2937" strokeWidth="2.2" />
        <path d="M92 75 L105 88 L131 60" stroke="#D94436" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // Part VI: real world, papers, interviews & quiz
  return (
    <svg viewBox="0 0 220 150" fill="none" className="w-full max-w-[220px] select-none">
      <rect x="14" y="14" width="192" height="122" rx="12" fill="#FDF2F0" stroke="#F0D4D0" strokeWidth="1.5" />
      <rect x="48" y="30" width="124" height="90" rx="8" fill="#FFFDF9" stroke="#1F2937" strokeWidth="2" />
      <path d="M66 54 H154 M66 72 H138 M66 90 H148" stroke="#1F2937" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="152" cy="100" r="14" fill="#D94436" />
      <path d="M146 100 L150 104 L158 96" stroke="#FFFDF9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
