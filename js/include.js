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
                    document.dispatchEvent(new CustomEvent('includeLoaded', { detail: elementId }));

                    // Init components after load
                    if (elementId === 'header-placeholder') initNav();
                    if (elementId === 'footer-placeholder') initScrollToTop();
                })
                .catch(error => {
                    console.error('Error including HTML:', error);
                    element.innerHTML = `<p style="color:red;">Error loading ${elementId}.</p>`;
                });
        }
    }

    // Add main-content id for skip link
    const main = document.querySelector('main');
    if (main) main.id = 'main-content';

    // Mobile nav toggle
    function initNav() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                menu.classList.toggle('open');
            });
            // Close menu on link click
            menu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    toggle.classList.remove('active');
                    menu.classList.remove('open');
                });
            });
        }
    }

    // Scroll to top button
    function initScrollToTop() {
        const btn = document.getElementById('scroll-to-top');
        if (btn) {
            window.addEventListener('scroll', () => {
                btn.classList.toggle('visible', window.scrollY > 300);
            });
            btn.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    // Always use absolute paths from root
    includeHTML('header-placeholder', '/includes/header.html');
    includeHTML('footer-placeholder', '/includes/footer.html');
});
