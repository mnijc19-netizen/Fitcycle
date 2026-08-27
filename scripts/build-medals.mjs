import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const medalsDir = path.join(__dirname, '..', 'public', 'themes', 'medals');
if (!fs.existsSync(medalsDir)) {
  fs.mkdirSync(medalsDir, { recursive: true });
}

const svgs = {
  // 7 Tier Ladder Badges
  'rank-tier-1.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#CA8A04" stop-opacity="0.5"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="bp1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#D97706"/><stop offset="40%" stop-color="#92400E"/><stop offset="80%" stop-color="#78350F"/><stop offset="100%" stop-color="#451A03"/></linearGradient>
    <linearGradient id="it1" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#1E293B"/><stop offset="50%" stop-color="#475569"/><stop offset="100%" stop-color="#94A3B8"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg1)"/>
  <polygon points="60,14 96,28 88,82 60,108 32,82 24,28" fill="#18181B" stroke="url(#it1)" stroke-width="3" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.8))"/>
  <polygon points="60,20 90,32 82,78 60,100 38,78 30,32" fill="url(#bp1)" stroke="#B45309" stroke-width="1.5"/>
  <path d="M 44,48 L 60,62 L 76,48" fill="none" stroke="#FEF08A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M 44,62 L 60,76 L 76,62" fill="none" stroke="#FEF08A" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  <polygon points="60,30 63,38 71,39 65,45 67,53 60,49 53,53 55,45 49,39 57,38" fill="#FDE047"/>
</svg>`,

  'rank-tier-2.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#94A3B8" stop-opacity="0.6"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="sp2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#CBD5E1"/><stop offset="50%" stop-color="#64748B"/><stop offset="100%" stop-color="#1E293B"/></linearGradient>
    <linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FDE047"/><stop offset="50%" stop-color="#D97706"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg2)"/>
  <line x1="28" y1="28" x2="92" y2="92" stroke="url(#sp2)" stroke-width="5" stroke-linecap="round"/>
  <line x1="28" y1="92" x2="92" y2="28" stroke="url(#sp2)" stroke-width="5" stroke-linecap="round"/>
  <polygon points="60,16 94,34 94,80 60,104 26,80 26,34" fill="#0F172A" stroke="url(#bg2)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"/>
  <polygon points="60,24 86,38 86,74 60,94 34,74 34,38" fill="url(#sp2)" stroke="#E2E8F0" stroke-width="1.5"/>
  <path d="M 60,34 L 72,50 L 60,78 L 48,50 Z" fill="#090D16" stroke="url(#bg2)" stroke-width="2"/>
  <circle cx="60" cy="56" r="6" fill="url(#bg2)"/>
</svg>`,

  'rank-tier-3.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg3" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.7"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="sp3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFFFF"/><stop offset="30%" stop-color="#E2E8F0"/><stop offset="70%" stop-color="#94A3B8"/><stop offset="100%" stop-color="#334155"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg3)"/>
  <path d="M 60,20 L 76,40 L 102,42 L 82,64 L 88,94 L 60,80 L 32,94 L 38,64 L 18,42 L 44,40 Z" fill="#0F172A" stroke="url(#sp3)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"/>
  <path d="M 60,28 L 72,44 L 92,46 L 76,64 L 82,86 L 60,74 L 38,86 L 44,64 L 28,46 L 48,44 Z" fill="url(#sp3)"/>
  <polygon points="60,40 68,54 60,68 52,54" fill="#090D16" stroke="#FFF" stroke-width="1.5"/>
  <circle cx="60" cy="54" r="3.5" fill="#38BDF8"/>
</svg>`,

  'rank-tier-4.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg4" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FDE047" stop-opacity="0.8"/><stop offset="60%" stop-color="#CA8A04" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="gp4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="35%" stop-color="#EAB308"/><stop offset="70%" stop-color="#CA8A04"/><stop offset="100%" stop-color="#854D0E"/></linearGradient>
    <linearGradient id="mr4" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" stop-color="#451A03"/><stop offset="50%" stop-color="#D97706"/><stop offset="100%" stop-color="#FEF08A"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg4)"/>
  <polygon points="60,10 95,25 108,60 95,95 60,110 25,95 12,60 25,25" fill="#18181B" stroke="url(#mr4)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"/>
  <path d="M 30,75 C 24,55 35,32 60,25 C 85,32 96,55 90,75 C 80,95 60,100 60,100 C 60,100 40,95 30,75 Z" fill="none" stroke="url(#gp4)" stroke-width="4" stroke-linecap="round"/>
  <polygon points="60,35 66,50 82,52 70,63 74,79 60,70 46,79 50,63 38,52 54,50" fill="url(#gp4)" stroke="#78350F" stroke-width="1.5" filter="drop-shadow(0 2px 6px rgba(234,179,8,0.7))"/>
  <polygon points="60,48 68,58 60,68 52,58" fill="#FFFBEB" stroke="#CA8A04" stroke-width="1"/>
</svg>`,

  'rank-tier-5.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg5" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9"/><stop offset="60%" stop-color="#0284C7" stop-opacity="0.3"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="sp5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#BAE6FD"/><stop offset="30%" stop-color="#38BDF8"/><stop offset="70%" stop-color="#0284C7"/><stop offset="100%" stop-color="#0C4A6E"/></linearGradient>
    <linearGradient id="tr5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#F8FAFC"/><stop offset="50%" stop-color="#94A3B8"/><stop offset="100%" stop-color="#334155"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg5)"/>
  <polygon points="60,8 104,32 104,88 60,112 16,88 16,32" fill="#080C14" stroke="url(#tr5)" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(56,189,248,0.5))"/>
  <polygon points="60,18 94,38 94,82 60,102 26,82 26,38" fill="none" stroke="url(#sp5)" stroke-width="2" stroke-dasharray="6 3"/>
  <polygon points="60,28 84,42 84,78 60,92 36,78 36,42" fill="url(#sp5)" stroke="#BAE6FD" stroke-width="1.5"/>
  <polygon points="60,40 76,60 60,80 44,60" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.5" filter="drop-shadow(0 0 8px #FFF)"/>
</svg>`,

  'rank-tier-6.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg6" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F97316" stop-opacity="0.9"/><stop offset="50%" stop-color="#DC2626" stop-opacity="0.5"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="mf6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="30%" stop-color="#F97316"/><stop offset="70%" stop-color="#DC2626"/><stop offset="100%" stop-color="#7F1D1D"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#rg6)"/>
  <path d="M 60,12 C 80,30 106,36 106,64 C 106,94 85,110 60,110 C 35,110 14,94 14,64 C 14,36 40,30 60,12 Z" fill="#090D16" stroke="url(#mf6)" stroke-width="3" filter="drop-shadow(0 4px 14px rgba(249,115,22,0.7))"/>
  <path d="M 60,22 C 74,38 94,44 94,66 C 94,88 78,98 60,98 C 42,98 26,88 26,66 C 26,44 46,38 60,22 Z" fill="url(#mf6)"/>
  <path d="M 60,40 C 68,52 78,58 78,72 C 78,84 70,90 60,90 C 50,90 42,84 42,72 C 42,58 52,52 60,40 Z" fill="#FEF08A" filter="drop-shadow(0 0 6px #FFF)"/>
</svg>`,

  'rank-tier-7.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg7" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9"/><stop offset="40%" stop-color="#818CF8" stop-opacity="0.4"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="pg7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFBEB"/><stop offset="30%" stop-color="#FCD34D"/><stop offset="70%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
    <linearGradient id="cp7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E0F2FE"/><stop offset="50%" stop-color="#38BDF8"/><stop offset="100%" stop-color="#1E3A8A"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#rg7)"/>
  <path d="M 60,18 L 74,32 L 105,38 L 88,58 L 96,90 L 60,76 L 24,90 L 32,58 L 15,38 L 46,32 Z" fill="#090D16" stroke="url(#pg7)" stroke-width="2.5" filter="drop-shadow(0 6px 14px rgba(56,189,248,0.5))"/>
  <circle cx="60" cy="60" r="26" fill="#0C1322" stroke="url(#cp7)" stroke-width="2"/>
  <ellipse cx="60" cy="60" rx="14" ry="26" fill="none" stroke="#38BDF8" stroke-width="1" stroke-dasharray="2 2"/>
  <line x1="34" y1="60" x2="86" y2="60" stroke="#38BDF8" stroke-width="1"/>
  <path d="M 45,34 L 50,42 L 60,30 L 70,42 L 75,34 L 72,48 L 48,48 Z" fill="url(#pg7)" stroke="#78350F" stroke-width="1"/>
  <circle cx="45" cy="32" r="2" fill="#FEF08A"/>
  <circle cx="60" cy="28" r="2.5" fill="#38BDF8"/>
  <circle cx="75" cy="32" r="2" fill="#FEF08A"/>
  <polygon points="60,46 65,56 75,60 65,64 60,74 55,64 45,60 55,56" fill="#F8FAFC" stroke="#38BDF8" stroke-width="1.5" filter="drop-shadow(0 0 8px #FFF)"/>
</svg>`,

  // 6 CS2 Prestige Service Medals
  'prestige-1.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p1g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#E2E8F0" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p1s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFF"/><stop offset="50%" stop-color="#CBD5E1"/><stop offset="100%" stop-color="#475569"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#p1g)"/>
  <circle cx="60" cy="60" r="46" fill="#0F172A" stroke="url(#p1s)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(226,232,240,0.6))"/>
  <polygon points="60,18 66,42 90,30 76,54 102,60 76,66 90,90 66,78 60,102 54,78 30,90 44,66 18,60 44,54 30,30 54,42" fill="url(#p1s)" stroke="#1E293B" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="16" fill="#090D16" stroke="url(#p1s)" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#F8FAFC" text-anchor="middle">I</text>
</svg>`,

  'prestige-2.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p2g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#34D399" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p2s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#A7F3D0"/><stop offset="40%" stop-color="#10B981"/><stop offset="100%" stop-color="#064E3B"/></linearGradient>
    <linearGradient id="p2gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="100%" stop-color="#CA8A04"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#p2g)"/>
  <circle cx="60" cy="60" r="46" fill="#061F14" stroke="url(#p2gold)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(16,185,129,0.7))"/>
  <polygon points="60,18 66,42 90,30 76,54 102,60 76,66 90,90 66,78 60,102 54,78 30,90 44,66 18,60 44,54 30,30 54,42" fill="url(#p2s)" stroke="url(#p2gold)" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="16" fill="#022C22" stroke="url(#p2gold)" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#FEF08A" text-anchor="middle">II</text>
</svg>`,

  'prestige-3.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p3g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#60A5FA" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p3s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#BFDBFE"/><stop offset="40%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#1E3A8A"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#p3g)"/>
  <circle cx="60" cy="60" r="46" fill="#0B132B" stroke="#93C5FD" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(59,130,246,0.7))"/>
  <polygon points="60,18 66,42 90,30 76,54 102,60 76,66 90,90 66,78 60,102 54,78 30,90 44,66 18,60 44,54 30,30 54,42" fill="url(#p3s)" stroke="#E0F2FE" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="16" fill="#0C1B33" stroke="#93C5FD" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#E0F2FE" text-anchor="middle">III</text>
</svg>`,

  'prestige-4.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p4g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#C084FC" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p4s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#E9D5FF"/><stop offset="40%" stop-color="#A855F7"/><stop offset="100%" stop-color="#581C87"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#p4g)"/>
  <circle cx="60" cy="60" r="46" fill="#1E0B33" stroke="#F472B6" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(168,85,247,0.7))"/>
  <polygon points="60,18 66,42 90,30 76,54 102,60 76,66 90,90 66,78 60,102 54,78 30,90 44,66 18,60 44,54 30,30 54,42" fill="url(#p4s)" stroke="#FDF4FF" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="16" fill="#2E1065" stroke="#E879F9" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#F5D0FE" text-anchor="middle">IV</text>
</svg>`,

  'prestige-5.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p5g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#F472B6" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p5s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FCE7F3"/><stop offset="40%" stop-color="#EC4899"/><stop offset="100%" stop-color="#831843"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#p5g)"/>
  <circle cx="60" cy="60" r="46" fill="#2E081E" stroke="#FB7185" stroke-width="3" filter="drop-shadow(0 4px 12px rgba(236,72,153,0.8))"/>
  <polygon points="60,18 66,42 90,30 76,54 102,60 76,66 90,90 66,78 60,102 54,78 30,90 44,66 18,60 44,54 30,30 54,42" fill="url(#p5s)" stroke="#FFE4E6" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="16" fill="#4C0519" stroke="#FDA4AF" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#FFE4E6" text-anchor="middle">V</text>
</svg>`,

  'prestige-6.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="p6g" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#EF4444" stop-opacity="0.9"/><stop offset="50%" stop-color="#991B1B" stop-opacity="0.4"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="p6s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FCA5A5"/><stop offset="30%" stop-color="#EF4444"/><stop offset="70%" stop-color="#B91C1C"/><stop offset="100%" stop-color="#450A0A"/></linearGradient>
    <linearGradient id="p6gold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="50%" stop-color="#EAB308"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="55" fill="url(#p6g)"/>
  <circle cx="60" cy="60" r="46" fill="#18181B" stroke="url(#p6gold)" stroke-width="3.5" filter="drop-shadow(0 6px 12px rgba(239,68,68,0.7))"/>
  <polygon points="60,16 67,42 93,27 78,53 104,60 78,67 93,93 67,78 60,104 53,78 27,93 42,67 16,60 42,53 27,27 53,42" fill="url(#p6s)" stroke="url(#p6gold)" stroke-width="2"/>
  <circle cx="60" cy="60" r="16" fill="#450A0A" stroke="url(#p6gold)" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="bold" fill="#FEF08A" text-anchor="middle">VI</text>
</svg>`,

  // Specialization Badges
  'badge-tonnage-10t.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,16 94,34 94,86 60,104 26,86 26,34" fill="#18181B" stroke="#64748B" stroke-width="3"/>
  <circle cx="60" cy="60" r="26" fill="#334155" stroke="#94A3B8" stroke-width="2"/>
  <text x="60" y="66" font-family="'Impact', sans-serif" font-size="16" font-weight="bold" fill="#E2E8F0" text-anchor="middle">10T</text>
</svg>`,

  'badge-tonnage-50t.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,14 98,32 98,88 60,106 22,88 22,32" fill="#1E1B4B" stroke="#818CF8" stroke-width="3"/>
  <circle cx="60" cy="60" r="28" fill="#3730A3" stroke="#C7D2FE" stroke-width="2"/>
  <text x="60" y="66" font-family="'Impact', sans-serif" font-size="16" font-weight="bold" fill="#EEF2FF" text-anchor="middle">50T</text>
</svg>`,

  'badge-tonnage-100t.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="tp100" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#94A3B8"/><stop offset="50%" stop-color="#475569"/><stop offset="100%" stop-color="#0F172A"/></linearGradient>
    <linearGradient id="gb100" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FDE047"/><stop offset="50%" stop-color="#EAB308"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
  </defs>
  <polygon points="60,12 102,34 102,86 60,108 18,86 18,34" fill="url(#tp100)" stroke="url(#gb100)" stroke-width="3" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.8))"/>
  <line x1="28" y1="28" x2="92" y2="92" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
  <line x1="28" y1="92" x2="92" y2="28" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round"/>
  <rect x="35" y="48" width="50" height="24" rx="6" fill="#090D16" stroke="url(#gb100)" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="16" font-weight="black" fill="#FDE047" text-anchor="middle">100T</text>
</svg>`,

  'badge-tonnage-1000t.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="kglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#FCD34D" stop-opacity="0.9"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="kgold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FFFBEB"/><stop offset="40%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#kglow)"/>
  <polygon points="60,8 106,32 106,88 60,112 14,88 14,32" fill="#090D16" stroke="url(#kgold)" stroke-width="3.5" filter="drop-shadow(0 6px 14px rgba(245,158,11,0.7))"/>
  <ellipse cx="60" cy="60" rx="42" ry="16" fill="none" stroke="#FDE047" stroke-width="2" transform="rotate(-25 60 60)"/>
  <rect x="30" y="46" width="60" height="28" rx="8" fill="#451A03" stroke="url(#kgold)" stroke-width="2"/>
  <text x="60" y="66" font-family="'Impact', sans-serif" font-size="16" font-weight="black" fill="#FEF08A" text-anchor="middle">1000T</text>
</svg>`,

  'badge-body-init.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="46" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
  <circle cx="60" cy="60" r="32" fill="none" stroke="#0284C7" stroke-width="1.5" stroke-dasharray="4 2"/>
  <polygon points="60,26 66,54 94,60 66,66 60,94 54,66 26,60 54,54" fill="#38BDF8"/>
</svg>`,

  'badge-arm-titan.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="46" fill="#1C1917" stroke="#F97316" stroke-width="3"/>
  <path d="M 40,75 C 35,50 50,35 68,35 C 80,35 90,45 85,65 C 80,80 60,85 40,75 Z" fill="#EA580C" stroke="#FED7AA" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="13" font-weight="bold" fill="#FFF" text-anchor="middle">ARM +2</text>
</svg>`,

  'badge-chest-armor.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,18 96,30 86,85 60,105 34,85 24,30" fill="#18181B" stroke="#EAB308" stroke-width="3"/>
  <path d="M 36,40 C 48,45 60,40 60,65 C 60,40 72,45 84,40 C 80,75 60,90 60,90 C 60,90 40,75 36,40 Z" fill="#CA8A04" stroke="#FEF08A" stroke-width="1.5"/>
  <text x="60" y="66" font-family="'Impact', sans-serif" font-size="11" font-weight="black" fill="#FFF" text-anchor="middle">CHEST</text>
</svg>`,

  'badge-v-taper.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vglow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#34D399" stop-opacity="0.8"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient>
    <linearGradient id="vgold" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#FEF08A"/><stop offset="50%" stop-color="#F59E0B"/><stop offset="100%" stop-color="#78350F"/></linearGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#vglow)"/>
  <circle cx="60" cy="60" r="46" fill="#061F14" stroke="url(#vgold)" stroke-width="3"/>
  <polygon points="60,95 24,35 96,35" fill="none" stroke="#10B981" stroke-width="2.5" stroke-dasharray="4 2"/>
  <circle cx="60" cy="50" r="12" fill="none" stroke="#FEF08A" stroke-width="3"/>
  <line x1="60" y1="32" x2="60" y2="68" stroke="#FEF08A" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  'badge-bench-bw.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="46" fill="#18181B" stroke="#F59E0B" stroke-width="3"/>
  <rect x="25" y="55" width="70" height="10" rx="3" fill="#E2E8F0"/>
  <circle cx="30" cy="60" r="14" fill="#D97706" stroke="#FEF08A" stroke-width="2"/>
  <circle cx="90" cy="60" r="14" fill="#D97706" stroke="#FEF08A" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="12" font-weight="black" fill="#FFF" text-anchor="middle">1.0×BW</text>
</svg>`,

  'badge-squat-1-5bw.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,16 98,34 98,86 60,104 22,86 22,34" fill="#0F172A" stroke="#38BDF8" stroke-width="3"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="14" font-weight="black" fill="#38BDF8" text-anchor="middle">1.5×BW</text>
</svg>`,

  'badge-headshot-ace.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="46" fill="#090D16" stroke="#EF4444" stroke-width="3"/>
  <line x1="20" y1="60" x2="100" y2="60" stroke="#EF4444" stroke-width="2"/>
  <line x1="60" y1="20" x2="60" y2="100" stroke="#EF4444" stroke-width="2"/>
  <circle cx="60" cy="60" r="18" fill="none" stroke="#EF4444" stroke-width="2"/>
  <text x="60" y="66" font-family="'Impact', sans-serif" font-size="14" font-weight="black" fill="#FEF08A" text-anchor="middle">ACE</text>
</svg>`,

  'badge-awp-pr.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="46" fill="#080C14" stroke="#F97316" stroke-width="3.5"/>
  <line x1="18" y1="60" x2="44" y2="60" stroke="#F97316" stroke-width="2"/>
  <line x1="76" y1="60" x2="102" y2="60" stroke="#F97316" stroke-width="2"/>
  <line x1="60" y1="18" x2="60" y2="44" stroke="#F97316" stroke-width="2"/>
  <line x1="60" y1="76" x2="60" y2="102" stroke="#F97316" stroke-width="2"/>
  <circle cx="60" cy="60" r="14" fill="none" stroke="#F97316" stroke-width="1.5" stroke-dasharray="3 3"/>
  <polygon points="60,38 68,60 52,60" fill="#FEF08A" stroke="#EA580C" stroke-width="1.5"/>
  <rect x="36" y="80" width="48" height="18" rx="4" fill="#18181B" stroke="#F97316" stroke-width="1.5"/>
  <text x="60" y="93" font-family="'Impact', sans-serif" font-size="12" font-weight="black" fill="#FED7AA" text-anchor="middle">PR</text>
</svg>`,

  'badge-veteran-100d.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <path d="M 45,15 L 75,15 L 75,45 L 105,45 L 105,75 L 75,75 L 75,105 L 45,105 L 45,75 L 15,75 L 15,45 L 45,45 Z" fill="#18181B" stroke="#EAB308" stroke-width="3.5" filter="drop-shadow(0 4px 10px rgba(234,179,8,0.6))"/>
  <circle cx="60" cy="60" r="18" fill="#78350F" stroke="#FEF08A" stroke-width="2"/>
  <text x="60" y="65" font-family="'Impact', sans-serif" font-size="12" font-weight="black" fill="#FEF08A" text-anchor="middle">100D</text>
</svg>`,

  // Official Game Icons for CS2, Wanmei Demon King S, and Valorant
  'cs-demon-king-s.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="demonGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#DC2626" stop-opacity="0.95"/>
      <stop offset="50%" stop-color="#7F1D1D" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="demonGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="25%" stop-color="#FEF08A"/>
      <stop offset="60%" stop-color="#DC2626"/>
      <stop offset="100%" stop-color="#450A0A"/>
    </linearGradient>
    <linearGradient id="demonPlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="50%" stop-color="#450A0A"/>
      <stop offset="100%" stop-color="#000000"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#demonGlow)"/>
  <!-- Demon Wings Heraldry -->
  <path d="M 60,25 L 82,10 L 108,30 L 92,60 L 104,90 L 60,112 L 16,90 L 28,60 L 12,30 L 38,10 Z" fill="url(#demonPlate)" stroke="url(#demonGold)" stroke-width="3" filter="drop-shadow(0 6px 16px rgba(220,38,38,0.8))"/>
  <!-- Demonic Horned Crown -->
  <path d="M 42,32 L 48,16 L 54,28 L 60,12 L 66,28 L 72,16 L 78,32 L 72,40 L 48,40 Z" fill="#DC2626" stroke="#FEF08A" stroke-width="1.5"/>
  <!-- Massive Metallic Gothic S -->
  <path d="M 72,46 C 72,46 54,42 48,50 C 42,58 54,64 64,68 C 76,72 78,82 72,90 C 66,98 46,96 46,96 L 44,86 C 44,86 60,90 64,84 C 68,78 58,74 48,70 C 38,66 36,54 44,46 C 52,38 72,40 72,40 Z" fill="url(#demonGold)" stroke="#FFF" stroke-width="1.5" filter="drop-shadow(0 2px 8px #DC2626)"/>
  <!-- Demon King S Banner -->
  <rect x="30" y="98" width="60" height="16" rx="4" fill="#450A0A" stroke="#FEF08A" stroke-width="1.5"/>
  <text x="60" y="110" font-family="'Impact', sans-serif" font-size="10" font-weight="black" fill="#FEF08A" text-anchor="middle" letter-spacing="1">DEMON S</text>
</svg>`,

  'cs-global-elite.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="geGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="#818CF8" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="geGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="30%" stop-color="#FCD34D"/>
      <stop offset="70%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#geGlow)"/>
  <path d="M 60,18 L 74,32 L 105,38 L 88,58 L 96,90 L 60,76 L 24,90 L 32,58 L 15,38 L 46,32 Z" fill="#090D16" stroke="url(#geGold)" stroke-width="2.5" filter="drop-shadow(0 6px 14px rgba(56,189,248,0.5))"/>
  <circle cx="60" cy="60" r="26" fill="#0C1322" stroke="#38BDF8" stroke-width="2"/>
  <ellipse cx="60" cy="60" rx="14" ry="26" fill="none" stroke="#38BDF8" stroke-width="1" stroke-dasharray="2 2"/>
  <line x1="34" y1="60" x2="86" y2="60" stroke="#38BDF8" stroke-width="1"/>
  <path d="M 45,34 L 50,42 L 60,30 L 70,42 L 75,34 L 72,48 L 48,48 Z" fill="url(#geGold)" stroke="#78350F" stroke-width="1"/>
  <polygon points="60,46 65,56 75,60 65,64 60,74 55,64 45,60 55,56" fill="#F8FAFC" stroke="#38BDF8" stroke-width="1.5" filter="drop-shadow(0 0 8px #FFF)"/>
</svg>`,

  'valorant-radiant.svg': `<svg viewBox="0 0 120 120" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="radGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="#06B6D4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="radGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB"/>
      <stop offset="40%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#radGlow)"/>
  <!-- Valorant Radiant Triangular Energy Crest -->
  <polygon points="60,10 106,94 14,94" fill="#090D16" stroke="url(#radGold)" stroke-width="3.5" filter="drop-shadow(0 6px 16px rgba(250,204,21,0.7))"/>
  <polygon points="60,26 92,86 28,86" fill="none" stroke="#22D3EE" stroke-width="2"/>
  <!-- Floating Yellow Diamond Core -->
  <polygon points="60,38 78,60 60,82 42,60" fill="url(#radGold)" stroke="#FFF" stroke-width="1.5"/>
  <circle cx="60" cy="60" r="4" fill="#090D16"/>
</svg>`
};

let count = 0;
for (const [filename, content] of Object.entries(svgs)) {
  fs.writeFileSync(path.join(medalsDir, filename), content.trim(), 'utf8');
  count++;
}
console.log(`Successfully generated ${count} vector medals into public/themes/medals/!`);
