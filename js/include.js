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
                })
                .catch(error => {
                    console.error('Error including HTML:', error);
                    element.innerHTML = `<p style="color:red;">Error loading ${elementId}.</p>`;
                });
        }
    }

    // Determine base path for includes (handles subdirectories)
    // Assumes include files are always at the root level in _includes
    const pathParts = window.location.pathname.split('/').filter(part => part !== ''); // Split and remove empty parts
    const isSubPage = pathParts.length > 0; // Any path part means it's not the root index.html
    const basePath = isSubPage ? '../' : './'; 

    // Include header and footer
    includeHTML('header-placeholder', basePath + '_includes/header.html');
    includeHTML('footer-placeholder', basePath + '_includes/footer.html');
}); 