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

$(document).ready(() => {
  const container = document.querySelector("body");
  const header = document.querySelector("#header");
  const search = document.querySelector(".search_container");

  const items = document.querySelectorAll(".stand-item");
  const modals = document.querySelectorAll(".modal");

  // Get container padding to dynamically adapt modals inner spacing
  const containerPaddingLeft = $(container).css("padding-left");
  const containerPaddingRight = $(container).css("padding-right");

  items.forEach(item => {
    let itemHeader = item.querySelector(".stand-item_header");
    let itemModal = item.querySelector(".modal");
    const backButton = itemModal.querySelector(".backButton");
    console.log(backButton);

    itemHeader.addEventListener("click", () => {
      // Show Modal
      $(itemModal).modal("show");

      // Set modal padding in order to mimic container padding dinamically

      itemModal.style.paddingLeft = containerPaddingLeft;
      itemModal.style.paddingRight = containerPaddingRight;
    });

    backButton.addEventListener("click", () => {
      console.log("click");
      // Hide modals
      $(itemModal).modal("hide");
    });
  });

  // Get header height to dynamically set an offset for modal & search positioning

  const headerHeight = header.offsetHeight;

  //Handle modals sizing on DOM ready

  handleModalSizing(container, modals);

  //Handle search "top" offset by headerHeight

  search.style.top = `${headerHeight}px`;

  $(window).resize(function () {
    // Handle modals sizing on resize

    handleModalSizing(container, modals);
  });
});
