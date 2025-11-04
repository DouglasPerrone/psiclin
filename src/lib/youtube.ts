// Utilidades para trabalhar com URLs do YouTube, incluindo Shorts

// Extrai o ID do vídeo do YouTube a partir de um ID direto ou de várias formas de URL
export function extractYoutubeId(value: string): string | null {
  if (!value) return null;
  const input = value.trim();

  // Caso seja diretamente um ID (geralmente 11 caracteres)
  const directIdMatch = input.match(/^[A-Za-z0-9_-]{11}$/);
  if (directIdMatch) return directIdMatch[0];

  // Tenta interpretar como URL
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, '');

    // watch?v=
    const vParam = url.searchParams.get('v');
    if (vParam) return vParam;

    // youtu.be/<id>
    if (host === 'youtu.be') {
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 0) return parts[0];
    }

    // /shorts/<id>, /embed/<id>, /v/<id>
    const segments = url.pathname.split('/').filter(Boolean);
    const shortsIdx = segments.indexOf('shorts');
    if (shortsIdx !== -1 && segments[shortsIdx + 1]) return segments[shortsIdx + 1];
    const embedIdx = segments.indexOf('embed');
    if (embedIdx !== -1 && segments[embedIdx + 1]) return segments[embedIdx + 1];
    if (segments[0] === 'v' && segments[1]) return segments[1];
  } catch {
    // Não é uma URL válida, continua para regex genéricas
  }

  // Regex genéricas para strings que contenham padrões conhecidos
  const patterns: RegExp[] = [
    /watch\?v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /shorts\/([A-Za-z0-9_-]{11})/,
    /embed\/([A-Za-z0-9_-]{11})/
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (m) return m[1];
  }

  // Fallback: tenta capturar qualquer sequência que pareça um ID
  const fallback = input.match(/[A-Za-z0-9_-]{11}/);
  return fallback ? fallback[0] : null;
}

export function buildWatchUrlFromId(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

export function buildThumbnailUrlFromId(id: string): string {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}