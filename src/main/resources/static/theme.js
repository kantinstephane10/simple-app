(function () {
    const root = document.documentElement;
    const toggle = document.getElementById('theme-toggle');

    function currentTheme() {
        return root.getAttribute('data-theme')
            || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }

    function updateLabel() {
        if (!toggle) return;
        toggle.textContent = currentTheme() === 'dark' ? 'Light mode' : 'Dark mode';
    }

    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') {
        root.setAttribute('data-theme', stored);
    }
    updateLabel();

    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = currentTheme() === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            updateLabel();
        });
    }
})();
