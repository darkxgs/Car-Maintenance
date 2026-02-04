/**
 * Simple Mobile Menu Toggle
 * Lightweight script to handle mobile dropdown menu
 */

(function () {
    'use strict';

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        const toggle = document.getElementById('mobileMenuToggle');
        const dropdown = document.getElementById('mobileMenuDropdown');

        if (!toggle || !dropdown) return;

        // Toggle dropdown on button click
        toggle.addEventListener('click', function (e) {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.mobile-menu-bar')) {
                dropdown.classList.remove('show');
            }
        });

        // Close dropdown when clicking a link
        const links = dropdown.querySelectorAll('a');
        links.forEach(function (link) {
            link.addEventListener('click', function () {
                dropdown.classList.remove('show');
            });
        });
    }
})();
