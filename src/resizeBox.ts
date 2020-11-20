export default function (box, corners) {
  const minimumSize = 20;
  let originalWidth = 0;
  let originalHeight = 0;
  let originalX = 0;
  let originalY = 0;
  let originalMouseX = 0;
  let originalMouseY = 0;

    function resize(e) {
        console.log(e.target.classList)
        const corner = e.target;
    if (corner.classList.contains('bottom-right')) {
      const width = originalWidth + (e.pageX - originalMouseX);
      const height = originalHeight + (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
      }
    } else if (corner.classList.contains('bottom-left')) {
      const height = originalHeight + (e.pageY - originalMouseY);
      const width = originalWidth - (e.pageX - originalMouseX);
      if (height > minimumSize) {
        box.style.height = `${height}px`;
      }
      if (width > minimumSize) {
        box.style.width = `${width}px`;
        box.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
      }
    } else if (corner.classList.contains('top-right')) {
      const width = originalWidth + (e.pageX - originalMouseX);
      const height = originalHeight - (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
        box.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
      }
    } else if (corner.classList.contains('top-left'){
      const width = originalWidth - (e.pageX - originalMouseX);
      const height = originalHeight - (e.pageY - originalMouseY);
      if (width > minimumSize) {
        box.style.width = `${width}px`;
        box.style.left = `${originalX + (e.pageX - originalMouseX)}px`;
      }
      if (height > minimumSize) {
        box.style.height = `${height}px`;
        box.style.top = `${originalY + (e.pageY - originalMouseY)}px`;
      }
    }
  }

  function stopResize() {
    window.removeEventListener('mousemove', resize);
  }

  const mouseEvent = (e) => {
    e.preventDefault();
    originalWidth = parseFloat(getComputedStyle(box, null).getPropertyValue('width').replace('px', ''));
    originalHeight = parseFloat(getComputedStyle(box, null).getPropertyValue('height').replace('px', ''));
    originalX = box.getBoundingClientRect().left;
    originalY = box.getBoundingClientRect().top;
    originalMouseX = e.pageX;
    originalMouseY = e.pageY;
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
  };

  for (let i = 0; i < corners.length; i += 1) {
    const corner = corners[i];
    corner.addEventListener('mousedown', mouseEvent);
  }
}

/*
const resizeObserver = new ResizeObserver((entries) => {
  console.log('Size changed');
  entries.forEach((entry) => {
    const cr = entry.contentRect;
    console.log('box:', entry.target);
    console.log(`box size: ${cr.width}px x ${cr.height}px`);
    console.log(`box padding: ${cr.top}px ; ${cr.left}px`);
    if (cr.width > cr.height) {
      console.log('Ländskeip');
    } else if (cr.width < cr.height) {
      console.log('porttrait');
    } else {
      console.log('boxxx');
    }
  });
});

resizeObserver.observe(box);
*/
