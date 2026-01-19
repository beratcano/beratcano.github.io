(function() {
    'use strict';

    const THEME_KEY = 'portfolio-theme';
    const DARK = 'dark';
    const LIGHT = 'light';

    function getStoredTheme() {
        return localStorage.getItem(THEME_KEY);
    }

    function applyTheme(theme) {
        if (theme === DARK) {
            document.documentElement.setAttribute('data-theme', DARK);
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    }

    // Apply light theme by default (ignore system preference)
    const storedTheme = getStoredTheme();
    applyTheme(storedTheme || LIGHT);

    // Set up toggle - wait for header to be loaded dynamically
    function setupToggle() {
        const toggle = document.getElementById('theme-toggle');
        if (!toggle || toggle.hasAttribute('data-initialized')) return;

        toggle.setAttribute('data-initialized', 'true');

        toggle.addEventListener('click', function() {
            const isDark = document.documentElement.getAttribute('data-theme') === DARK;
            const newTheme = isDark ? LIGHT : DARK;

            applyTheme(newTheme);
            localStorage.setItem(THEME_KEY, newTheme);
        });
    }

    // Listen for header being loaded (from include.js)
    document.addEventListener('includeLoaded', function(e) {
        if (e.detail === 'header-placeholder') {
            setupToggle();
        }
    });

    // Fallback: check periodically in case event was missed
    let attempts = 0;
    const checkInterval = setInterval(function() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            setupToggle();
            clearInterval(checkInterval);
        }
        if (++attempts > 50) clearInterval(checkInterval);
    }, 100);
})();
