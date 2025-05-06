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
    viewer.src = 'web/viewer.html?file=../pdf/' + file + '#page=1&zoom=page-fit';
    document.getElementById('pdfOverlay').style.display = 'block';
}

        function closePDF() {
            const viewer = document.getElementById('pdfViewer');
            viewer.src = '';
            document.getElementById('pdfOverlay').style.display = 'none';
        }