/**
 * Hogar San Lucas (HSL) - Master Logic
 * Features:
 * - Menú responsive adaptable y fluido
 * - Herramienta de accesibilidad rápida (A- / A / A+)
 * - Cotizador interactivo en 3 pasos con cálculo estimado y envío WhatsApp
 * - Ubicación privilegiada interactiva en Medellín con trazado vectorial SVG y cálculo de tiempos
 * - Agendador de visitas en vivo con calendario interactivo y franjas horarias
 * - Filtros de instalaciones
 * - Flashcard interactivo: 5 preguntas
 * - Scroll Reveal con IntersectionObserver
 * - Parallax sutil hero y contenedores
 * - Botón discreto de WhatsApp y formularios con notificaciones toast
 */

document.addEventListener('DOMContentLoaded', () => {
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =========================================================================
  // 1. MOBILE MENU TOGGLE CON BLOQUEO DE SCROLL
  // =========================================================================
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggleBtn && navLinks) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('active');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // =========================================================================
  // 2. HERRAMIENTA DE ACCESIBILIDAD RÁPIDA (A- / A / A+)
  // =========================================================================
  const a11yDec = document.getElementById('a11yDec');
  const a11yReset = document.getElementById('a11yReset');
  const a11yInc = document.getElementById('a11yInc');
  const a11yButtons = [a11yDec, a11yReset, a11yInc];

  const setFontSize = (size) => {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('hsl-font-size', size);
    a11yButtons.forEach(btn => {
      if (!btn) return;
      btn.classList.remove('active');
      if (
        (size === 'small' && btn === a11yDec) ||
        (size === 'normal' && btn === a11yReset) ||
        ((size === 'large' || size === 'larger') && btn === a11yInc)
      ) {
        btn.classList.add('active');
      }
    });
  };

  const savedSize = localStorage.getItem('hsl-font-size') || 'normal';
  setFontSize(savedSize);

  if (a11yDec) a11yDec.addEventListener('click', () => setFontSize('small'));
  if (a11yReset) a11yReset.addEventListener('click', () => setFontSize('normal'));
  if (a11yInc) {
    a11yInc.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-font-size');
      setFontSize(current === 'large' ? 'larger' : 'large');
    });
  }

  // =========================================================================
  // 3. SCROLL REVEAL CON INTERSECTION OBSERVER
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // =========================================================================
  // 4. PARALLAX SUTIL HERO & CONTENEDOR
  // =========================================================================
  const heroSection = document.querySelector('.hero-clean-section');
  const parallaxNodes = document.querySelectorAll('[data-parallax-depth]');
  const scrollParallaxNodes = document.querySelectorAll('[data-scroll-parallax]');

  if (heroSection && parallaxNodes.length > 0 && !isReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const relX = (e.clientX - rect.left) - rect.width / 2;
      const relY = (e.clientY - rect.top) - rect.height / 2;

      parallaxNodes.forEach(node => {
        const depth = parseFloat(node.dataset.parallaxDepth) || 0.02;
        const baseTransform = node.dataset.baseTransform || '';
        const moveX = relX * depth;
        const moveY = relY * depth;
        node.style.transform = `${baseTransform} translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      parallaxNodes.forEach(node => {
        const baseTransform = node.dataset.baseTransform || '';
        node.style.transform = baseTransform;
      });
    });
  }

  if (scrollParallaxNodes.length > 0 && !isReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      scrollParallaxNodes.forEach(node => {
        const speed = parseFloat(node.dataset.scrollParallax) || 0.05;
        node.style.transform = `translate3d(0, ${scrolled * speed}px, 0)`;
      });
    }, { passive: true });
  }

  // =========================================================================
  // 5. UBICACIÓN PRIVILEGIADA EN MEDELLÍN (TARJETAS CON TIEMPOS)
  // =========================================================================
  const travelTimes = {
    car: {
      tesoro: '12 min',
      santafe: '15 min',
      clinicas: '14 min',
      pablo: '22 min',
      aeropuerto: '35 min'
    },
    ambulance: {
      tesoro: '8 min',
      santafe: '11 min',
      clinicas: '9 min',
      pablo: '15 min',
      aeropuerto: '25 min'
    }
  };

  let currentMapMode = 'car';

  const updateMapTimes = () => {
    const times = travelTimes[currentMapMode];
    for (const [hub, time] of Object.entries(times)) {
      const pill = document.getElementById(`time-${hub}`);
      if (pill) pill.textContent = time;
    }
  };

  // Clic en tarjetas para estado activo visual
  document.querySelectorAll('.route-hub-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.route-hub-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  // Conmutador de Modo (Automóvil vs Ambulancia)
  document.querySelectorAll('.mode-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-pill-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');
      currentMapMode = btn.dataset.mode;
      updateMapTimes();
    });
  });

  updateMapTimes();

  // =========================================================================
  // 6. COTIZADOR / ASESOR INTERACTIVO EN 3 PASOS (WIZARD)
  // =========================================================================
  const wizardState = {
    autonomia: 'independiente',
    modalidad: 'permanente',
    habitacion: 'suite_privada'
  };

  const labelsMap = {
    autonomia: {
      independiente: 'Autónomo / Activo',
      asistencia_moderada: 'Asistencia Moderada',
      cuidado_integral: 'Cuidado Integral 24/7'
    },
    modalidad: {
      permanente: 'Residencia Permanente',
      centro_dia: 'Club Centro Día Senior',
      temporal: 'Estancia Temporal / Respiro'
    },
    habitacion: {
      suite_privada: 'Suite Privada con Balcón',
      individual_estandar: 'Habitación Individual Estándar',
      compartida_doble: 'Habitación Compartida (2 camas)'
    }
  };

  document.querySelectorAll('.wizard-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const field = card.dataset.field;
      const value = card.dataset.value;
      if (!field || !value) return;

      wizardState[field] = value;

      const parentGrid = card.closest('.wizard-options-grid');
      parentGrid.querySelectorAll('.wizard-option-card').forEach(c => {
        c.classList.remove('selected');
        const pill = c.querySelector('.wizard-select-pill');
        if (pill) pill.textContent = 'Seleccionar';
      });

      card.classList.add('selected');
      const activePill = card.querySelector('.wizard-select-pill');
      if (activePill) activePill.textContent = 'Seleccionado';
    });
  });

  const switchWizardStep = (stepNumber) => {
    document.querySelectorAll('.wizard-step-tab').forEach(tab => {
      const tabStep = parseInt(tab.dataset.step);
      tab.classList.remove('active');
      if (tabStep === stepNumber) {
        tab.classList.add('active');
      } else if (tabStep < stepNumber) {
        tab.classList.add('completed');
      }
    });

    document.querySelectorAll('.wizard-panel').forEach(panel => panel.classList.remove('active'));
    const targetPanel = document.getElementById(`wizardPanel${stepNumber}`);
    if (targetPanel) targetPanel.classList.add('active');
  };

  document.querySelectorAll('.wizard-step-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const step = parseInt(tab.dataset.step);
      switchWizardStep(step);
    });
  });

  document.querySelectorAll('.btn-wizard-next, .btn-outline-back').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = parseInt(btn.dataset.goto);
      if (targetStep) switchWizardStep(targetStep);
    });
  });

  const btnCalculatePlan = document.getElementById('btnCalculatePlan');
  const wizardPanelResult = document.getElementById('wizardPanelResult');
  const resultPlanTitle = document.getElementById('resultPlanTitle');
  const resultPlanDesc = document.getElementById('resultPlanDesc');
  const btnSendQuoteWhatsapp = document.getElementById('btnSendQuoteWhatsapp');
  const btnRestartWizard = document.getElementById('btnRestartWizard');

  if (btnCalculatePlan) {
    btnCalculatePlan.addEventListener('click', () => {
      document.querySelectorAll('.wizard-panel').forEach(p => p.classList.remove('active'));
      if (wizardPanelResult) wizardPanelResult.classList.add('active');

      const autText = labelsMap.autonomia[wizardState.autonomia];
      const modText = labelsMap.modalidad[wizardState.modalidad];
      const habText = labelsMap.habitacion[wizardState.habitacion];

      let title = 'Plan Residencia Plena & Afecto';
      let desc = 'Combinación óptima entre suite privada y acompañamiento de salud continuo.';

      if (wizardState.modalidad === 'centro_dia') {
        title = 'Plan Club Senior Centro Día';
        desc = 'Jornada diurna con estimulación neurocognitiva, almuerzo gourmet y tardes de sol.';
      } else if (wizardState.modalidad === 'temporal') {
        title = 'Plan Recuperación & Descanso Temporal';
        desc = 'Cuidado médico integral para post-operatorios o respiro familiar con estadía flexible.';
      } else if (wizardState.autonomia === 'cuidado_integral') {
        title = 'Plan Cuidado Especializado 24/7';
        desc = 'Máximo soporte de enfermería permanente, protocolos clínicos y calidez de hogar.';
      }

      if (resultPlanTitle) resultPlanTitle.textContent = title;
      if (resultPlanDesc) resultPlanDesc.textContent = desc;

      if (btnSendQuoteWhatsapp) {
        const textMsg = encodeURIComponent(
          `¡Hola Hogar San Lucas! 🌿 Realicé la cotización en su web y me gustaría recibir la propuesta formal para:\n` +
          `• Nivel de autonomía: ${autText}\n` +
          `• Modalidad: ${modText}\n` +
          `• Habitación elegida: ${habText}\n` +
          `¿Podrían confirmarme tarifas y disponibilidad? Muchas gracias.`
        );
        btnSendQuoteWhatsapp.href = `https://wa.me/573000000000?text=${textMsg}`;
      }
    });
  }

  if (btnRestartWizard) {
    btnRestartWizard.addEventListener('click', () => {
      switchWizardStep(1);
    });
  }

  // =========================================================================
  // 7. AGENDADOR DE VISITAS EN VIVO (CALENDARIO & HORAS)
  // =========================================================================
  const calendarDaysGrid = document.getElementById('calendarDaysGrid');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calPrevMonth = document.getElementById('calPrevMonth');
  const calNextMonth = document.getElementById('calNextMonth');
  const ticketDateText = document.getElementById('ticketDateText');
  const ticketTimeText = document.getElementById('ticketTimeText');
  const btnConfirmScheduledVisit = document.getElementById('btnConfirmScheduledVisit');

  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  let currentCalDate = new Date();
  let selectedCalDay = currentCalDate.getDate() + 1;
  let selectedTimeSlot = '09:30 AM';

  const renderCalendar = () => {
    if (!calendarDaysGrid || !calMonthLabel) return;
    const year = currentCalDate.getFullYear();
    const month = currentCalDate.getMonth();

    calMonthLabel.textContent = `${months[month]} ${year}`;
    calendarDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const adjustedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < adjustedFirstDay; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day-btn empty';
      calendarDaysGrid.appendChild(emptyDiv);
    }

    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.className = 'calendar-day-btn has-slot';
      dayBtn.textContent = d;

      if (d === selectedCalDay) {
        dayBtn.classList.add('selected');
      }

      dayBtn.addEventListener('click', () => {
        calendarDaysGrid.querySelectorAll('.calendar-day-btn').forEach(b => b.classList.remove('selected'));
        dayBtn.classList.add('selected');
        selectedCalDay = d;

        const dayName = new Date(year, month, d).toLocaleDateString('es-CO', { weekday: 'long' });
        const capitalized = dayName.charAt(0).toUpperCase() + dayName.slice(1);
        if (ticketDateText) {
          ticketDateText.textContent = `${capitalized} ${d} de ${months[month]}`;
        }
      });

      calendarDaysGrid.appendChild(dayBtn);
    }

    const initialDayName = new Date(year, month, selectedCalDay).toLocaleDateString('es-CO', { weekday: 'long' });
    const capInit = initialDayName.charAt(0).toUpperCase() + initialDayName.slice(1);
    if (ticketDateText) {
      ticketDateText.textContent = `${capInit} ${selectedCalDay} de ${months[month]}`;
    }
  };

  if (calPrevMonth) {
    calPrevMonth.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() - 1);
      renderCalendar();
    });
  }

  if (calNextMonth) {
    calNextMonth.addEventListener('click', () => {
      currentCalDate.setMonth(currentCalDate.getMonth() + 1);
      renderCalendar();
    });
  }

  renderCalendar();

  document.querySelectorAll('.time-slot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedTimeSlot = btn.dataset.slot;
      if (ticketTimeText) ticketTimeText.textContent = selectedTimeSlot;
    });
  });

  if (btnConfirmScheduledVisit) {
    btnConfirmScheduledVisit.addEventListener('click', () => {
      const dateStr = ticketDateText ? ticketDateText.textContent : 'Próximamente';
      const modality = document.querySelector('input[name="visitType"]:checked')?.value === 'virtual'
        ? 'Videollamada Informativa'
        : 'Recorrido Presencial con Café en Sede Medellín';

      const msg = encodeURIComponent(
        `¡Hola Hogar San Lucas! 🌿 Deseo confirmar una visita guiada:\n` +
        `• Fecha elegida: ${dateStr}\n` +
        `• Franja horaria: ${selectedTimeSlot}\n` +
        `• Modalidad: ${modality}\n` +
        `Por favor confírmenme el agendamiento. ¡Gracias!`
      );
      window.open(`https://wa.me/573000000000?text=${msg}`, '_blank');
    });
  }

  // =========================================================================
  // 8. FILTROS DE INSTALACIONES
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-pill-btn');
  const facilityCards = document.querySelectorAll('.facility-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      facilityCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => card.style.display = 'none', 250);
        }
      });
    });
  });

  // =========================================================================
  // 9. FLASHCARD INTERACTIVO: 5 PREGUNTAS
  // =========================================================================
  const questions = [
    '«¿Cuál fue tu primer trabajo y qué aprendiste de esa primera experiencia?»',
    '«¿Cuál es la comida o receta que siempre te transporta a tu infancia?»',
    '«¿Qué consejo sobre el amor o la familia te habría gustado escuchar cuando tenías 20 años?»',
    '«¿Cuál ha sido el viaje o lugar que más te asombró en toda tu vida?»',
    '«¿De qué momento o logro en tu vida te sientes hoy más orgulloso?»'
  ];

  let currentQ = 0;
  const qTracker = document.getElementById('qTracker');
  const qContent = document.getElementById('qContent');
  const btnPrevQ = document.getElementById('btnPrevQ');
  const btnNextQ = document.getElementById('btnNextQ');
  const qDotsContainer = document.getElementById('qDotsContainer');

  if (qDotsContainer) {
    qDotsContainer.innerHTML = questions.map((_, i) => `<span class="q-dot ${i === 0 ? 'active' : ''}"></span>`).join('');
  }

  const renderQuestion = (index) => {
    if (!qContent || !qTracker) return;
    qContent.style.opacity = '0';
    setTimeout(() => {
      qContent.textContent = questions[index];
      qTracker.textContent = `Pregunta ${index + 1} de ${questions.length}`;
      qContent.style.opacity = '1';
    }, 150);

    const dots = document.querySelectorAll('.q-dot');
    dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  if (btnNextQ) {
    btnNextQ.addEventListener('click', () => {
      currentQ = (currentQ + 1) % questions.length;
      renderQuestion(currentQ);
    });
  }

  if (btnPrevQ) {
    btnPrevQ.addEventListener('click', () => {
      currentQ = (currentQ - 1 + questions.length) % questions.length;
      renderQuestion(currentQ);
    });
  }

  // =========================================================================
  // 10. TOAST NOTIFICATIONS & FORMULARIOS
  // =========================================================================
  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast-alert';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('visible'), 50);
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  };

  const bookingMainForm = document.getElementById('bookingMainForm');
  if (bookingMainForm) {
    bookingMainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inputName')?.value || 'Amigo/a';
      showToast(`¡Gracias ${name}! Nos comunicaremos de inmediato para agendar tu visita.`);
      bookingMainForm.reset();
    });
  }

  const heroFastForm = document.getElementById('heroFastForm');
  if (heroFastForm) {
    heroFastForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('heroPhoneInput')?.value || '';
      showToast(`¡Recibido! Nos pondremos en contacto al número ingresado (${phone}).`);
      heroFastForm.reset();
    });
  }
});
