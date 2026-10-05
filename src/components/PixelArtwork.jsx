import React from 'react';

// Main Album Art for Now Playing screen: Sunset Drives with person on balcony
export function PixelSunsetArtwork({ isPlaying }) {
  return (
    <div className="w-full aspect-square relative rounded-xl border-2 border-black overflow-hidden bg-[#e87084] shadow-[2px_2px_0px_#000] select-none">
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full pixel-art"
        shapeRendering="crispEdges"
      >
        <defs>
          <linearGradient id="sunsetSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f3918a" />
            <stop offset="45%" stopColor="#e36e84" />
            <stop offset="80%" stopColor="#bb4470" />
            <stop offset="100%" stopColor="#7a2a5e" />
          </linearGradient>

          <style>{`
            @keyframes headGroove {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-2px) rotate(1.2deg); }
            }
            @keyframes noteDance1 {
              0% { transform: translate(0px, 0px) rotate(-10deg) scale(0.7); opacity: 0; }
              20% { opacity: 1; transform: translate(4px, -8px) rotate(12deg) scale(1.1); }
              50% { transform: translate(-3px, -18px) rotate(-14deg) scale(1.25); }
              80% { opacity: 0.85; transform: translate(5px, -28px) rotate(10deg) scale(1.05); }
              100% { transform: translate(-2px, -38px) rotate(-6deg) scale(0.7); opacity: 0; }
            }
            @keyframes noteDance2 {
              0% { transform: translate(0px, 0px) rotate(10deg) scale(0.6); opacity: 0; }
              25% { opacity: 1; transform: translate(-6px, -7px) rotate(-14deg) scale(1.15); }
              55% { transform: translate(4px, -19px) rotate(12deg) scale(1.2); }
              80% { opacity: 0.9; transform: translate(-5px, -29px) rotate(-10deg) scale(1); }
              100% { transform: translate(2px, -40px) rotate(8deg) scale(0.7); opacity: 0; }
            }
            @keyframes noteDance3 {
              0% { transform: translate(0px, 0px) rotate(-5deg) scale(0.5); opacity: 0; }
              30% { opacity: 1; transform: translate(7px, -10px) rotate(18deg) scale(1.2); }
              60% { transform: translate(-1px, -22px) rotate(-10deg) scale(1.1); }
              85% { opacity: 0.8; transform: translate(6px, -32px) rotate(12deg) scale(0.9); }
              100% { transform: translate(2px, -42px) rotate(-4deg) scale(0.6); opacity: 0; }
            }
            @keyframes noteDance4 {
              0% { transform: translate(0px, 0px) rotate(8deg) scale(0.5); opacity: 0; }
              25% { opacity: 1; transform: translate(-5px, -9px) rotate(-16deg) scale(1.15); }
              55% { transform: translate(3px, -20px) rotate(14deg) scale(1.1); }
              100% { transform: translate(-3px, -38px) rotate(-8deg) scale(0.6); opacity: 0; }
            }
            .head-dancing {
              animation: headGroove 0.9s ease-in-out infinite;
              transform-origin: 100px 125px;
            }
            .note-dance-1 {
              animation: noteDance1 2.2s cubic-bezier(0.3, 0, 0.2, 1) infinite;
              transform-origin: 126px 96px;
            }
            .note-dance-2 {
              animation: noteDance2 2.5s cubic-bezier(0.3, 0, 0.2, 1) infinite 0.7s;
              transform-origin: 70px 92px;
            }
            .note-dance-3 {
              animation: noteDance3 2.7s cubic-bezier(0.3, 0, 0.2, 1) infinite 1.3s;
              transform-origin: 138px 86px;
            }
            .note-dance-4 {
              animation: noteDance4 2.4s cubic-bezier(0.3, 0, 0.2, 1) infinite 1.8s;
              transform-origin: 60px 88px;
            }
          `}</style>
        </defs>

        {/* Sky Background */}
        <rect width="200" height="200" fill="url(#sunsetSky)" />

        {/* Distant Mountains / Low Clouds */}
        <polygon points="0,120 40,110 80,125 130,105 180,120 200,115 200,150 0,150" fill="#a43b67" />
        <polygon points="0,135 60,125 120,138 170,128 200,132 200,170 0,170" fill="#812759" />

        {/* Glowing Sunset Sun */}
        <circle cx="152" cy="62" r="14" fill="#fed6ba" />
        <circle cx="152" cy="62" r="17" fill="#fec2a8" opacity="0.4" />

        {/* Overhead Telegraph / Power Wires */}
        <line x1="0" y1="62" x2="200" y2="40" stroke="#311029" strokeWidth="1.5" />
        <line x1="0" y1="72" x2="200" y2="52" stroke="#311029" strokeWidth="1.5" />

        {/* City Skyline Silhouette */}
        <g fill="#5a1844">
          <rect x="6" y="52" width="16" height="110" />
          <rect x="10" y="42" width="6" height="12" />
          <rect x="26" y="80" width="14" height="80" />
          <rect x="42" y="92" width="12" height="70" />
          <rect x="75" y="70" width="16" height="90" />
          <rect x="80" y="60" width="5" height="10" />
          <rect x="105" y="76" width="15" height="85" />
          <rect x="135" y="86" width="18" height="75" />
          <rect x="165" y="68" width="16" height="92" />
          <rect x="170" y="58" width="4" height="10" />
        </g>

        {/* Pixel Windows glowing in buildings */}
        <g fill="#fed6ba">
          <rect x="10" y="60" width="2" height="2" />
          <rect x="14" y="66" width="2" height="2" />
          <rect x="10" y="74" width="2" height="2" />
          <rect x="30" y="90" width="2" height="2" />
          <rect x="34" y="96" width="2" height="2" />
          <rect x="80" y="80" width="2" height="2" />
          <rect x="84" y="88" width="2" height="2" />
          <rect x="140" y="94" width="2" height="2" />
          <rect x="170" y="82" width="2" height="2" />
          <rect x="174" y="90" width="2" height="2" />
        </g>

        {/* Balcony Railing */}
        <rect x="0" y="142" width="200" height="4" fill="#2d0b24" />
        <rect x="0" y="152" width="200" height="4" fill="#2d0b24" />
        {/* Balcony Vertical Slats */}
        {[10, 25, 40, 55, 70, 85, 100, 115, 130, 145, 160, 175, 190].map((x) => (
          <rect key={x} x={x} y="142" width="3" height="58" fill="#2d0b24" />
        ))}

        {/* Person Sitting on Balcony from behind */}
        <g>
          {/* Shoulders / Torso */}
          <rect x="68" y="126" width="64" height="74" rx="4" fill="#2d0b24" />
          <rect x="76" y="112" width="48" height="22" rx="4" fill="#2d0b24" />

          {/* Dancing / Bobbing Head & Headphones Group */}
          <g className={isPlaying ? 'head-dancing' : ''}>
            {/* Head */}
            <circle cx="100" cy="112" r="16" fill="#2d0b24" />

            {/* Headphones Band */}
            <path
              d="M 83 110 A 17 17 0 0 1 117 110"
              fill="none"
              stroke="#1c0717"
              strokeWidth="4"
            />

            {/* Left Headphone Ear Cup */}
            <rect x="80" y="105" width="8" height="15" rx="3" fill="#1c0717" />
            {/* Right Headphone Ear Cup */}
            <rect x="112" y="105" width="8" height="15" rx="3" fill="#1c0717" />
          </g>

          {/* Dancing Musical Notes floating and swaying while playing */}
          {isPlaying && (
            <g>
              {/* Note 1: Eighth Note dancing on the right */}
              <g className="note-dance-1">
                <text x="126" y="96" fill="#fed6ba" fontSize="13" fontWeight="bold" fontFamily="sans-serif">♪</text>
              </g>

              {/* Note 2: Beamed Note dancing on the left */}
              <g className="note-dance-2">
                <text x="68" y="92" fill="#ffd1bc" fontSize="12" fontWeight="bold" fontFamily="sans-serif">♫</text>
              </g>

              {/* Note 3: Double Note floating higher on the right */}
              <g className="note-dance-3">
                <text x="138" y="86" fill="#ffe4d6" fontSize="11" fontWeight="bold" fontFamily="sans-serif">♬</text>
              </g>

              {/* Note 4: Quarter note floating on the left */}
              <g className="note-dance-4">
                <text x="58" y="88" fill="#fed6ba" fontSize="11" fontWeight="bold" fontFamily="sans-serif">♩</text>
              </g>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
}

// Hero banner for Rooms Screen: Listen Together Better with 2 friends
export function PixelRoomsBanner() {
  return (
    <div className="w-full aspect-[2/1] relative rounded-xl border-2 border-black overflow-hidden bg-[#24133f] shadow-[2px_2px_0px_#000] select-none">
      <svg
        viewBox="0 0 300 150"
        className="w-full h-full pixel-art"
        shapeRendering="crispEdges"
      >
        <defs>
          <linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a0e2e" />
            <stop offset="50%" stopColor="#3d1d58" />
            <stop offset="85%" stopColor="#82316e" />
            <stop offset="100%" stopColor="#c35c82" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="300" height="150" fill="url(#nightSky)" />

        {/* Crescent Moon */}
        <path
          d="M 40 22 A 12 12 0 1 0 54 44 A 14 14 0 0 1 40 22 Z"
          fill="#ffdfa0"
        />

        {/* Pixel Stars */}
        <rect x="80" y="18" width="2" height="2" fill="#fff" />
        <rect x="110" y="28" width="2" height="2" fill="#fff" />
        <rect x="150" y="15" width="2.5" height="2.5" fill="#ffd599" />
        <rect x="180" y="32" width="2" height="2" fill="#fff" />
        <rect x="220" y="20" width="2" height="2" fill="#fff" />
        <rect x="250" y="35" width="2" height="2" fill="#ffdfa0" />

        {/* Sunset Glow on Horizon */}
        <polygon points="0,110 70,95 150,105 230,92 300,105 300,150 0,150" fill="#a8437a" />
        <polygon points="0,122 90,114 180,125 260,118 300,120 300,150 0,150" fill="#69225c" />

        {/* Distant City Skyline */}
        <g fill="#37103a">
          <rect x="15" y="85" width="14" height="65" />
          <rect x="35" y="95" width="10" height="55" />
          <rect x="55" y="75" width="18" height="75" />
          <rect x="62" y="66" width="4" height="9" />
          <rect x="85" y="90" width="16" height="60" />
          <rect x="110" y="82" width="20" height="68" />
          <rect x="145" y="92" width="12" height="58" />
          <rect x="175" y="78" width="18" height="72" />
          <rect x="182" y="69" width="4" height="9" />
          <rect x="210" y="88" width="14" height="62" />
          <rect x="240" y="80" width="22" height="70" />
          <rect x="275" y="92" width="15" height="58" />
        </g>

        {/* Windows Glowing */}
        <g fill="#ffdfa0">
          <rect x="20" y="94" width="2" height="2" />
          <rect x="24" y="104" width="2" height="2" />
          <rect x="60" y="84" width="2" height="2" />
          <rect x="64" y="92" width="2" height="2" />
          <rect x="116" y="90" width="2" height="2" />
          <rect x="180" y="86" width="2" height="2" />
          <rect x="246" y="90" width="2" height="2" />
          <rect x="250" y="98" width="2" height="2" />
        </g>

        {/* Balcony Railing */}
        <rect x="0" y="122" width="300" height="3" fill="#1b0820" />
        <rect x="0" y="130" width="300" height="3" fill="#1b0820" />
        {[15, 35, 55, 75, 95, 115, 135, 155, 175, 195, 215, 235, 255, 275, 295].map((x) => (
          <rect key={x} x={x} y="122" width="2.5" height="28" fill="#1b0820" />
        ))}

        {/* Two Friends Sitting on Rooftop Balcony with Headphones */}
        <g>
          {/* Friend 1 (Left) */}
          <rect x="105" y="110" width="34" height="40" rx="3" fill="#1b0820" />
          <circle cx="122" cy="100" r="10" fill="#1b0820" />
          <path d="M 112 99 A 10 10 0 0 1 132 99" fill="none" stroke="#0f0314" strokeWidth="2.5" />
          <rect x="110" y="96" width="4" height="8" rx="1.5" fill="#0f0314" />
          <rect x="130" y="96" width="4" height="8" rx="1.5" fill="#0f0314" />

          {/* Friend 2 (Right) */}
          <rect x="145" y="110" width="34" height="40" rx="3" fill="#1b0820" />
          <circle cx="162" cy="100" r="10" fill="#1b0820" />
          <path d="M 152 99 A 10 10 0 0 1 172 99" fill="none" stroke="#0f0314" strokeWidth="2.5" />
          <rect x="150" y="96" width="4" height="8" rx="1.5" fill="#0f0314" />
          <rect x="170" y="96" width="4" height="8" rx="1.5" fill="#0f0314" />
        </g>

        {/* Pixel Art Typography: Listen Together Better */}
        <g>
          <text
            x="150"
            y="48"
            fill="#ffffff"
            textAnchor="middle"
            fontSize="15"
            fontWeight="bold"
            fontFamily="'Pixelify Sans', cursive, sans-serif"
            letterSpacing="0.8"
            filter="drop-shadow(1px 1px 0px #000)"
          >
            Listen Together Better
          </text>
        </g>
      </svg>
    </div>
  );
}

// Pixel thumbnails for Library view
export function PixelThumbnail({ theme = 'sunset' }) {
  if (theme === 'moon') {
    return (
      <div className="w-11 h-11 rounded-lg border border-black overflow-hidden bg-[#24133f] shrink-0 select-none">
        <svg viewBox="0 0 40 40" className="w-full h-full pixel-art" shapeRendering="crispEdges">
          <rect width="40" height="40" fill="#1f1435" />
          <path d="M 12 8 A 7 7 0 1 0 20 22 A 8 8 0 0 1 12 8 Z" fill="#ffdfa0" />
          <rect x="28" y="10" width="1.5" height="1.5" fill="#fff" />
          <rect x="25" y="24" width="1.5" height="1.5" fill="#fff" />
          <polygon points="0,26 12,22 26,28 40,24 40,40 0,40" fill="#4d1d52" />
          <polygon points="0,32 15,29 28,34 40,31 40,40 0,40" fill="#2d0b2e" />
        </svg>
      </div>
    );
  }

  if (theme === 'city') {
    return (
      <div className="w-11 h-11 rounded-lg border border-black overflow-hidden bg-[#18233c] shrink-0 select-none">
        <svg viewBox="0 0 40 40" className="w-full h-full pixel-art" shapeRendering="crispEdges">
          <rect width="40" height="40" fill="#1a2744" />
          <rect x="4" y="16" width="7" height="24" fill="#0d1424" />
          <rect x="14" y="10" width="8" height="30" fill="#11192e" />
          <rect x="25" y="18" width="10" height="22" fill="#0a0f1c" />
          <rect x="16" y="13" width="1.5" height="1.5" fill="#f8e71c" />
          <rect x="19" y="18" width="1.5" height="1.5" fill="#f8e71c" />
          <rect x="6" y="22" width="1.5" height="1.5" fill="#50e3c2" />
          <rect x="28" y="22" width="1.5" height="1.5" fill="#f8e71c" />
        </svg>
      </div>
    );
  }

  // Default Sunset
  return (
    <div className="w-11 h-11 rounded-lg border border-black overflow-hidden bg-[#e87084] shrink-0 select-none">
      <svg viewBox="0 0 40 40" className="w-full h-full pixel-art" shapeRendering="crispEdges">
        <rect width="40" height="40" fill="#e87084" />
        <circle cx="28" cy="14" r="6" fill="#fed6ba" />
        <polygon points="0,22 10,18 22,24 32,20 40,22 40,40 0,40" fill="#8c2a5c" />
        <polygon points="0,28 14,25 26,30 40,26 40,40 0,40" fill="#4a1236" />
      </svg>
    </div>
  );
}
