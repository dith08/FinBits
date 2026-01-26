
export const COLORS = {
  PRIMARY: '#00b894',      
  SECONDARY: '#3b82f6',    
  ACCENT: '#06b6d4',      

  SUCCESS: '#10b981',      
  WARNING: '#f59e0b',     
  DANGER: '#ef4444',       
  INFO: '#3b82f6',         

  BG_DARK: '#000000',     
  BG_SURFACE: '#0a0a0a',   
  BG_CARD: '#0d0d0d',     
  BG_HOVER: '#1a1a1a',     

  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#d1d5db',
  TEXT_TERTIARY: '#9ca3af',
  TEXT_MUTED: '#6b7280',
} as const;

export const COLOR_CLASSES = {
  primary: {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    bgLight: 'bg-emerald-500/10',
    border: 'border-emerald-500',
    borderLight: 'border-emerald-500/20',
    hover: 'hover:border-emerald-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]',
  },
  secondary: {
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    bgLight: 'bg-blue-500/10',
    border: 'border-blue-500',
    borderLight: 'border-blue-500/20',
    hover: 'hover:border-blue-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
  },
  accent: {
    text: 'text-cyan-500',
    bg: 'bg-cyan-500',
    bgLight: 'bg-cyan-500/10',
    border: 'border-cyan-500',
    borderLight: 'border-cyan-500/20',
    hover: 'hover:border-cyan-500/50',
    glow: 'shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]',
  },
  success: {
    text: 'text-green-500',
    bg: 'bg-green-500',
    bgLight: 'bg-green-500/10',
  },
  warning: {
    text: 'text-amber-500',
    bg: 'bg-amber-500',
    bgLight: 'bg-amber-500/10',
  },
  danger: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    bgLight: 'bg-red-500/10',
  },
} as const;

export const COMPONENT_COLORS = {
  FINANCE: 'primary',     
  GOALS: 'secondary',      
  PRODUCTIVITY: 'accent', 
  PROFILE: 'primary',      
  DASHBOARD: 'primary',   
} as const;
