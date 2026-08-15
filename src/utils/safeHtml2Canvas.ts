import { toCanvas } from 'html-to-image';

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
    const canvas = await toCanvas(element, {
      pixelRatio,
      backgroundColor: options.backgroundColor ?? undefined,
      cacheBust: true,
      fontEmbedCSS: '',
      skipFonts: true,
      filter: (node) => {
        return true;
      },
    });
    return canvas;
  } catch (err) {
    console.warn('html-to-image failed, attempting fallback canvas generation:', err);
    // Fallback if needed
    throw err;
  }
}
