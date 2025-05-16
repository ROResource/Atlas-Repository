function togglePanel(panel) {
    const content = panel.querySelector('.panel-content');
    const isVisible = content.style.display === 'block';
    document.querySelectorAll('.panel-content').forEach(pc => pc.style.display = 'none');
    content.style.display = isVisible ? 'none' : 'block';
}

function toggleGroup(event, group) {
    event.stopPropagation(); // Prevent triggering panel toggle
    const content = group.querySelector('.group-content');
    const isVisible = content.style.display === 'block';
    content.style.display = isVisible ? 'none' : 'block';
}
document.addEventListener('DOMContentLoaded', () => {
            fetch('atlas_list.html')
                .then(response => response.text())
                .then(html => {
                    const container = document.getElementById('atlas-container');
                    container.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading atlas list:', error);
                });
        });
document.addEventListener('DOMContentLoaded', () => {
            fetch('guidelines_list.html')
                .then(response => response.text())
                .then(html => {
                    const container = document.getElementById('guidelines-container');
                    container.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading atlas list:', error);
                });
        });


function openPDF(file) {
  const viewer = document.getElementById('pdfViewer');
  const overlay = document.getElementById('pdfOverlay');

  viewer.src = 'web/viewer.html?file=../pdf/' + file + '#zoom=page-height';
  overlay.style.display = 'flex';

  positionScrollerBelowContainer(); // your existing custom logic

  document.body.classList.add('pdf-active');
  document.body.style.overflow = 'hidden';

  // ✅ Scroll to bottom of the overlay
  setTimeout(() => {
    overlay.scrollTop = overlay.scrollHeight;
  }, 50); // short delay ensures DOM is rendered first
}

        function closePDF() {
            const viewer = document.getElementById('pdfViewer');
            viewer.src = '';
            document.getElementById('pdfOverlay').style.display = 'none';
            document.body.classList.remove('pdf-active');
            document.body.style.overflow = '';
            document.getElementById('ShowLegend').style.display = 'none';
        }
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


window.addEventListener('resize', positionScrollerBelowContainer);
window.addEventListener('scroll', positionScrollerBelowContainer);


 window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    const container = document.getElementById('pdfContainer');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 300); // Give browser time to resize layout
});    

document.addEventListener('contextmenu', (e) => {
  if (document.body.classList.contains('pdf-active')) {
    e.preventDefault(); // Block context menu on long-press
  }
});



