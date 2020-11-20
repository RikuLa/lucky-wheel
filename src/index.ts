import resizeBox from './resizeBox';

// Wait for dom to load
window.addEventListener('DOMContentLoaded', () => {
  const resizableBox = document.createElement('div');
  resizableBox.className = 'resizableBox';
  const corners = document.createElement('div');
  corners.className = 'corners';
  const tl = document.createElement('div');
  const tr = document.createElement('div');
  const bl = document.createElement('div');
  const br = document.createElement('div');
  tl.className = 'corner top-left';
  tr.className = 'corner top-right';
  bl.className = 'corner bottom-left';
  br.className = 'corner bottom-right';
  document.body.appendChild(resizableBox);
  resizableBox.appendChild(corners);
  corners.appendChild(tl);
  corners.appendChild(tr);
  corners.appendChild(bl);
  corners.appendChild(br);
  resizeBox(resizableBox, [tl, tr, bl, br]);
});

// eslint-disable-next-line no-console
console.log('Hello World');
