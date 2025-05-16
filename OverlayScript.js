//Scrollbar and Nav Buttons
(function () {
  const track = document.getElementById('scrollTrack');
  const thumb = document.getElementById('scrollThumb');

  const thumbWidth = 30;
  let pageCount = 1;
  let dragging = false;
  let dragInterval = null;
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

function goToPage(n) {
  const app = getPDFApp();
  if (!app || !app.pdfViewer || !app.pdfViewer.getPageView) return;

  const pageView = app.pdfViewer.getPageView(n - 1);
  if (!pageView?.div) return;

  // Skip PDF.js's scrollIntoView
  const container = app.pdfViewer.container;
  container.scrollTop = pageView.div.offsetTop;
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


  let holdDirection = null;

let holdInterval = null; // Make sure this is declared outside the function

function startHold(direction) {
  stopHold(); // ⬅ always stop any running interval first

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
  }, 75);
}

function stopHold() {
  clearInterval(holdInterval);
  holdInterval = null;
  holdDirection = null;
}


function setupNavButtonEvents() {
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');

  if (!prevBtn || !nextBtn) return;

  // Clean existing listeners
  ['pointerdown', 'pointerup', 'pointercancel', 'pointerleave'].forEach(event => {
    prevBtn.removeEventListener(event, startHoldPrev);
    prevBtn.removeEventListener(event, stopHold);
    nextBtn.removeEventListener(event, startHoldNext);
    nextBtn.removeEventListener(event, stopHold);
  });

  // Add unified pointer events
  prevBtn.addEventListener('pointerdown', startHoldPrev);
  prevBtn.addEventListener('pointerup', stopHold);
  prevBtn.addEventListener('pointercancel', stopHold);
  prevBtn.addEventListener('pointerleave', stopHold);

  nextBtn.addEventListener('pointerdown', startHoldNext);
  nextBtn.addEventListener('pointerup', stopHold);
  nextBtn.addEventListener('pointercancel', stopHold);
  nextBtn.addEventListener('pointerleave', stopHold);
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
        
          setupShowLegendPreview();
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
  // Legend Button Logic 
function setupShowLegendPreview() {
  const legendBtn = document.getElementById('ShowLegend');
  if (!legendBtn) return;

  // Remove any existing listeners first
  legendBtn.replaceWith(legendBtn.cloneNode(true));
  const freshLegendBtn = document.getElementById('ShowLegend');

  let previousPage = null;

  function getPDFApp() {
    const iframe = document.getElementById('pdfViewer');
    return iframe?.contentWindow?.PDFViewerApplication;
  }

  function jumpToLegend() {
    const app = getPDFApp();
    if (!app || !app.pdfViewer) return;
    previousPage = app.pdfViewer.currentPageNumber;
    app.pdfViewer.currentPageNumber = 3;
  }

  function returnToPreviousPage() {
    const app = getPDFApp();
    if (!app || previousPage === null) return;
    app.pdfViewer.currentPageNumber = previousPage;
    previousPage = null;
  }

  freshLegendBtn.addEventListener('mousedown', jumpToLegend);
  freshLegendBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jumpToLegend();
  }, { passive: false });

  freshLegendBtn.addEventListener('mouseup', returnToPreviousPage);
  freshLegendBtn.addEventListener('mouseleave', returnToPreviousPage);
  freshLegendBtn.addEventListener('touchend', returnToPreviousPage);

  // Attach page visibility logic again
  const app = getPDFApp();
  if (app?.eventBus) {
    app.eventBus.on('pagechanging', (e) => {
      const pageNum = e.pageNumber;
      freshLegendBtn.style.display = (pageNum >= 1 && pageNum <= 2) ? 'none' : 'inline';
      freshLegendBtn.style.opacity = (pageNum === 3) ? '0' : '1';
    });
  }
}
})();

document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.navButton');

  buttons.forEach(btn => {
    // Touch feedback
    btn.addEventListener('touchstart', () => btn.classList.add('nav-pressed'), { passive: true });
    btn.addEventListener('touchend', () => btn.classList.remove('nav-pressed'));
    btn.addEventListener('touchcancel', () => btn.classList.remove('nav-pressed'));

    // Mouse feedback
    btn.addEventListener('mousedown', () => btn.classList.add('nav-pressed'));
    btn.addEventListener('mouseup', () => btn.classList.remove('nav-pressed'));
    btn.addEventListener('mouseleave', () => btn.classList.remove('nav-pressed'));
  });
});

