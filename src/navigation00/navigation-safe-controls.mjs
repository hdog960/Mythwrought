// Optional expanded-map control geometry; no DOM hooks or production changes.
export const NAV00_SAFE_CONTROLS_VERSION = 1;
const finite = Number.isFinite;
export function layoutNavigationControls({frame, thumbRails = {left: 0, right: 0}, buttonSize = 44, gap = 8} = {}) {
  if (!frame || ![frame.x,frame.y,frame.width,frame.height,thumbRails?.left,thumbRails?.right,buttonSize,gap].every(finite) ||
      frame.width <= 0 || frame.height <= 0 || frame.x < 0 || frame.y < 0 ||
      thumbRails.left < 0 || thumbRails.right < 0 || buttonSize < 44 || buttonSize > 72 || gap < 4 || gap > 32)
    throw Error('Invalid navigation control geometry');
  const left = frame.x + thumbRails.left;
  const right = frame.x + frame.width - thumbRails.right;
  const required = buttonSize * 3 + gap * 2;
  if (right - left < required + gap * 2 || frame.height < buttonSize + gap * 2) return null;
  const y = frame.y + gap;
  const x0 = right - gap - required;
  const make = (index, action) => Object.freeze({action, x:x0+index*(buttonSize+gap), y, width:buttonSize, height:buttonSize});
  return Object.freeze({close:make(2,'close'),zoomIn:make(1,'zoom-in'),zoomOut:make(0,'zoom-out')});
}
