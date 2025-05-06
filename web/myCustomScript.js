// Preload helper function (define outside)
function preloadAdjacentPages(app, currentPage, range = 3) {
    const viewer = app.pdfViewer;
    const totalPages = viewer.pagesCount;

    for (let offset = 1; offset <= range; offset++) {
        const nextPage = currentPage + offset;
        const prevPage = currentPage - offset;

        if (nextPage <= totalPages) {
            const nextView = viewer.getPageView(nextPage - 1);
            if (nextView && !nextView.renderingState) {
                nextView.draw();
            }
        }

        if (prevPage >= 1) {
            const prevView = viewer.getPageView(prevPage - 1);
            if (prevView && !prevView.renderingState) {
                prevView.draw();
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const app = window.PDFViewerApplication;

    app.initializedPromise.then(() => {
        console.log('Custom script loaded: forcing page scroll mode');

        app.pdfViewer.scrollMode = 3;

        let touchStartY = 0;
        let scrollDirection = 0;  // +1 = forward, -1 = backward
        let scrollInterval;

        document.addEventListener('wheel', (event) => {
            if (app.pdfViewer.scrollMode === 3) {
                event.preventDefault();
                if (event.deltaY > 0) {
                    app.page++;
                } else if (event.deltaY < 0) {
                    app.page--;
                }
            }
        }, { passive: false });

        document.addEventListener('touchstart', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();  // stop window scroll
                touchStartY = event.touches[0].clientY;
                scrollDirection = 0;
        
                scrollInterval = setInterval(() => {
                    if (scrollDirection === 1 && app.page < app.pagesCount) {
                        app.page++;
                    } else if (scrollDirection === -1 && app.page > 1) {
                        app.page--;
                    }
                }, 250);
            }
        }, { passive: false });
        
        document.addEventListener('touchmove', (event) => {
            if (event.touches.length === 1) {
                event.preventDefault();  // stop window scroll
                const currentY = event.touches[0].clientY;
                const deltaY = touchStartY - currentY;
        
                if (Math.abs(deltaY) > 30) {
                    scrollDirection = deltaY > 0 ? 1 : -1;
                } else {
                    scrollDirection = 0;
                }
            }
        }, { passive: false });

        document.addEventListener('touchend', (event) => {
            clearInterval(scrollInterval);
            scrollDirection = 0;
        });
    });
});




// Preload nearby pages
function preloadAdjacentPages(app, currentPage, range = 3) {
    const viewer = app.pdfViewer;
    const totalPages = viewer.pagesCount;

    for (let offset = 1; offset <= range; offset++) {
        const nextPage = currentPage + offset;
        const prevPage = currentPage - offset;

        if (nextPage <= totalPages) {
            const nextView = viewer.getPageView(nextPage - 1);
            if (nextView && !nextView.renderingState) {
                nextView.draw();
            }
        }

        if (prevPage >= 1) {
            const prevView = viewer.getPageView(prevPage - 1);
            if (prevView && !prevView.renderingState) {
                prevView.draw();
            }
        }
    }
}

// Always preload page 3
function preloadSpecificPage(app, pageNumber) {
    const viewer = app.pdfViewer;
    const totalPages = viewer.pagesCount;

    if (pageNumber >= 1 && pageNumber <= totalPages) {
        const pageView = viewer.getPageView(pageNumber - 1);
        if (pageView && !pageView.renderingState) {
            pageView.draw();
        }
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const app = window.PDFViewerApplication;
    let previousPage = null;

    app.initializedPromise.then(() => {
        const button = document.getElementById('jumpToPage3');

        button.addEventListener('mousedown', () => {
            previousPage = app.pdfViewer.currentPageNumber;
            app.pdfViewer.currentPageNumber = 3;
        });

        button.addEventListener('mouseup', () => {
            if (previousPage !== null) {
                app.pdfViewer.currentPageNumber = previousPage;
            }
        });

        // Optional: also handle case when user drags off the button
        button.addEventListener('mouseleave', () => {
            if (previousPage !== null) {
                app.pdfViewer.currentPageNumber = previousPage;
            }
        });

        // Optional: for touch devices
        button.addEventListener('touchstart', (e) => {
            e.preventDefault(); // prevent mouse event fallback
            previousPage = app.pdfViewer.currentPageNumber;
            app.pdfViewer.currentPageNumber = 3;
        });

        button.addEventListener('touchend', () => {
            if (previousPage !== null) {
                app.pdfViewer.currentPageNumber = previousPage;
            }
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const app = window.PDFViewerApplication;

    app.initializedPromise.then(() => {
        const url = app.url;
        const fileName = url ? url.split('/').pop() : '';

        if (fileName === 'Other_Contour Compendium.pdf') {
            document.getElementById('bottomToolbar').style.display = 'none';
        }
    });
});