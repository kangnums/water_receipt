export async function safeHtml2Canvas(
  element: HTMLElement,
  options: {
    scale?: number;
    backgroundColor?: string | null;
    useCORS?: boolean;
    onclone?: (clonedDoc: Document, clonedElement: HTMLElement) => void;
  } = {}
): Promise<HTMLCanvasElement> {
  const pixelRatio = options.scale || 3;

  try {
    // Dynamic import to avoid bundling html-to-image in the initial page load
    const { toCanvas } = await import('html-to-image');
    const canvas = await toCanvas(element, {
      pixelRatio,
      backgroundColor: options.backgroundColor ?? undefined,
      cacheBust: true,
      fontEmbedCSS: '',
      skipFonts: true,
      filter: () => true,
    });
    return canvas;
  } catch (err) {
    console.warn('html-to-image failed, attempting fallback canvas generation:', err);
    throw err;
  }
}
