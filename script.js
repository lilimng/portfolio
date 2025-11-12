// ===== preview projets sur la home =====
const links = document.querySelectorAll('.preview-link');
const previewBox = document.getElementById('preview-box');
const previewImg = document.getElementById('preview-img');

links.forEach(link => {
  link.addEventListener('mouseenter', e => {
    const imgSrc = link.getAttribute('data-preview');
    previewImg.src = imgSrc;
    previewBox.style.display = 'block';
  });

  link.addEventListener('mousemove', e => {
   previewBox.style.left = e.pageX + 30 + 'px';
   previewBox.style.top = e.pageY + 'px';
   previewBox.style.transform = 'translateY(-100%)'; 
  });

  link.addEventListener('mouseleave', () => {
    previewBox.style.display = 'none';
    previewImg.src = '';
  });
});


// ===== preview projets sur la page projets =====
const projets = document.querySelectorAll('.preview-projet');
const previewDisplay = document.getElementById('preview-display');
const previewLogo = document.getElementById('preview-logo');

projets.forEach(item => {
  item.addEventListener('mouseenter', () => {
    const imgSrc = item.getAttribute('data-preview');
    previewLogo.src = imgSrc;
    previewDisplay.style.display = 'block';
  });

  item.addEventListener('mousemove', e => {
    previewDisplay.style.left = e.pageX + 50 + 'px';
    previewDisplay.style.top = e.pageY + 25 + 'px';
    previewDisplay.style.transform = 'translateY(-100%)';
  });

  item.addEventListener('mouseleave', () => {
    previewDisplay.style.display = 'none';
    previewLogo.src = '';
  });
});





// ===== floating back button =====
document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('back-btn');
  let isVisible = false;
  let timeout;

  function showButton() {
    if (!isVisible) {
      backBtn.style.opacity = '1';
      backBtn.style.pointerEvents = 'auto';
      isVisible = true;
    }
  }

  function hideButton() {
    if (isVisible) {
      backBtn.style.opacity = '0';
      backBtn.style.pointerEvents = 'none';
      isVisible = false;
    }
  }

  function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(hideButton, 1200);
  }

  window.addEventListener('mousemove', showButton);
  window.addEventListener('mousemove', resetTimeout);
  window.addEventListener('scroll', showButton);
  window.addEventListener('scroll', resetTimeout);

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


// ===== back to previous =====
const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
  window.history.back();
});




// ===== infinite canvas =====
const viewport = document.querySelector(".canvas-container");
const content = document.getElementById("interactive-canvas");

if (viewport && content) {
  let posX = 0, posY = 0;
  let scale = 1;

  // --- mousemove ---
  viewport.addEventListener("mousedown", e => {
    let startX = e.clientX - posX;
    let startY = e.clientY - posY;

    const move = evt => {
      posX = evt.clientX - startX;
      posY = evt.clientY - startY;
      content.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  });

// --- wheel and trackpad separation (version fluide) ---
viewport.addEventListener("wheel", e => {
  e.preventDefault();

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Détection : petit delta → trackpad, sinon → souris
  const isTrackpad = Math.abs(e.deltaY) < 50 && Math.abs(e.deltaX) < 50;

  // === CAS 1 : Zoom (molette ou pinch) ===
  if (!isTrackpad || e.ctrlKey) {
    // Zoom exponentiel plus fluide
    const zoomFactor = Math.pow(1.0035, -e.deltaY);
    const newScale = Math.min(Math.max(0.2, scale * zoomFactor), 3);

    const rect = viewport.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    const zoomPointX = (offsetX - posX) / scale;
    const zoomPointY = (offsetY - posY) / scale;

    posX -= zoomPointX * (newScale - scale);
    posY -= zoomPointY * (newScale - scale);

    scale = newScale;
  }

  // === CAS 2 : Pan (trackpad normal) ===
  else {
    posX -= e.deltaX;
    posY -= e.deltaY;
  }

  content.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
}, { passive: false });


  // --- trackpad zoom ---
  let gestureStartScale = 1;
  viewport.addEventListener("gesturestart", e => { gestureStartScale = scale; });
  viewport.addEventListener("gesturechange", e => {
    const newScale = gestureStartScale * e.scale;
    const mouseX = viewport.offsetWidth / 2;
    const mouseY = viewport.offsetHeight / 2;

    posX -= (mouseX - posX) * (newScale / scale - 1);
    posY -= (mouseY - posY) * (newScale / scale - 1);

    scale = Math.min(Math.max(0.1, newScale), 5);
    content.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  });

  // --- reset ---
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      posX = 0;
      posY = 0;
      scale = 1;
      content.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
    });
  }
}

// ===== expand button =====
const expandBtn = document.getElementById("expand-btn");
const projectRight = document.querySelector(".project-right");
const projectLeft = document.querySelector(".project-left");
const infoBtn = document.getElementById("info-btn");

let isExpanded = false;

if (expandBtn && projectRight && projectLeft) {
  expandBtn.addEventListener("click", () => {
    if (!isExpanded) {
      // go full screen
      projectRight.style.width = "100%";
      projectRight.style.transition = "width 0.6s ease";
      projectLeft.style.width = "0%";
      projectLeft.style.opacity = "0";
      projectLeft.style.pointerEvents = "none";

      if (infoBtn) infoBtn.style.display = "inline-flex";

      isExpanded = true;
    } else {
      // width change
      projectRight.style.width = "70%";
      projectRight.style.transition = "width 0.6s ease";
      projectLeft.style.width = "30%";
      projectLeft.style.opacity = "1";
      projectLeft.style.pointerEvents = "auto";

      if (infoBtn) infoBtn.style.display = "none";

      isExpanded = false;
    }
    
  });
}


// ===== projects tab =====
document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const projects = document.querySelectorAll('.project-item');

  function filterProjects(category) {
    projects.forEach(project => {
      project.style.display =
        project.dataset.category === category ? 'flex' : 'none';
    });
  }

  // 1 : Vérifier si un tab avait été sauvegardé
  const savedCategory = localStorage.getItem('activeTabCategory');

  // Si oui → appliquer celui sauvegardé
  if (savedCategory) {
    const tabToActivate = document.querySelector(`.tab[data-category="${savedCategory}"]`);
    if (tabToActivate) {
      tabs.forEach(t => t.classList.remove('active'));
      tabToActivate.classList.add('active');
      filterProjects(savedCategory);
    }
  } else {
    // Sinon → utiliser le tab actif dans le HTML
    const activeTab = document.querySelector('.tab.active');
    if (activeTab) {
      filterProjects(activeTab.dataset.category);
    }
  }

  // 2 : Au clic → activer + filtrer + sauvegarder
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.category;
      filterProjects(category);

      // Sauvegarde du tab choisi
      localStorage.setItem('activeTabCategory', category);
    });
  });
});





// ===== unlock scroll and transition to project pt2 =====
const moreBtn = document.getElementById('more-btn');
const projExtended = document.getElementById('project-extended');

if (moreBtn && projExtended) {
  moreBtn.addEventListener('click', () => {
    // unlock scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // unlock project pt2 visibility
    projExtended.classList.add('visible');

    // scroll to project pt2
    setTimeout(() => {
      projExtended.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  });
}

// ===== info-btn agit comme more-btn =====
const infoBtn2 = document.getElementById('info-btn');
const projExtended2 = document.getElementById('project-extended');

if (infoBtn2 && projExtended2) {
  infoBtn2.addEventListener('click', () => {
    // unlock scroll
    document.body.style.overflow = 'auto';
    document.documentElement.style.overflow = 'auto';

    // unlock project pt2 visibility
    projExtended2.classList.add('visible');

    // scroll to project pt2
    setTimeout(() => {
      projExtended2.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  });
}










/* MORE */
// ===================== TAB SELECTOR =====================
const tabToggle = document.getElementById("tab-toggle");
const tabMenu = document.getElementById("tab-menu");
const tabOptions = document.querySelectorAll(".tab-option");
const allPhotos = document.querySelectorAll("#interactive-canvas .photo");

let currentGroup = "maquettes"; // valeur initiale

// Fonction pour mettre à jour l'affichage des images selon le groupe actif
function updatePhotos(group) {
  allPhotos.forEach(img => {
    img.style.display = img.dataset.group === group ? "block" : "none";
  });
}

// Fonction pour n'afficher que les autres options dans le dropdown
function updateDropdown() {
  tabOptions.forEach(option => {
    option.style.display = option.dataset.group === currentGroup ? "none" : "block";
  });
}

// Fonction pour reset le canvas à chaque changement de tab
function resetCanvasView() {
  const content = document.getElementById("interactive-canvas");
  if (!content) return;
  content.style.transition = "transform 0.4s ease";
  content.style.transform = "translate(0px, 0px) scale(1)";
  setTimeout(() => (content.style.transition = ""), 400);
}

tabToggle.addEventListener("click", () => {
  updateDropdown();
  tabMenu.classList.toggle("hidden");
});

tabOptions.forEach(option => {
  option.addEventListener("click", () => {
    const group = option.dataset.group;
    currentGroup = group;

    // Met à jour le texte du bouton
    tabToggle.textContent = `${option.textContent} ▾`;

    // Ferme le menu et met à jour les images
    tabMenu.classList.add("hidden");
    updatePhotos(group);

    // Reset automatique du canvas à chaque changement
    resetCanvasView();
  });
});

// Initialisation au chargement
updatePhotos(currentGroup);
updateDropdown();

// ----------- FERMETURE DU DROPDOWN SI CLIC AILLEURS OU SUR BOUTONS -----------
(function() {
  const tabSelector = document.querySelector('.tab-selector');
  const expandBtn = document.getElementById('expand-btn');
  const resetBtn = document.getElementById('reset-btn');
  const infoBtn = document.getElementById('info-btn');

  if (!tabSelector || !tabToggle || !tabMenu) return;

  function closeTabMenu() {
    tabMenu.classList.add('hidden');
    tabMenu.classList.remove('active');
  }

  function openTabMenu() {
    tabMenu.classList.remove('hidden');
    tabMenu.classList.add('active');
  }

  // Toggle du menu
  tabToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (tabMenu.classList.contains('hidden') || !tabMenu.classList.contains('active')) {
      openTabMenu();
    } else {
      closeTabMenu();
    }
  });

  // Fermer si clic à l’extérieur du sélecteur
  document.addEventListener('click', (e) => {
    if (!tabSelector.contains(e.target)) {
      closeTabMenu();
    }
  });

  // Fermer aussi si clic sur expand, reset ou info
  [expandBtn, resetBtn, infoBtn].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', closeTabMenu);
  });
})();


// toggle
const toggleBtn = document.getElementById('role-toggle');
const toggleLabel = toggleBtn.querySelector('.toggle-label');
const toggleImage = document.getElementById('toggle-image');

let isSeller = true; // état initial

toggleBtn.addEventListener('click', () => {
  isSeller = !isSeller;

  if (isSeller) {
    toggleBtn.classList.remove('buyer');
    toggleLabel.textContent = 'Vendeur';
    toggleImage.src = '../../img/vinted-vendeur.webp';
    toggleImage.alt = 'Vinted vendeur';
  } else {
    toggleBtn.classList.add('buyer');
    toggleLabel.textContent = 'Acheteur';
    toggleImage.src = '../../img/vinted-acheteur.webp';
    toggleImage.alt = 'Vinted acheteur';
  }
});


const canvasContainer = document.querySelector('.canvas-container');
let isHoveringCanvas = false;

// détecte quand la souris est sur le canvas
if (canvasContainer) {
  canvasContainer.addEventListener('mouseenter', () => {
    isHoveringCanvas = true;
  });

  canvasContainer.addEventListener('mouseleave', () => {
    isHoveringCanvas = false;
  });

  // bloque le swipe gauche/droite sur trackpad uniquement quand on est dessus
  window.addEventListener('wheel', (e) => {
    if (isHoveringCanvas && Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
    }
  }, { passive: false });
}


document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const projects = document.querySelectorAll('.project-item');

  function filterProjects(category) {
    projects.forEach(project => {
      project.style.display =
        project.dataset.category === category ? 'flex' : 'none';
    });
  }

  // ➜ 1 : Filtrer au chargement selon le tab actif
  const activeTab = document.querySelector('.tab.active');
  if (activeTab) {
    filterProjects(activeTab.dataset.category);
  }

  // ➜ 2 : Filtrer au clic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      filterProjects(tab.dataset.category);
    });
  });
});
