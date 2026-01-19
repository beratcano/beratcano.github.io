document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and include HTML
    function includeHTML(elementId, filePath) {
        const element = document.getElementById(elementId);
        if (element) {
            fetch(filePath)
                .then(response => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        throw new Error(`Could not load ${filePath}: ${response.statusText}`);
                    }
                })
                .then(data => {
                    element.innerHTML = data;
                    // Dispatch event when content is loaded
                    document.dispatchEvent(new CustomEvent('includeLoaded', { detail: elementId }));
                })
                .catch(error => {
                    console.error('Error including HTML:', error);
                    element.innerHTML = `<p style="color:red;">Error loading ${elementId}.</p>`;
                });
        }
    }

    // Always use absolute paths from root
    includeHTML('header-placeholder', '/includes/header.html');
    includeHTML('footer-placeholder', '/includes/footer.html');
});
