import React, { useEffect, useState } from 'react';

export default function BusWindowGraphic({ isPlaying, currentSong }) {
  // Equalizer bars animation when playing
  const [eqLevels, setEqLevels] = useState([
    14, 28, 42, 60, 32, 54, 76, 40, 22, 64, 48, 80, 35, 58, 70, 44, 25, 62, 50, 30, 68, 45, 20, 52
  ]);

  useEffect(() => {
    if (!isPlaying) {
      // Resting low equalizer heights
      setEqLevels([
        10, 16, 22, 14, 26, 18, 24, 16, 12, 20, 15, 25, 18, 22, 16, 12, 18, 24, 15, 12, 20, 16, 10, 14
      ]);
      return;
    }

    const interval = setInterval(() => {
      setEqLevels((prev) =>
        prev.map(() => Math.floor(Math.random() * 65) + 15)
      );
    }, 120);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full border-2 border-black bg-white flex flex-col select-none">
      {/* Top Header Strip */}
      <div className="bg-black text-white px-3 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span>CH-01: BUS_WINDOW.RAW</span>
        <span>44.1KHZ / 1-BIT</span>
      </div>

      {/* Screen Graphic Area */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] bg-white border-b-2 border-black overflow-hidden flex flex-col justify-between p-2">
        {/* Corner Dot Markers */}
        <span className="absolute top-1.5 left-2 text-[10px] font-mono leading-none select-none">•</span>
        <span className="absolute top-1.5 right-2 text-[10px] font-mono leading-none select-none">•</span>
        <span className="absolute bottom-6 left-2 text-[10px] font-mono leading-none select-none">•</span>
        <span className="absolute bottom-6 right-2 text-[10px] font-mono leading-none select-none">•</span>

        {/* SVG 1-Bit Vector Scene */}
        <svg
          viewBox="0 0 400 180"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Dither dot pattern for clouds & sky */}
            <pattern id="ditherDots" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1.5" height="1.5" fill="#000" />
            </pattern>
            {/* Fine checkered dither pattern for glass & reflections */}
            <pattern id="ditherGrid" width="3" height="3" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="1" height="1" fill="#000" />
              <rect x="1.5" y="1.5" width="1" height="1" fill="#000" />
            </pattern>
          </defs>

          {/* Dithered Cloud Band */}
          <rect x="30" y="18" width="180" height="24" fill="url(#ditherDots)" />
          <rect x="220" y="15" width="140" height="18" fill="url(#ditherDots)" />

          {/* Power / Telephone Lines stretching across horizon */}
          <line x1="0" y1="36" x2="400" y2="34" stroke="#000" strokeWidth="1" />
          <line x1="0" y1="46" x2="400" y2="44" stroke="#000" strokeWidth="1" />

          {/* Utility Pole 1 */}
          <line x1="100" y1="20" x2="100" y2="85" stroke="#000" strokeWidth="3" />
          <line x1="88" y1="28" x2="112" y2="28" stroke="#000" strokeWidth="2.5" />
          <line x1="90" y1="36" x2="110" y2="36" stroke="#000" strokeWidth="2" />
          <rect x="88" y="25" width="2" height="3" fill="#000" />
          <rect x="110" y="25" width="2" height="3" fill="#000" />

          {/* Utility Pole 2 */}
          <line x1="280" y1="22" x2="280" y2="85" stroke="#000" strokeWidth="3" />
          <line x1="268" y1="30" x2="292" y2="30" stroke="#000" strokeWidth="2.5" />
          <line x1="270" y1="38" x2="290" y2="38" stroke="#000" strokeWidth="2" />
          <rect x="268" y="27" width="2" height="3" fill="#000" />
          <rect x="290" y="27" width="2" height="3" fill="#000" />

          {/* City Skyline Silhouette */}
          <g fill="#000">
            {/* Buildings */}
            <rect x="40" y="55" width="18" height="30" />
            <rect x="62" y="48" width="22" height="37" />
            <rect x="115" y="42" width="25" height="43" />
            <rect x="145" y="52" width="16" height="33" />
            <rect x="165" y="46" width="30" height="39" />
            <rect x="200" y="54" width="22" height="31" />
            <rect x="235" y="50" width="28" height="35" />
            <rect x="300" y="55" width="18" height="30" />
            <rect x="322" y="45" width="32" height="40" />
            <rect x="358" y="52" width="24" height="33" />
          </g>

          {/* Highway Guardrail / Ground Line */}
          <rect x="0" y="84" width="400" height="4" fill="#000" />
          <line x1="0" y1="94" x2="400" y2="94" stroke="#000" strokeWidth="2" />

          {/* Bus Passenger Bench / Window Frame in Foreground */}
          <g>
            {/* Bench Top Surface */}
            <rect x="68" y="112" width="130" height="6" fill="#000" />
            {/* Bench Legs */}
            <rect x="76" y="118" width="6" height="26" fill="#000" />
            <rect x="184" y="118" width="6" height="26" fill="#000" />
          </g>

          {/* Diagonal Glass Reflection Sunbeams */}
          <polygon points="105,0 125,0 85,145 65,145" fill="url(#ditherGrid)" opacity="0.6" />
          <polygon points="135,0 150,0 115,145 100,145" fill="url(#ditherGrid)" opacity="0.4" />

          {/* Audio glyphs in bottom right: ♪ ■ ░░ ▒▒ */}
          <text x="245" y="132" fontFamily="monospace" fontSize="12" fill="#000">♪</text>
          <rect x="260" y="123" width="7" height="9" fill="#000" />
          <rect x="274" y="123" width="7" height="9" fill="url(#ditherDots)" />
          <rect x="288" y="123" width="7" height="9" fill="url(#ditherGrid)" />
        </svg>

        {/* Bottom Screen Caption Strip */}
        <div className="bg-black text-white px-3 py-1 flex items-center justify-between text-[11px] font-mono tracking-wider z-10">
          <span>LINE: 42 • {currentSong?.tapeFile || 'COMMUTE_TAPE.WAV'}</span>
          <span className="w-2.5 h-2.5 bg-white inline-block"></span>
        </div>
      </div>

      {/* Graphic Equalizer Strip */}
      <div className="w-full bg-white px-3 py-2 flex items-end justify-between gap-1 h-12 overflow-hidden border-b-2 border-black">
        {eqLevels.map((lvl, idx) => (
          <div
            key={idx}
            className="flex-1 bg-black transition-all duration-100 ease-out"
            style={{
              height: `${lvl}%`,
              minHeight: '4px',
              maxWidth: '8px'
            }}
          />
        ))}
      </div>
    </div>
  );
}
