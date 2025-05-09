(function () {
  const track = document.getElementById('scrollTrack');
  const thumb = document.getElementById('scrollThumb');

  const thumbWidth = 30;
  let pageCount = 1;
  let dragging = false;
  let dragInterval = null;
  let holdInterval = null;
  let currentPage = 1;

  function getPDFApp() {
    const iframe = document.getElementById('pdfViewer');
    return iframe?.contentWindow?.PDFViewerApplication;
  }

  function updateThumbPosition(pageNumber) {
    if (!track || pageCount < 2) return;
    const step = (track.offsetWidth - thumbWidth) / (pageCount - 1);
    const left = step * (pageNumber - 1);
    thumb.style.left = `${left}px`;
  }

  function goToPage(page) {
    const app = getPDFApp();
    if (app && page !== app.page) {
      app.page = page;
    }
  }

  function getThumbLeftFromEvent(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = track.getBoundingClientRect();
    let left = clientX - rect.left - thumbWidth / 2;
    return Math.max(0, Math.min(left, track.offsetWidth - thumbWidth));
  }

  function handleDrag(e) {
    if (!dragging) return;
    const left = getThumbLeftFromEvent(e);
    thumb.style.left = `${left}px`;
  }

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    clearInterval(dragInterval);
    dragInterval = null;
  }

  function startHold(direction) {
    const app = getPDFApp();
    if (!app || !app.pdfViewer) return;

    goToPage(app.page + direction);

    holdInterval = setInterval(() => {
      const currentApp = getPDFApp();
      if (!currentApp || !currentApp.pdfViewer) return;

      const currentPage = currentApp.page;
      const newPage = currentPage + direction;

      if (newPage >= 1 && newPage <= currentApp.pdfViewer.pagesCount) {
        goToPage(newPage);
      }
    }, 100);
  }

  function stopHold() {
    clearInterval(holdInterval);
    holdInterval = null;
  }

  function setupNavButtonEvents() {
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');

    if (!prevBtn || !nextBtn) return;

    prevBtn.removeEventListener('mousedown', startHoldPrev);
    prevBtn.removeEventListener('touchstart', startHoldPrev);
    prevBtn.removeEventListener('mouseup', stopHold);
    prevBtn.removeEventListener('mouseleave', stopHold);
    prevBtn.removeEventListener('touchend', stopHold);

    nextBtn.removeEventListener('mousedown', startHoldNext);
    nextBtn.removeEventListener('touchstart', startHoldNext);
    nextBtn.removeEventListener('mouseup', stopHold);
    nextBtn.removeEventListener('mouseleave', stopHold);
    nextBtn.removeEventListener('touchend', stopHold);

    prevBtn.addEventListener('mousedown', startHoldPrev);
    prevBtn.addEventListener('touchstart', startHoldPrev, { passive: false });
    prevBtn.addEventListener('mouseup', stopHold);
    prevBtn.addEventListener('mouseleave', stopHold);
    prevBtn.addEventListener('touchend', stopHold);

    nextBtn.addEventListener('mousedown', startHoldNext);
    nextBtn.addEventListener('touchstart', startHoldNext, { passive: false });
    nextBtn.addEventListener('mouseup', stopHold);
    nextBtn.addEventListener('mouseleave', stopHold);
    nextBtn.addEventListener('touchend', stopHold);
  }

  function startHoldPrev() {
    startHold(-1);
  }

  function startHoldNext() {
    startHold(1);
  }

  function setupDragEvents() {
    function startDrag(e) {
      dragging = true;
      handleDrag(e);
      dragInterval = setInterval(() => {
        const step = (track.offsetWidth - thumbWidth) / (pageCount - 1);
        const left = parseFloat(thumb.style.left);
        const targetPage = Math.round(left / step) + 1;
        const direction = targetPage > currentPage ? 1 : (targetPage < currentPage ? -1 : 0);

        if (direction !== 0) {
          const nextPage = currentPage + direction;
          goToPage(nextPage);
        }
      }, 75);
    }

    thumb.addEventListener('mousedown', startDrag);
    thumb.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('touchmove', handleDrag, { passive: false });

    window.addEventListener('mouseup', endDrag);
    window.addEventListener('touchend', endDrag);

    track.addEventListener('click', (e) => {
      if (e.target === thumb) return;
      const left = getThumbLeftFromEvent(e);
      thumb.style.left = `${left}px`;

      const step = (track.offsetWidth - thumbWidth) / (pageCount - 1);
      const targetPage = Math.round(left / step) + 1;
      goToPage(targetPage);
    });
  }

  function waitForPDFViewer() {
    const check = setInterval(() => {
      const app = getPDFApp();
      if (app?.pdfViewer?.pagesCount > 0) {
        clearInterval(check);

        pageCount = app.pdfViewer.pagesCount;
        currentPage = app.page;
        updateThumbPosition(currentPage);

        app.eventBus.on('pagechanging', (e) => {
          currentPage = e.pageNumber;
          updateThumbPosition(e.pageNumber);
        });

        setupDragEvents();
        setupNavButtonEvents();

        window.addEventListener('resize', () => {
          const liveApp = getPDFApp();
          if (liveApp?.page) {
            updateThumbPosition(liveApp.page);
          }
        });
      }
    }, 100);
  }

  // Attach to iframe load and refresh all
  const iframe = document.getElementById('pdfViewer');
  iframe?.addEventListener('load', () => {
    if (dragInterval) clearInterval(dragInterval);
    if (holdInterval) clearInterval(holdInterval);

    waitForPDFViewer();
  });

  // If already loaded, trigger setup now
  if (iframe?.contentWindow?.PDFViewerApplication) {
    waitForPDFViewer();
  }
})();
