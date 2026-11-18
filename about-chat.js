/* SkyCast246 About page: floating Copilot assistant controls.
   This file is separate from script.js because the About page has no GTM controls. so out of my control */
(() => {
    const windowPanel = document.getElementById("assistantWindow");
    const toggle = document.getElementById("chatToggle");
    const close = document.getElementById("closeChat");

    function openChat() {
        windowPanel.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        document.getElementById("assistantHelp").hidden = true;
        close.focus();
    }

    function closeChat() {
        windowPanel.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
    }

    toggle.addEventListener("click", () => windowPanel.hidden ? openChat() : closeChat());
    close.addEventListener("click", closeChat);
    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && !windowPanel.hidden) closeChat();
    });
})();
