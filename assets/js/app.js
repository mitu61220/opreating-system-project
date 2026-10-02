(() => {
  const root = document.documentElement;
  const saved = localStorage.getItem("osnexus-theme");
  if (saved === "light") root.classList.add("light");
  const themeBtn = document.querySelector("#themeBtn");
  if (themeBtn) themeBtn.addEventListener("click", () => {
    root.classList.toggle("light");
    localStorage.setItem("osnexus-theme", root.classList.contains("light") ? "light" : "dark");
  });
  const sidebar = document.querySelector("#sidebar");
  const overlay = document.querySelector("#mobileOverlay");
  const menuBtn = document.querySelector("#menuBtn");
  const closeMenu = () => { sidebar?.classList.remove("open"); overlay?.classList.remove("show"); };
  menuBtn?.addEventListener("click", () => { sidebar?.classList.add("open"); overlay?.classList.add("show"); });
  overlay?.addEventListener("click", closeMenu);
  document.querySelectorAll(".nav-link").forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      document.querySelector("input, textarea")?.focus();
    }
  });
})();