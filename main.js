function handleModalSizing(containerEl, modals, offsetHeight) {
  // select container element and get left position to eventually fix modal pos
  const container = containerEl;
  let containerLeft = container.getBoundingClientRect().left; // unuseful if container is "body" tag

  // Get window height and width
  let windowHeight = window.clientHeight;
  let windowWidth = window.clientWidth;

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

    // If a modal-dialog element exists set same w & h used for modal
    if (modalDialog) {
      // Modal Dialog
      modalDialog.style.height = `${modalHeight}`;
      modalDialog.style.maxHeight = `${modalHeight}`;
    }
  });
}

$(document).ready(() => {
  const container = document.querySelector("body");
  const header = document.querySelector("#header");
  const search = document.querySelector(".search_container");
  const backButton = $("#backButton");
  const items = document.querySelectorAll(".stand-item");
  const modals = document.querySelectorAll(".modal");

  // Get container padding to dynamically adapt modals inner spacing
  const containerPaddingLeft = $(container).css("padding-left");
  const containerPaddingRight = $(container).css("padding-right");

  items.forEach(item => {
    let itemHeader = item.querySelector(".stand-item_header");
    let itemModal = item.querySelector(".modal");

    itemHeader.addEventListener("click", () => {
      // Set modal padding in order to mimic container padding dinamically

      itemModal.style.paddingLeft = containerPaddingLeft;
      itemModal.style.paddingRight = containerPaddingRight;

      // Show Modal
      $(itemModal).modal("show");
    });
  });

  // Hide modals
  backButton.on("click", function () {
    $(".modal").modal("hide");
  });

  // Get header height to dynamically set an offset for modal & search positioning

  const headerHeight = header.offsetHeight;

  //Handle modals sizing on DOM ready

  handleModalSizing(container, modals, headerHeight);

  //Handle search "top" offset by headerHeight

  search.style.top = `${headerHeight}px`;

  // Toggle .nav-left/.backButton depending on modal events triggered by shown/hidden state

  $(modals).on("shown.bs.modal", function (event) {
    header.querySelector(".nav-left").classList.add("d-none");
    header.querySelector(".backButton").classList.remove("d-none");
  });
  $(modals).on("hidden.bs.modal", function (event) {
    header.querySelector(".nav-left").classList.remove("d-none");
    header.querySelector(".backButton").classList.add("d-none");
  });

  $(window).resize(function () {
    // Handle modals sizing on resize

    handleModalSizing(container, modals, headerHeight);
  });
});
