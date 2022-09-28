// MAIN SCRIPT - ON DOCUMENT READY

$(document).ready(() => {
  /* let testTL = gsap.timeline();
  testTL.to(".logo", { opacity: 0, duration: 1 }); */
  //console.log(testTL);
  const container = document.querySelector("body");
  const header = document.querySelector("#header");
  const search = document.querySelector(".search_container");

  const items = document.querySelectorAll(".stand-item");
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

    const openingTL = gsap.timeline({
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

    openingTL.fromTo(itemModal, { xPercent: 100, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.35 });
    openingTL.fromTo(backButton, { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.35 }, "<+=0.25");
    openingTL.fromTo(cartButton, { xPercent: -70, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.35 }, "<+=0.25");
    openingTL.fromTo(modalBTitle, { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35 }, "<");
    openingTL.fromTo(modalTitle, { yPercent: -30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35 }, "<+=0.15");
    openingTL.fromTo(
      modalP,
      { yPercent: -30, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.5,
        stagger: {
          from: "end",
          axis: "y",
          ease: "power2.in",
          amount: 2.5
        }
      }
    );

    openingTL.pause();

    itemHeader.addEventListener("click", () => {
      openingTL.play();
    });

    backButton.addEventListener("click", () => {
      openingTL.reverse();
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
