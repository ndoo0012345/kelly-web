export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Generate SVG Data URL album cover based on Title & Artist
export function generateCoverArt(title: string, artist: string, id: string = ''): string {
  // Generate consistent pleasant palette from string hash
  const str = `${title}-${artist}-${id}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const palettes = [
    { bg1: '#1E3153', bg2: '#0E1930', accent: '#7C93C4', sub: '#3D5C94' },
    { bg1: '#2F4874', bg2: '#16253F', accent: '#A5B7DE', sub: '#2C3E60' },
    { bg1: '#1A365D', bg2: '#0F172A', accent: '#60A5FA', sub: '#2563EB' },
    { bg1: '#1E293B', bg2: '#0F172A', accent: '#94A3B8', sub: '#334155' },
    { bg1: '#312E81', bg2: '#1E1B4B', accent: '#A5B4FC', sub: '#4338CA' },
    { bg1: '#064E3B', bg2: '#022C22', accent: '#6EE7B7', sub: '#047857' },
    { bg1: '#701A75', bg2: '#4A044E', accent: '#F472B6', sub: '#86198F' },
  ];

  const palette = palettes[Math.abs(hash) % palettes.length];
  const initials = (artist ? artist.substring(0, 1) : 'K') + (title ? title.substring(0, 1) : 'T');

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.bg1}" />
          <stop offset="100%" stop-color="${palette.bg2}" />
        </linearGradient>
        <linearGradient id="v" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${palette.accent}" />
          <stop offset="100%" stop-color="${palette.sub}" />
        </linearGradient>
      </defs>
      <rect width="300" height="300" rx="24" fill="url(#g)" />
      
      <!-- Vinyl record circle decoration -->
      <circle cx="150" cy="150" r="105" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" />
      <circle cx="150" cy="150" r="85" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" />
      <circle cx="150" cy="150" r="65" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" />
      
      <!-- Central badge -->
      <circle cx="150" cy="150" r="46" fill="url(#v)" />
      <circle cx="150" cy="150" r="14" fill="${palette.bg2}" />
      
      <!-- Monogram text -->
      <text x="150" y="245" fill="#FFFFFF" font-family="sans-serif" font-weight="700" font-size="16" text-anchor="middle" letter-spacing="2">
        ${escapeXml(initials.toUpperCase())}
      </text>
      <text x="150" y="268" fill="rgba(255,255,255,0.6)" font-family="sans-serif" font-weight="500" font-size="11" text-anchor="middle" letter-spacing="1">
        DIGITAL WORKSPACE
      </text>
    </svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
