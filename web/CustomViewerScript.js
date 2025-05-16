//Custom Logic

// Windo Resize Logic
window.addEventListener('resize', () => {
    const app = window.PDFViewerApplication;
    if (app && app.pdfViewer) {
        app.pdfViewer.scrollMode = 0;
        app.pdfViewer.currentScaleValue = 'page-height';
        app.pdfViewer.scrollPageIntoView({
        pageNumber: app.pdfViewer.currentPageNumber
        
      });
    }
  });
// Wheel Scroll Logic
(function () {
    let isScrolling = false;
    const SCROLL_DELAY = 75; // milliseconds – adjust for scroll responsiveness
  
    document.addEventListener('wheel', (event) => {
      const app = window.PDFViewerApplication;
      if (!app || !app.pdfViewer || app.pdfViewer.scrollMode !== 0) return;
  
      event.preventDefault(); // Stop native scrolling
  
      // Debounce to limit scroll rate
      if (isScrolling) return;
      isScrolling = true;
  
      const direction = event.deltaY > 0 ? 'down' : 'up';
      const current = app.pdfViewer.currentPageNumber;
  
      if (direction === 'down' && current < app.pdfViewer.pagesCount) {
        app.pdfViewer.nextPage();
      } else if (direction === 'up' && current > 1) {
        app.pdfViewer.previousPage();
        
      }
  
      setTimeout(() => {
        isScrolling = false;
      }, SCROLL_DELAY);
    }, { passive: false }); // passive: false required for preventDefault
  })();


// Buffer Cleaning Logic
function cleanupOffscreenPages(buffer = 3) {
    const app = PDFViewerApplication;
    const current = app.pdfViewer.currentPageNumber;
  
    app.pdfViewer._pages.forEach((pageView, index) => {
      const pageNumber = index + 1;
      const distance = Math.abs(pageNumber - current);
  
      if (distance > buffer && pageView.canvas) {
        pageView.canvas.width = 0;
        pageView.canvas.height = 0;
        pageView.canvas.remove();
        pageView.canvas = null;
        pageView.svg = null;
        pageView.renderingState = 0;
      }
    });
  }
// Legend Button Visibility
document.addEventListener('webviewerloaded', () => {
    PDFViewerApplication.initializedPromise.then(() => {
      PDFViewerApplication.eventBus.on('pagechange', () => {
        cleanupOffscreenPages(3);
        updateLegendVisibility; // keep current ±3 pages only
      })  
    });
  }); 
// ScrollBar Position
function positionScrollerBelowContainer() {
  const container = document.getElementById('pdfContainer');
  const scroller = document.getElementById('customScroller');
  if (!container || !scroller) return;

  const rect = container.getBoundingClientRect();
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  scroller.style.position = 'absolute';
  scroller.style.top = `${rect.bottom + scrollTop}px`;
  scroller.style.left = '50%';
  scroller.style.transform = 'translateX(-50%)';
}

// disable long-press menu inside viewer
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('viewerContainer');
  container.addEventListener('contextmenu', (e) => {
    e.preventDefault(); 
  });
});