// app.js
// Lógica JS para la webapp de Realidad Aumentada (puedes expandir aquí en el futuro) 

document.addEventListener('DOMContentLoaded', () => {
  const modelViewer = document.getElementById('main-model');
  const loader = document.getElementById('custom-loader');
  const infoCard = document.querySelector('.info-card');
  const arButton = document.getElementById('ar-launch');
  
  // === Elementos del botón de contacto ===
  const contactButton = document.getElementById('contact-btn');
  const contactMenu = document.getElementById('contact-menu');
  let isMenuOpen = false;

  // Funcionalidad del botón AR personalizado
  if (arButton && modelViewer) {
    arButton.addEventListener('click', () => {
      // Feedback visual inmediato
      arButton.style.transform = 'scale(0.95)';
      arButton.style.opacity = '0.8';
      
      // Restaurar después de 150ms
      setTimeout(() => {
        arButton.style.transform = '';
        arButton.style.opacity = '';
      }, 150);
      
      if (modelViewer.activateAR) {
        // Usar requestAnimationFrame para mejor rendimiento
        requestAnimationFrame(() => {
          modelViewer.activateAR();
        });
      }
    });
  }

  if (modelViewer && loader) {
    let modelLoaded = false;
    
    const updateLoaderVisibility = () => {
      if (modelLoaded) {
        loader.style.display = 'none';
      }
    };

    // Mostrar loader solo si el modelo no está cargado después de un breve delay
    setTimeout(() => {
      if (!modelViewer.loaded) {
        loader.style.display = 'block';
      }
    }, 100);

    modelViewer.addEventListener('load', () => {
      modelLoaded = true;
      updateLoaderVisibility();
    });

    modelViewer.addEventListener('progress', (event) => {
      if (event.detail.totalProgress === 1) {
        modelLoaded = true;
      }
      // Solo mostrar loader si el progreso es menor al 100%
      if (event.detail.totalProgress < 1) {
        loader.style.display = 'block';
      } else {
        updateLoaderVisibility();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && modelLoaded) {
        loader.style.display = 'none';
      }
    });
  }

  // === Lógica para el modal de video VR/XR ===
  const vrVideoModal = document.getElementById('vr-video-modal');
  const closeVrVideoModalBtn = document.getElementById('close-vr-video-modal');

  const openVrVideoModal = () => {
    if (vrVideoModal) {
      vrVideoModal.style.display = 'flex';
    }
  };

  const closeVrVideoModal = () => {
    if (vrVideoModal) {
      vrVideoModal.style.display = 'none';
      // Detener el video de Vimeo al cerrar
      const iframe = vrVideoModal.querySelector('iframe');
      if (iframe) {
        const player = new Vimeo.Player(iframe);
        player.pause();
      }
    }
  };

  if (closeVrVideoModalBtn) {
    closeVrVideoModalBtn.addEventListener('click', closeVrVideoModal);
  }

  // Cerrar modal al hacer clic en el fondo oscuro
  if (vrVideoModal) {
    vrVideoModal.addEventListener('click', (e) => {
      if (e.target === vrVideoModal) {
        closeVrVideoModal();
      }
    });
  }

  // UX: Ocultar/mostrar card y botón al manipular el modelo 3D
  let hideTimeout;
  let isManipulating = false;

  const hideUI = () => {
    if (infoCard) infoCard.classList.add('hide-ui');
    if (arButton) arButton.classList.add('hide-ui');
  };
  
  const showUI = () => {
    if (infoCard) infoCard.classList.remove('hide-ui');
    if (arButton) arButton.classList.remove('hide-ui');
  };

  if (modelViewer) {
    modelViewer.addEventListener('pointerdown', () => {
      isManipulating = true;
      hideUI();
      if (hideTimeout) clearTimeout(hideTimeout);
    });

    modelViewer.addEventListener('camera-change', () => {
      if (isManipulating) {
        hideUI();
        if (hideTimeout) clearTimeout(hideTimeout);
      }
    });

    const endManipulation = () => {
      isManipulating = false;
      if (hideTimeout) clearTimeout(hideTimeout);
      hideTimeout = setTimeout(showUI, 300);
    };

    modelViewer.addEventListener('pointerup', endManipulation);
    modelViewer.addEventListener('touchend', endManipulation);
  }

  // Detectar Android y añadir mejoras específicas
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid && modelViewer) {
    /* --- 1) Reproducir animación automáticamente en Android --- */
    modelViewer.setAttribute('autoplay', '');
    
    /* --- 2) Optimizar carga para Android --- */
    // Precargar el modelo en Android para mejor respuesta AR
    if (modelViewer.loaded) {
      modelViewer.setAttribute('preload', 'auto');
    }

    /* --- 2) Configurar acciones de botones --- */
    const waBtn = document.getElementById('ar-wa-btn');
    const infoBtn = document.getElementById('ar-info-btn');
    const infoModal = document.getElementById('info-modal');
    const closeModalBtn = document.getElementById('modal-close-button');

    if (waBtn) {
      waBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.open('https://wa.link/my0crk', '_blank');
      });
    }

    if (infoBtn) {
      infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // Mostrar modal de información
        if (infoModal) {
          infoModal.classList.add('show');
        }
      });
    }
    
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (infoModal) {
          infoModal.classList.remove('show');
        }
      });
    }
    
    // Cerrar modal al hacer clic fuera de él
    if (infoModal) {
      infoModal.addEventListener('click', (e) => {
        if (e.target === infoModal) {
          infoModal.classList.remove('show');
        }
      });
    }
  }

  // === Funcionalidad del botón de contacto ===
  if (contactButton && contactMenu) {

    // Toggle del menú al hacer clic en el botón
    contactButton.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Feedback visual inmediato
      contactButton.style.transform = 'scale(0.95)';
      contactButton.style.opacity = '0.8';
      
      // Restaurar después de 150ms
      setTimeout(() => {
        contactButton.style.transform = '';
        contactButton.style.opacity = '';
      }, 150);

      // Toggle del menú
      if (isMenuOpen) {
        contactMenu.classList.remove('show');
        isMenuOpen = false;
      } else {
        contactMenu.classList.add('show');
        isMenuOpen = true;
      }
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (!contactButton.contains(e.target) && !contactMenu.contains(e.target)) {
        contactMenu.classList.remove('show');
        isMenuOpen = false;
      }
    });

    // Funcionalidad de las opciones del menú
    const contactOptions = contactMenu.querySelectorAll('.contact-option');
    
    contactOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = option.getAttribute('data-action');
        
        // Feedback visual
        option.style.transform = 'scale(0.95)';
        setTimeout(() => {
          option.style.transform = '';
        }, 150);

        // Ejecutar acción según el tipo
        switch (action) {
          case 'whatsapp':
            window.open('https://wa.link/my0crk', '_blank');
            break;
          case 'email':
            window.location.href = 'mailto:info@lat-ar.com?subject=Consulta sobre Brazo Robótico&body=Hola, me gustaría obtener más información sobre sus servicios.';
            break;
          case 'website':
            window.open('https://lat-ar.com', '_blank');
            break;
          case 'show-vr':
            openVrVideoModal();
            break;
        }

        // Cerrar menú después de la acción
        setTimeout(() => {
          contactMenu.classList.remove('show');
          isMenuOpen = false;
        }, 300);
      });

      // Efecto hover mejorado
      option.addEventListener('mouseenter', () => {
        option.style.transform = 'translateX(2px)';
      });

      option.addEventListener('mouseleave', () => {
        option.style.transform = '';
      });
    });
  }

  // Cerrar menú de contacto al manipular el modelo 3D
  if (modelViewer && contactMenu) {
    modelViewer.addEventListener('pointerdown', () => {
      contactMenu.classList.remove('show');
      isMenuOpen = false;
    });
  }
}); 