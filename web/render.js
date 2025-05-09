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


(function () {
    let cachedViewport = null;
  
    // Set viewer options BEFORE viewer initialises
    document.addEventListener('webviewerloaded', () => {
      PDFViewerApplicationOptions.set('textLayerMode', 0); // Disable selectable text layer
      PDFViewerApplicationOptions.set('renderInteractiveForms', false); // Disable forms
      PDFViewerApplicationOptions.set('disableAutoFetch', false); // Enable prefetching
      PDFViewerApplicationOptions.set('disableStream', false); // Enable streaming
  
      const app = window.PDFViewerApplication;
  
      app.initializedPromise.then(() => {
        // Enforce vertical scroll mode and consistent zoom
        app.pdfViewer.scrollMode = 0;
        app.pdfViewer.currentScaleValue = 'page-height';
  
        // Viewport caching for identical page sizes
        const PageViewProto = app.pdfViewer._pages[0].constructor.prototype;
        const originalDraw = PageViewProto.draw;
  
        PageViewProto.draw = function (...args) {
          if (this.renderingState === 0) {
            if (!cachedViewport || this.scale !== cachedViewport.scale) {
              cachedViewport = this.pdfPage.getViewport({ scale: this.scale });
            }
  
            this.viewport = cachedViewport;
  
            // Optional: explicitly set canvas size to match viewport
            if (this.canvas) {
              this.canvas.width = cachedViewport.width;
              this.canvas.height = cachedViewport.height;
              this.canvas.style.width = `${cachedViewport.width}px`;
              this.canvas.style.height = `${cachedViewport.height}px`;
            }
          }
  
          return originalDraw.apply(this, args);
        };
  
        console.log('[PDF.js Optimiser] Viewer options and viewport caching applied');
      });
    });
  
    // Clear cached viewport on resize to re-trigger layout
    window.addEventListener('resize', () => {
      cachedViewport = null;
    });
  })();

  function cleanupOffscreenPages(buffer = 3) {
    const app = PDFViewerApplication;
    const current = app.pdfViewer.currentPageNumber;
  
    app.pdfViewer._pages.forEach((pageView, index) => {
      const pageNumber = index + 1;
      const distance = Math.abs(pageNumber - current);
  
      if (distance > buffer && pageView.canvas) {
        // Remove canvas to free memory
        pageView.canvas.width = 0;
        pageView.canvas.height = 0;
        pageView.canvas.remove();
        pageView.canvas = null;
        pageView.svg = null;
        pageView.renderingState = 0; // Set back to INITIAL
      }
    });
  }
document.addEventListener('webviewerloaded', () => {
    PDFViewerApplication.initializedPromise.then(() => {
      PDFViewerApplication.eventBus.on('pagechange', () => {
        cleanupOffscreenPages(3); // keep current ±3 pages only
      });
    });
  }); 

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
