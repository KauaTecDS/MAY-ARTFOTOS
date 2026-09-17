/* =========================================================
   REVELA ARTE — SCRIPT.JS
   PARTE 1 — BASE + HEADER + MENU MOBILE + CURSOR
   ========================================================= */

"use strict";


/* =========================================================
   ELEMENTOS PRINCIPAIS
   ========================================================= */

const body = document.body;
const header = document.querySelector(".header");
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const nav = document.querySelector(".nav");


/* =========================================================
   HEADER AO ROLAR
   ========================================================= */

function handleHeaderScroll() {
  if (!header) return;

  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
}

window.addEventListener("scroll", handleHeaderScroll);
handleHeaderScroll();


/* =========================================================
   MENU MOBILE
   ========================================================= */

if (mobileMenuBtn && nav) {
  mobileMenuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("active");

    mobileMenuBtn.classList.toggle("active", isOpen);
    body.classList.toggle("menu-open", isOpen);

    mobileMenuBtn.setAttribute("aria-expanded", isOpen);
  });

  /*
   * Fecha o menu quando clicar em algum link
   */

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      body.classList.remove("menu-open");

      mobileMenuBtn.setAttribute("aria-expanded", "false");
    });
  });
}


/* =========================================================
   FECHAR MENU COM ESC
   ========================================================= */

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (nav && nav.classList.contains("active")) {
    nav.classList.remove("active");

    if (mobileMenuBtn) {
      mobileMenuBtn.classList.remove("active");
      mobileMenuBtn.setAttribute("aria-expanded", "false");
    }

    body.classList.remove("menu-open");
  }
});


/* =========================================================
   CURSOR PERSONALIZADO
   ========================================================= */

const cursor = document.querySelector(".cursor");
const cursorFollower = document.querySelector(".cursor-follower");

if (
  cursor &&
  cursorFollower &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches
) {
  let mouseX = 0;
  let mouseY = 0;

  let followerX = 0;
  let followerY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;

    cursorFollower.style.left = `${followerX}px`;
    cursorFollower.style.top = `${followerY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();


  /*
   * Cursor aumenta quando passa sobre elementos clicáveis
   */

  const interactiveElements = document.querySelectorAll(
    "a, button, input, textarea, select, .portfolio-item"
  );

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("active");
      cursorFollower.classList.add("active");
    });

    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("active");
      cursorFollower.classList.remove("active");
    });
  });
}


/* =========================================================
   PARALLAX SUAVE DO HERO
   ========================================================= */

const heroImage = document.querySelector(".hero-image");

if (heroImage && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  window.addEventListener(
    "scroll",
    () => {
      const scrollPosition = window.scrollY;

      if (scrollPosition < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrollPosition * 0.12}px) scale(1.04)`;
      }
    },
    { passive: true }
  );
}


/* =========================================================
   FIM DA PARTE 1
   ========================================================= */
/* =========================================================
   REVELA ARTE — SCRIPT.JS
   PARTE 2 — REVEAL + FILTROS DO PORTFÓLIO + LIGHTBOX
   ========================================================= */


/* =========================================================
   ANIMAÇÕES REVEAL AO ENTRAR NA TELA
   ========================================================= */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
}


/* =========================================================
   FILTROS DO PORTFÓLIO
   ========================================================= */

const filterButtons = document.querySelectorAll(".filter-btn");
const portfolioItems = document.querySelectorAll(".portfolio-item");

if (filterButtons.length > 0 && portfolioItems.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

      /*
       * Remove o estado ativo dos outros botões
       */

      filterButtons.forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");

      /*
       * Categoria selecionada
       */

      const filter = button.dataset.filter;

      portfolioItems.forEach((item, index) => {
        const category = item.dataset.category;

        const shouldShow =
          filter === "all" ||
          category === filter;

        if (shouldShow) {
          item.classList.remove("hidden");

          /*
           * Pequeno atraso entre os itens
           * para criar efeito de entrada
           */

          item.style.animationDelay = `${index * 0.06}s`;

        } else {
          item.classList.add("hidden");
        }
      });
    });
  });
}


/* =========================================================
   LIGHTBOX / GALERIA
   ========================================================= */

const imageModal = document.querySelector(".image-modal");
const modalImage = document.querySelector(".image-modal img");
const modalCaption = document.querySelector(".modal-caption");
const modalClose = document.querySelector(".modal-close");

const portfolioLightboxButtons =
  document.querySelectorAll(".portfolio-lightbox");


/*
 * Abre o modal
 */

function openLightbox(imageSrc, caption = "") {
  if (!imageModal || !modalImage) return;

  modalImage.src = imageSrc;

  if (modalCaption) {
    modalCaption.textContent = caption;
  }

  imageModal.classList.add("active");
  body.classList.add("modal-open");

  imageModal.setAttribute("aria-hidden", "false");
}


/*
 * Fecha o modal
 */

function closeLightbox() {
  if (!imageModal) return;

  imageModal.classList.remove("active");
  body.classList.remove("modal-open");

  imageModal.setAttribute("aria-hidden", "true");

  /*
   * Limpa a imagem depois da animação
   */

  setTimeout(() => {
    if (!imageModal.classList.contains("active") && modalImage) {
      modalImage.removeAttribute("src");
    }
  }, 400);
}


/*
 * Clique nos botões da galeria
 */

portfolioLightboxButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const item = button.closest(".portfolio-item");

    if (!item) return;

    const image = item.querySelector("img");

    const titleElement = item.querySelector(
      ".portfolio-title, h3, .portfolio-overlay h3"
    );

    const caption =
      titleElement?.textContent?.trim() || "Revela Arte";

    /*
     * Se existir uma imagem real, abre ela.
     */

    if (image && image.src) {
      openLightbox(image.src, caption);
      return;
    }

    /*
     * Caso ainda seja um placeholder,
     * não abre uma imagem quebrada.
     */

    console.warn(
      "Este projeto ainda não possui uma imagem cadastrada:",
      caption
    );
  });
});


/*
 * Botão fechar
 */

if (modalClose) {
  modalClose.addEventListener("click", closeLightbox);
}


/*
 * Clique fora da imagem fecha
 */

if (imageModal) {
  imageModal.addEventListener("click", (event) => {
    if (event.target === imageModal) {
      closeLightbox();
    }
  });
}


/*
 * ESC fecha o lightbox
 */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageModal?.classList.contains("active")) {
    closeLightbox();
  }
});


/* =========================================================
   CARREGAMENTO SUAVE DAS IMAGENS
   ========================================================= */

const lazyImages = document.querySelectorAll(
  'img[loading="lazy"]'
);

lazyImages.forEach((image) => {
  if (image.complete) {
    image.classList.add("loaded");
  } else {
    image.addEventListener("load", () => {
      image.classList.add("loaded");
    });
  }
});


/* =========================================================
   FIM DA PARTE 2
   ========================================================= */
/* =========================================================
   REVELA ARTE — SCRIPT.JS
   PARTE 3 — DEPOIMENTOS + CONTADORES + NAVEGAÇÃO
   ========================================================= */


/* =========================================================
   SLIDER DE DEPOIMENTOS
   ========================================================= */

const testimonialSlides =
  document.querySelectorAll(".testimonial");

const testimonialPrev =
  document.querySelector(".testimonial-prev");

const testimonialNext =
  document.querySelector(".testimonial-next");

const testimonialDots =
  document.querySelectorAll(".testimonial-dot");

let currentTestimonial = 0;


/*
 * Mostra o depoimento selecionado
 */

function showTestimonial(index) {
  if (testimonialSlides.length === 0) return;

  if (index < 0) {
    index = testimonialSlides.length - 1;
  }

  if (index >= testimonialSlides.length) {
    index = 0;
  }

  currentTestimonial = index;

  testimonialSlides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentTestimonial);
  });

  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentTestimonial);
  });
}


/*
 * Botão anterior
 */

if (testimonialPrev) {
  testimonialPrev.addEventListener("click", () => {
    showTestimonial(currentTestimonial - 1);
  });
}


/*
 * Botão próximo
 */

if (testimonialNext) {
  testimonialNext.addEventListener("click", () => {
    showTestimonial(currentTestimonial + 1);
  });
}


/*
 * Bolinhas
 */

testimonialDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showTestimonial(index);
  });
});


/*
 * Inicializa o slider
 */

if (testimonialSlides.length > 0) {
  showTestimonial(0);
}


/*
 * Troca automática a cada 6 segundos
 */

let testimonialInterval;

function startTestimonialAutoPlay() {
  if (testimonialSlides.length <= 1) return;

  testimonialInterval = setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 6000);
}

function stopTestimonialAutoPlay() {
  clearInterval(testimonialInterval);
}

startTestimonialAutoPlay();


/*
 * Pausa quando o usuário interage
 */

const testimonialContainer =
  document.querySelector(".testimonials-slider");

if (testimonialContainer) {
  testimonialContainer.addEventListener(
    "mouseenter",
    stopTestimonialAutoPlay
  );

  testimonialContainer.addEventListener(
    "mouseleave",
    startTestimonialAutoPlay
  );
}


/* =========================================================
   CONTADORES
   ========================================================= */

const counters = document.querySelectorAll(
  "[data-counter]"
);

let countersStarted = false;


/*
 * Anima um número de 0 até o valor final
 */

function animateCounter(element) {
  const target = Number(
    element.dataset.counter || 0
  );

  const duration = 1800;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;

    const progress = Math.min(
      elapsed / duration,
      1
    );

    /*
     * Easing suave
     */

    const easedProgress =
      1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(
      target * easedProgress
    );

    element.textContent =
      currentValue.toLocaleString("pt-BR");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent =
        target.toLocaleString("pt-BR");
    }
  }

  requestAnimationFrame(updateCounter);
}


/*
 * Observa a seção dos números
 */

const numbersSection =
  document.querySelector(".numbers");

if (numbersSection && counters.length > 0) {
  const counterObserver =
    new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !countersStarted
          ) {
            countersStarted = true;

            counters.forEach((counter, index) => {
              setTimeout(() => {
                animateCounter(counter);
              }, index * 150);
            });

            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.35
      }
    );

  counterObserver.observe(numbersSection);
}


/* =========================================================
   NAVEGAÇÃO ATIVA CONFORME A SEÇÃO
   ========================================================= */

const sections = document.querySelectorAll(
  "section[id]"
);

const navLinks = document.querySelectorAll(
  '.nav a[href^="#"]'
);


function updateActiveNavigation() {
  if (sections.length === 0) return;

  const scrollPosition =
    window.scrollY + 180;

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition <
        sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const linkTarget =
      link.getAttribute("href");

    link.classList.toggle(
      "active",
      linkTarget === `#${currentSection}`
    );
  });
}


window.addEventListener(
  "scroll",
  updateActiveNavigation,
  { passive: true }
);

updateActiveNavigation();


/* =========================================================
   LINKS INTERNOS — SCROLL SUAVE
   ========================================================= */

document
  .querySelectorAll('a[href^="#"]')
  .forEach((link) => {

    link.addEventListener("click", (event) => {
      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      const headerHeight =
        header?.offsetHeight || 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
      });
    });
  });


/* =========================================================
   FIM DA PARTE 3
   ========================================================= */
/* =========================================================
   REVELA ARTE — SCRIPT.JS
   PARTE 4 — FORMULÁRIO + WHATSAPP + TOPO + FINALIZAÇÃO
   ========================================================= */


/* =========================================================
   BOTÃO VOLTAR AO TOPO
   ========================================================= */

const backToTop =
  document.querySelector(".back-to-top");


function updateBackToTop() {
  if (!backToTop) return;

  if (window.scrollY > 600) {
    backToTop.classList.add("show");
  } else {
    backToTop.classList.remove("show");
  }
}


window.addEventListener(
  "scroll",
  updateBackToTop,
  { passive: true }
);

updateBackToTop();


if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* =========================================================
   FORMULÁRIO DE CONTATO
   ========================================================= */

const contactForm =
  document.querySelector(".contact-form");

const formStatus =
  document.querySelector(".form-status");


if (contactForm) {
  contactForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      /*
       * Captura os campos do formulário
       */

      const formData =
        new FormData(contactForm);

      const name =
        formData.get("name")?.trim() || "";

      const phone =
        formData.get("phone")?.trim() || "";

      const service =
        formData.get("service")?.trim() || "";

      const message =
        formData.get("message")?.trim() || "";


      /*
       * Validação básica
       */

      if (!name || !phone || !service) {
        showFormStatus(
          "Preencha seu nome, telefone e o tipo de ensaio."
        );

        return;
      }


      /*
       * Número do WhatsApp da Revela Arte.
       *
       * IMPORTANTE:
       * Troque este número pelo WhatsApp real
       * quando tiver o número definitivo.
       */

      const whatsappNumber =
        "5562999999999";


      /*
       * Monta a mensagem automaticamente
       */

      let whatsappMessage =
        "Olá! Vim pelo site da Revela Arte e gostaria de solicitar um orçamento.%0A%0A";

      whatsappMessage +=
        `*Nome:* ${encodeURIComponent(name)}%0A`;

      whatsappMessage +=
        `*Telefone:* ${encodeURIComponent(phone)}%0A`;

      whatsappMessage +=
        `*Serviço:* ${encodeURIComponent(service)}%0A`;

      if (message) {
        whatsappMessage +=
          `%0A*Mensagem:* ${encodeURIComponent(message)}`;
      }


      /*
       * Mostra uma confirmação visual
       */

      showFormStatus(
        "Tudo certo! Você será direcionado para o WhatsApp."
      );


      /*
       * Pequeno atraso para o usuário
       * perceber a confirmação.
       */

      setTimeout(() => {
        const whatsappURL =
          `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

        window.open(
          whatsappURL,
          "_blank",
          "noopener,noreferrer"
        );
      }, 500);
    }
  );
}


/* =========================================================
   STATUS DO FORMULÁRIO
   ========================================================= */

function showFormStatus(message) {
  if (!formStatus) return;

  formStatus.textContent = message;
  formStatus.classList.add("show");

  clearTimeout(
    formStatus.hideTimeout
  );

  formStatus.hideTimeout =
    setTimeout(() => {
      formStatus.classList.remove("show");
    }, 5000);
}


/* =========================================================
   MÁSCARA DE TELEFONE
   ========================================================= */

const phoneInput =
  document.querySelector(
    'input[name="phone"]'
  );


if (phoneInput) {
  phoneInput.addEventListener(
    "input",
    (event) => {

      let value =
        event.target.value.replace(
          /\D/g,
          ""
        );

      value = value.substring(
        0,
        11
      );


      if (value.length <= 10) {
        value =
          value.replace(
            /^(\d{2})(\d{4})(\d{0,4}).*/,
            "($1) $2-$3"
          );
      } else {
        value =
          value.replace(
            /^(\d{2})(\d{5})(\d{0,4}).*/,
            "($1) $2-$3"
          );
      }


      event.target.value =
        value;
    }
  );
}


/* =========================================================
   FECHAR MENU AO REDIMENSIONAR
   ========================================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth > 700 &&
      nav?.classList.contains("active")
    ) {

      nav.classList.remove("active");

      mobileMenuBtn?.classList.remove(
        "active"
      );

      body.classList.remove(
        "menu-open"
      );

      mobileMenuBtn?.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }
);


/* =========================================================
   ANIMAÇÃO DE ENTRADA DAS IMAGENS
   ========================================================= */

const allImages =
  document.querySelectorAll("img");


allImages.forEach((image) => {

  if (image.complete) {
    image.classList.add("loaded");
    return;
  }

  image.addEventListener(
    "load",
    () => {
      image.classList.add("loaded");
    },
    { once: true }
  );

});


/* =========================================================
   EFEITO DE TÍTULO AO PASSAR O MOUSE
   ========================================================= */

const magneticElements =
  document.querySelectorAll(
    ".header-btn, .circle-link, .whatsapp-float"
  );


if (
  window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches
) {

  magneticElements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.12}px, ${y * 0.12}px)`;
      }
    );


    element.addEventListener(
      "mouseleave",
      () => {
        element.style.transform = "";
      }
    );

  });

}


/* =========================================================
   ANO AUTOMÁTICO NO RODAPÉ
   ========================================================= */

const currentYear =
  document.querySelector(
    "[data-current-year]"
  );


if (currentYear) {
  currentYear.textContent =
    new Date().getFullYear();
}


/* =========================================================
   PROTEÇÃO CONTRA CLIQUE EM IMAGENS SEM SRC
   ========================================================= */

document
  .querySelectorAll(".portfolio-item img")
  .forEach((image) => {

    image.addEventListener(
      "error",
      () => {

        image.style.display = "none";

        const item =
          image.closest(
            ".portfolio-item"
          );

        item?.classList.add(
          "image-error"
        );
      }
    );

  });


/* =========================================================
   CONSOLE
   ========================================================= */

console.log(
  "%c REVELA ARTE ",
  "font-size:18px;font-weight:bold;"
);

console.log(
  "Site carregado com sucesso."
);


/* =========================================================
   FIM DO SCRIPT.JS
   ========================================================= */


