/* ===== preview projets sur la home ===== */
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


/* ===== BOUTON RETOUR FLOTTANT BAS-DROIT ===== */
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


/* ===== RETOUR PAGE PRECEDENTE ===== */
const backBtn = document.getElementById('back-btn');

backBtn.addEventListener('click', () => {
  window.history.back(); // retourne à la page précédente
});




// === Canvas Infini ===
const viewport = document.querySelector(".canvas-container");
const content = document.getElementById("interactive-canvas");

if (viewport && content) {
  let posX = 0, posY = 0;
  let scale = 1;

  // --- PAN souris ---
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

  // --- PAN & ZOOM molette / trackpad ---
  viewport.addEventListener("wheel", e => {
    e.preventDefault();
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (e.ctrlKey) {
      const zoomFactor = Math.pow(1.005, -e.deltaY);
      const newScale = Math.min(Math.max(0.1, scale * zoomFactor), 5);

      posX -= (mouseX - posX) * (newScale / scale - 1);
      posY -= (mouseY - posY) * (newScale / scale - 1);

      scale = newScale;
    } else {
      posX -= e.deltaX;
      posY -= e.deltaY;
    }

    content.style.transform = `translate(${posX}px, ${posY}px) scale(${scale})`;
  }, { passive: false });

  // --- Pinch zoom Safari ---
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

  // --- Reset ---
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

// === Bouton Agrandir / Réduire ===
const expandBtn = document.getElementById("expand-btn");
const projectRight = document.querySelector(".project-right");
const projectLeft = document.querySelector(".project-left");
const infoBtn = document.getElementById("info-btn");

let isExpanded = false;

if (expandBtn && projectRight && projectLeft) {
  expandBtn.addEventListener("click", () => {
    if (!isExpanded) {
      // Passe en plein écran
      projectRight.style.width = "100%";
      projectRight.style.transition = "width 0.6s ease";
      projectLeft.style.width = "0%";
      projectLeft.style.opacity = "0";
      projectLeft.style.pointerEvents = "none";

      if (infoBtn) infoBtn.style.display = "inline-flex";

      isExpanded = true;
    } else {
      // Reviens à 70% / 30%
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

// === Popup info ===
const infoPopup = document.getElementById("info-popup");
const closePopup = document.getElementById("close-popup");

if (infoBtn && infoPopup && closePopup) {
  infoBtn.addEventListener('click', e => {
    e.stopPropagation();
    infoPopup.style.display = 'block';
  });

  closePopup.addEventListener('click', () => infoPopup.style.display = 'none');

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') infoPopup.style.display = 'none';
  });
}



