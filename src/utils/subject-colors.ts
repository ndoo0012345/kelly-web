export interface SubjectColorStyle {
  bg: string;
  border: string;
  badge: string;
  badgeText: string;
  text: string;
  dot: string;
  glow: string;
  iconBg: string;
}

export function getSubjectColor(subjectName?: string, isBreak?: boolean): SubjectColorStyle {
  if (isBreak) {
    return {
      bg: 'bg-amber-50/90 hover:bg-amber-100/70',
      border: 'border-amber-200/80',
      badge: 'bg-amber-100 text-amber-800 border-amber-300',
      badgeText: 'text-amber-800',
      text: 'text-amber-900',
      dot: 'bg-amber-500',
      glow: 'shadow-amber-500/10',
      iconBg: 'bg-amber-200/60 text-amber-700'
    };
  }

  const name = (subjectName || '').toLowerCase();

  // Matematika / Mat Wajib / Mat TL
  if (name.includes('matematika') || name.includes('mat ')) {
    return {
      bg: 'bg-indigo-50/90 hover:bg-indigo-100/70',
      border: 'border-indigo-200/90',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-300',
      badgeText: 'text-indigo-800',
      text: 'text-indigo-950',
      dot: 'bg-indigo-600',
      glow: 'shadow-indigo-500/15',
      iconBg: 'bg-indigo-200/60 text-indigo-700'
    };
  }

  // Informatika / Komputer / Coding
  if (name.includes('informatika') || name.includes('komputer') || name.includes('coding')) {
    return {
      bg: 'bg-emerald-50/90 hover:bg-emerald-100/70',
      border: 'border-emerald-200/90',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badgeText: 'text-emerald-800',
      text: 'text-emerald-950',
      dot: 'bg-emerald-600',
      glow: 'shadow-emerald-500/15',
      iconBg: 'bg-emerald-200/60 text-emerald-700'
    };
  }

  // Sosiologi
  if (name.includes('sosiologi')) {
    return {
      bg: 'bg-orange-50/90 hover:bg-orange-100/70',
      border: 'border-orange-200/90',
      badge: 'bg-orange-100 text-orange-800 border-orange-300',
      badgeText: 'text-orange-800',
      text: 'text-orange-950',
      dot: 'bg-orange-600',
      glow: 'shadow-orange-500/15',
      iconBg: 'bg-orange-200/60 text-orange-700'
    };
  }

  // Mandarin
  if (name.includes('mandarin')) {
    return {
      bg: 'bg-rose-50/90 hover:bg-rose-100/70',
      border: 'border-rose-200/90',
      badge: 'bg-rose-100 text-rose-800 border-rose-300',
      badgeText: 'text-rose-800',
      text: 'text-rose-950',
      dot: 'bg-rose-600',
      glow: 'shadow-rose-500/15',
      iconBg: 'bg-rose-200/60 text-rose-700'
    };
  }

  // Bahasa Indonesia
  if (name.includes('indonesia')) {
    return {
      bg: 'bg-red-50/90 hover:bg-red-100/70',
      border: 'border-red-200/90',
      badge: 'bg-red-100 text-red-800 border-red-300',
      badgeText: 'text-red-800',
      text: 'text-red-950',
      dot: 'bg-red-600',
      glow: 'shadow-red-500/15',
      iconBg: 'bg-red-200/60 text-red-700'
    };
  }

  // Bahasa Inggris / English
  if (name.includes('inggris') || name.includes('english')) {
    return {
      bg: 'bg-purple-50/90 hover:bg-purple-100/70',
      border: 'border-purple-200/90',
      badge: 'bg-purple-100 text-purple-800 border-purple-300',
      badgeText: 'text-purple-800',
      text: 'text-purple-950',
      dot: 'bg-purple-600',
      glow: 'shadow-purple-500/15',
      iconBg: 'bg-purple-200/60 text-purple-700'
    };
  }

  // PKWU / Tata Boga / Kewirausahaan
  if (name.includes('pkwu') || name.includes('boga') || name.includes('prakarya')) {
    return {
      bg: 'bg-pink-50/90 hover:bg-pink-100/70',
      border: 'border-pink-200/90',
      badge: 'bg-pink-100 text-pink-800 border-pink-300',
      badgeText: 'text-pink-800',
      text: 'text-pink-950',
      dot: 'bg-pink-600',
      glow: 'shadow-pink-500/15',
      iconBg: 'bg-pink-200/60 text-pink-700'
    };
  }

  // PJOK / Olahraga
  if (name.includes('pjok') || name.includes('olahraga')) {
    return {
      bg: 'bg-lime-50/90 hover:bg-lime-100/70',
      border: 'border-lime-200/90',
      badge: 'bg-lime-100 text-lime-800 border-lime-300',
      badgeText: 'text-lime-800',
      text: 'text-lime-950',
      dot: 'bg-lime-600',
      glow: 'shadow-lime-500/15',
      iconBg: 'bg-lime-200/60 text-lime-700'
    };
  }

  // Budi Pekerti / Budaya Humanis / Agama
  if (name.includes('budi pekerti') || name.includes('budaya humanis') || name.includes('agama') || name.includes('kebajikan')) {
    return {
      bg: 'bg-teal-50/90 hover:bg-teal-100/70',
      border: 'border-teal-200/90',
      badge: 'bg-teal-100 text-teal-800 border-teal-300',
      badgeText: 'text-teal-800',
      text: 'text-teal-950',
      dot: 'bg-teal-600',
      glow: 'shadow-teal-500/15',
      iconBg: 'bg-teal-200/60 text-teal-700'
    };
  }

  // Sejarah
  if (name.includes('sejarah')) {
    return {
      bg: 'bg-yellow-50/90 hover:bg-yellow-100/70',
      border: 'border-yellow-200/90',
      badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      badgeText: 'text-yellow-800',
      text: 'text-yellow-950',
      dot: 'bg-yellow-600',
      glow: 'shadow-yellow-500/15',
      iconBg: 'bg-yellow-200/60 text-yellow-700'
    };
  }

  // PPKn / PKn
  if (name.includes('ppkn') || name.includes('pkn')) {
    return {
      bg: 'bg-cyan-50/90 hover:bg-cyan-100/70',
      border: 'border-cyan-200/90',
      badge: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      badgeText: 'text-cyan-800',
      text: 'text-cyan-950',
      dot: 'bg-cyan-600',
      glow: 'shadow-cyan-500/15',
      iconBg: 'bg-cyan-200/60 text-cyan-700'
    };
  }

  // Seni Budaya / Musik / Rupa
  if (name.includes('seni') || name.includes('musik')) {
    return {
      bg: 'bg-fuchsia-50/90 hover:bg-fuchsia-100/70',
      border: 'border-fuchsia-200/90',
      badge: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      badgeText: 'text-fuchsia-800',
      text: 'text-fuchsia-950',
      dot: 'bg-fuchsia-600',
      glow: 'shadow-fuchsia-500/15',
      iconBg: 'bg-fuchsia-200/60 text-fuchsia-700'
    };
  }

  // Upacara / Pembiasaan / Refleksi
  if (name.includes('upacara') || name.includes('pembiasaan') || name.includes('refleksi')) {
    return {
      bg: 'bg-violet-50/90 hover:bg-violet-100/70',
      border: 'border-violet-200/90',
      badge: 'bg-violet-100 text-violet-800 border-violet-300',
      badgeText: 'text-violet-800',
      text: 'text-violet-950',
      dot: 'bg-violet-600',
      glow: 'shadow-violet-500/15',
      iconBg: 'bg-violet-200/60 text-violet-700'
    };
  }

  // Default vibrant slate/blue
  return {
    bg: 'bg-sky-50/90 hover:bg-sky-100/70',
    border: 'border-sky-200/90',
    badge: 'bg-sky-100 text-sky-800 border-sky-300',
    badgeText: 'text-sky-800',
    text: 'text-sky-950',
    dot: 'bg-sky-600',
    glow: 'shadow-sky-500/15',
    iconBg: 'bg-sky-200/60 text-sky-700'
  };
}
