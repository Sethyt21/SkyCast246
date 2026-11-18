/* Shared theme switcher for index.html and about.html.
   Stores only the selected appearance in localStorage.
    so keep everything together seth and others
   */
(function () {
    const key = "skycast246-theme";
    let stored = null;
    try { stored = localStorage.getItem(key); } catch (_) { /* Storage may be disabled. */ }
    const preferredDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    let dark = stored === "dark" || (stored !== "light" && preferredDark);

    function applyTheme() {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
        document.querySelectorAll("[data-theme-toggle]").forEach(button => {
            button.textContent = dark ? "☀️ Light mode" : "🌙 Dark mode";
            button.setAttribute("aria-pressed", String(dark));
            button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
        });
    }
    applyTheme();
    document.addEventListener("DOMContentLoaded", () => {
        applyTheme();
        document.querySelectorAll("[data-theme-toggle]").forEach(button => {
            button.addEventListener("click", () => {
                dark = !dark;
                try { localStorage.setItem(key, dark ? "dark" : "light"); } catch (_) { /* Theme still works for this visit. */ }
                applyTheme();
            });
        });
    });
})();
