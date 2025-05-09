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
  (function () {
    let isScrolling = false;
    const SCROLL_DELAY = 50; // milliseconds – adjust for scroll responsiveness
  
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
