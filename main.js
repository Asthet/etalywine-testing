// MAIN SCRIPT - ON DOCUMENT READY

$(document).ready(() => {
  const container = document.querySelector("body");
  const header = document.querySelector("#header");
  const search = document.querySelector(".search_container");
  const itemsList = document.querySelector(".stand-items");
  const items = itemsList.querySelectorAll(".stand-item");
  const itemHeaderAll = itemsList.querySelectorAll(".stand-item_header");
  const modals = document.querySelectorAll(".modal");

  // Get container padding to dynamically adapt modals inner spacing
  let containerPaddingLeft = $(container).css("padding-left");
  let containerPaddingRight = $(container).css("padding-right");

  // Set modal padding in order to mimic container padding dinamically
  header.style.paddingLeft = containerPaddingLeft;
  header.style.paddingRight = containerPaddingRight;
  header.style.marginLeft = `-${containerPaddingLeft}`;
  header.style.marginRight = `-${containerPaddingRight}`;

  // Get header height to dynamically set an offset for modal & search positioning
  const headerHeight = header.offsetHeight;

  //Handle modals sizing on DOM ready

  handleModalSizing(container, modals);

  //Handle search "top" offset by headerHeight

  search.style.top = `${headerHeight + 15}px`;
  search.addEventListener("keyup", e => {
    [...items].map(item => {
      let stand = item.querySelector(".stand-num");
      let standText = stand.innerText.toLowerCase();
      let standID = stand.dataset.stand;

      let itemTitle = item.querySelector(".modal-title").innerText.toLowerCase();

      !itemTitle.includes(e.target.value.toLowerCase()) ? ((itemTitle.includes(e.target.value.toLowerCase()) && standText.includes(e.target.value.toLowerCase())) || standID === e.target.value ? (item.style.display = "block") : (item.style.display = "none")) : (item.style.display = "block");
    });
  });

  // On each modal operations
  items.forEach(item => {
    const itemHeader = item.querySelector(".stand-item_header");
    const itemModal = item.querySelector(".modal");
    const backButton = itemModal.querySelector(".backButton");
    const cartButton = itemModal.querySelector(".cart");
    const modalHeader = itemModal.querySelector(".modal-header");
    const modalHeaderEl = modalHeader.querySelectorAll(".modal-header-el");
    //const modalBTitle = itemModal.querySelector(".modal-b-title");
    const modalTitle = itemModal.querySelector(".modal-title");
    const modalBody = itemModal.querySelector(".modal-body");
    const modalP = modalBody.querySelectorAll(".product-card");
    const modalFilters = modalBody.querySelector(".filters");
    const modalFiltersColl = modalFilters ? modalFilters.querySelectorAll("span") : false;

    handleMultipleWordsTags(modalTitle);

    // Simulate filter tabs selectors
    if (modalFilters) {
      modalFiltersColl.forEach(filter => {
        $(filter).on("click", e => {
          handleActiveState(e.target);
        });
      });
    }

    // GSAP TIMELINE

    const slideInModalTL = gsap.timeline({
      onStart: () => {
        // Set modal padding in order to mimic container padding dinamically
        itemModal.style.paddingLeft = containerPaddingLeft;
        itemModal.style.paddingRight = containerPaddingRight;
        $(itemModal).modal("show");
      }
    });

    slideInModalTL.fromTo(
      itemHeaderAll,
      { xPercent: 0, opacity: 1 },
      {
        xPercent: -60,
        opacity: 0,
        stagger: {
          from: "start",
          axis: "x",
          ease: "power2.in",
          each: 0.05
        }
      }
    );
    if (modalFilters) {
      slideInModalTL.fromTo(
        modalP,
        { yPercent: -10, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          stagger: {
            from: "start",
            axis: "x",
            ease: "power2.inOut",
            each: 0.15
          }
        }
      );
    }
    slideInModalTL.fromTo(itemModal, { xPercent: 100 }, { xPercent: 0, duration: 0.25, ease: "power2.out" }, "<-=0.50");
    slideInModalTL.fromTo(itemModal, { opacity: 0 }, { opacity: 1, duration: 0.25 }, "<");
    slideInModalTL.fromTo(backButton, { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.25 }, ">");
    slideInModalTL.fromTo(cartButton, { xPercent: -70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.25 }, "<");
    slideInModalTL.staggerFromTo(modalHeaderEl, 0.075, { opacity: 0 }, { opacity: 1, ease: "Power1.easeOut" }, 0.1, "<-=0.05");
    slideInModalTL.staggerFromTo(modalHeaderEl, 0.1, { yPercent: 30 }, { yPercent: 0, ease: "Power2.easeOut" }, 0.1, "<");
    if (modalTitle.children.length > 0) {
      slideInModalTL.fromTo(
        modalTitle.querySelectorAll(".sub"),
        { opacity: 0 },
        {
          opacity: 1,
          stagger: {
            from: "start",
            axis: "x",
            ease: "power1.easeOut",
            each: 0.15
          }
        },
        "<"
      );
      slideInModalTL.fromTo(
        modalTitle.querySelectorAll(".sub"),
        { yPercent: 30 },
        {
          yPercent: 0,
          stagger: {
            from: "start",
            axis: "x",
            ease: "power2.easeOut",
            each: 0.15
          }
        },
        "<"
      );
    }

    slideInModalTL.pause();

    const slideOutModal = new gsap.timeline({
      onEnd: () => {
        $(itemModal).modal("show");
      }
    });

    slideOutModal.set(itemHeaderAll, { xPercent: 0, opacity: 1 });
    slideOutModal.to(itemModal, { xPercent: 100, duration: 0.35, ease: "power2.in" });

    slideOutModal.pause();

    itemHeader.addEventListener("click", () => {
      history.pushState("modal-open", "null", "");
      window.addEventListener(
        "popstate",
        () => {
          slideOutModal.restart();
          if (history.state == "modal-open") {
            window.history.back();
          }
        },
        {
          once: true
        }
      );
      slideInModalTL.restart();
    });

    backButton.addEventListener("click", () => {
      slideOutModal.restart();
      if (history.state == "modal-open") {
        window.history.back();
      }
    });
  });
  // MAIN SCRIPT - ON WINDOW RESIZE

  $(window).resize(function () {
    // Set modal padding in order to mimic container padding dinamically
    header.style.paddingLeft = containerPaddingLeft;
    header.style.paddingRight = containerPaddingRight;
    header.style.marginLeft = `-${containerPaddingLeft}`;
    header.style.marginRight = `-${containerPaddingRight}`;
    // Handle modals sizing on resize
    handleModalSizing(container, modals);
  });
});

// FUNCTIONS

function handleMultipleWordsTags(el) {
  if (el.innerText.trim().indexOf(" ") != -1) {
    let words = el.innerText.split(" ");
    el.innerText = "";
    words.map((word, index, words) => {
      if (index - 1 >= 0 && words[index - 1].length < 3) {
        el.lastElementChild.innerText += "  " + word;
      } else {
        let subEl = document.createElement("span");
        subEl.classList.add("sub");
        subEl.innerText = word;
        el.appendChild(subEl);
        if (index !== 0) {
          el.appendChild(document.createTextNode(" "));
        }
      }
    });
  }
}

function handleModalSizing(containerEl, modals, offsetHeight = 0) {
  // select container element and get left position to eventually fix modal pos
  const container = containerEl;
  let containerLeft = container.getBoundingClientRect().left; // unuseful if container is "body" tag

  // Get window height and width
  let windowHeight = window.innerHeight;
  let windowWidth = window.innerWidth;

  // Dynamically set modals w and h to cover
  // window height (excluding header) and window width

  let modalHeight = `${windowHeight - offsetHeight}px`;
  let modalWidth = `${windowWidth}px`;

  modals.forEach(modal => {
    // Modal
    modal.style.top = `${offsetHeight}px`;
    modal.style.left = `${containerLeft}px`;
    modal.style.height = modalHeight;
    modal.style.width = modalWidth;
  });
}

function handleActiveState(item) {
  if (!$(item).hasClass("active")) {
    $(item)
      .siblings()
      .each(function () {
        $(this).hasClass("active") && $(this).removeClass("active");
      });
    $(item).addClass("active");
  }
}
