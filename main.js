// MAIN SCRIPT - ON DOCUMENT READY

$(document).ready(() => {
  /* let testTL = gsap.timeline();
  testTL.to(".logo", { opacity: 0, duration: 1 }); */
  //console.log(testTL);
  const container = document.querySelector("body");
  const header = document.querySelector("#header");
  const navLeft = header.querySelector(".nav-left");
  const navRight = header.querySelector(".nav-right");
  const search = document.querySelector(".search_container");
  const itemsList = document.querySelector(".stand-items");
  const items = itemsList.querySelectorAll(".stand-item");
  const itemHeaderAll = itemsList.querySelectorAll(".stand-item_header");
  const modals = document.querySelectorAll(".modal");

  // Get container padding to dynamically adapt modals inner spacing
  const containerPaddingLeft = $(container).css("padding-left");
  const containerPaddingRight = $(container).css("padding-right");

  // Get header height to dynamically set an offset for modal & search positioning

  const headerHeight = header.offsetHeight;

  //Handle modals sizing on DOM ready

  handleModalSizing(container, modals);

  //Handle search "top" offset by headerHeight

  search.style.top = `${headerHeight}px`;

  items.forEach(item => {
    const itemHeader = item.querySelector(".stand-item_header");
    const itemModal = item.querySelector(".modal");
    const backButton = itemModal.querySelector(".backButton");
    const cartButton = itemModal.querySelector(".cart");
    const modalBTitle = itemModal.querySelector(".modal-b-title");
    const modalTitle = itemModal.querySelector(".modal-title");
    const modalBody = itemModal.querySelector(".modal-body");
    const modalP = modalBody.querySelectorAll("p");

    // GSAP TIMELINE

    const modalTL = gsap.timeline({
      onStart: () => {
        // Set modal padding in order to mimic container padding dinamically
        itemModal.style.paddingLeft = containerPaddingLeft;
        itemModal.style.paddingRight = containerPaddingRight;
        $(itemModal).modal("show");
      },
      onReverseComplete: () => {
        $(itemModal).modal("hide");
      }
    });

    modalTL.fromTo(navLeft, { yPercent: 0, opacity: 1 }, { yPercent: -10, opacity: 0, ease: "power2.in", duration: 0.05 });
    modalTL.fromTo(navRight, { yPercent: 0, opacity: 1 }, { yPercent: -10, opacity: 0, ease: "power2.in", duration: 0.05 }, "<");
    modalTL.fromTo(search, { yPercent: 0, opacity: 1 }, { yPercent: -30, opacity: 0, ease: "power2.in", duration: 0.15 }, "<+=0.03");
    modalTL.fromTo(
      itemHeaderAll,
      { yPercent: 0, opacity: 1 },
      {
        yPercent: -60,
        opacity: 0,
        stagger: {
          from: "start",
          axis: "x",
          ease: "power2.in",
          amount: 0.15
        }
      }
    );

    modalTL.fromTo(itemModal, { opacity: 0 }, { opacity: 1, duration: 0.45 }, ">-=0.35");
    modalTL.fromTo(backButton, { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.35 }, "<");
    modalTL.fromTo(cartButton, { xPercent: -70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.35 }, "<");
    modalTL.fromTo(modalBTitle, { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power2.in", duration: 0.35 }, ">");
    modalTL.fromTo(modalTitle, { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "power2.in", duration: 0.35 }, "<+=0.25");
    modalTL.fromTo(
      modalP,
      { yPercent: -30, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        stagger: {
          from: "start",
          axis: "y",
          ease: "power2.in",
          amount: 0.5
        }
      }
    );
    modalTL.fromTo(itemModal, { xPercent: 100 }, { xPercent: 0, duration: 0.45 }, "<-=0.45");

    modalTL.pause();

    itemHeader.addEventListener("click", () => {
      modalTL.play();
    });

    backButton.addEventListener("click", () => {
      modalTL.reverse();
    });
  });

  // MAIN SCRIPT - ON WINDOW RESIZE

  $(window).resize(function () {
    // Handle modals sizing on resize

    handleModalSizing(container, modals);
  });
});

// FUNCTIONS

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
    let modalDialog = modal.querySelector(".modal-dialog");

    // Modal
    modal.style.top = `${offsetHeight}px`;
    modal.style.left = `${containerLeft}px`;
    modal.style.height = modalHeight;
    modal.style.width = modalWidth;
  });
}
