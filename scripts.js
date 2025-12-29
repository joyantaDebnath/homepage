(function () {
  // -----------------------------
  // Mobile nav toggle
  // -----------------------------
  const toggleBtn = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector("#nav-links");

  function setNavCollapsed(collapsed) {
    navLinks.dataset.collapsed = collapsed ? "true" : "false";
    toggleBtn.setAttribute("aria-expanded", collapsed ? "false" : "true");
  }

  if (toggleBtn && navLinks) {
    setNavCollapsed(true);

    toggleBtn.addEventListener("click", () => {
      const collapsed = navLinks.dataset.collapsed === "true";
      setNavCollapsed(!collapsed);
    });

    // Close menu when clicking a link (mobile)
    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 859px)").matches) setNavCollapsed(true);
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!window.matchMedia("(max-width: 859px)").matches) return;
      const isInside = navLinks.contains(e.target) || toggleBtn.contains(e.target);
      if (!isInside) setNavCollapsed(true);
    });
  }

  // -----------------------------
  // Active nav link on scroll
  // -----------------------------
  const sections = Array.from(document.querySelectorAll("main section[id]"));
  const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));

  function setActiveLink(id) {
    navAnchors.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${id}`;
      a.classList.toggle("active", isActive);
    });
  }

  if (sections.length && "IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        // Pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActiveLink(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5, 0.65] }
    );

    sections.forEach((s) => activeObserver.observe(s));
  }

  // -----------------------------
  // Reveal animations
  // -----------------------------
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  // -----------------------------
  // Publications: year + venue filters
  // -----------------------------
  const pubList = document.querySelector("#pub-list");
  const pubCards = Array.from(document.querySelectorAll(".pub-card"));
  const yearSelect = document.querySelector("#filter-year");
  const venueSelect = document.querySelector("#filter-venue");
  const resetBtn = document.querySelector("#filter-reset");
  const emptyState = document.querySelector("#pub-empty");

  function uniqSorted(values, numeric = false) {
    const arr = Array.from(new Set(values.filter(Boolean)));
    if (numeric) return arr.sort((a, b) => Number(b) - Number(a));
    return arr.sort((a, b) => a.localeCompare(b));
  }

  function populateFilters() {
    if (!yearSelect || !venueSelect) return;

    const years = uniqSorted(pubCards.map((c) => c.dataset.year), true);
    const venues = uniqSorted(pubCards.map((c) => c.dataset.venue));

    years.forEach((y) => {
      const opt = document.createElement("option");
      opt.value = y;
      opt.textContent = y;
      yearSelect.appendChild(opt);
    });

    venues.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      venueSelect.appendChild(opt);
    });
  }

  function applyFilters() {
    const y = yearSelect?.value ?? "all";
    const v = venueSelect?.value ?? "all";

    let shown = 0;
    pubCards.forEach((card) => {
      const matchYear = y === "all" || card.dataset.year === y;
      const matchVenue = v === "all" || card.dataset.venue === v;
      const show = matchYear && matchVenue;
      card.hidden = !show;
      if (show) shown += 1;
    });

    if (emptyState) emptyState.hidden = shown !== 0;
  }

  function resetFilters() {
    if (yearSelect) yearSelect.value = "all";
    if (venueSelect) venueSelect.value = "all";
    applyFilters();
  }

  if (pubCards.length && yearSelect && venueSelect) {
    populateFilters();
    applyFilters();

    yearSelect.addEventListener("change", applyFilters);
    venueSelect.addEventListener("change", applyFilters);
    resetBtn?.addEventListener("click", resetFilters);
  }
})();
