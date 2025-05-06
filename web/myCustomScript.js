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

        app.eventBus.on('pagechanging', (evt) => {
            const currentPage = evt.pageNumber;
            preloadAdjacentPages(app, currentPage, 3); // preload 3 forward/back
            preloadSpecificPage(app, 3); // always preload page 3
        });

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