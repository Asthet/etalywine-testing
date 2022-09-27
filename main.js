function handleModalSizing(modals, headerHeight) {
  // select container element and get left position to eventually fix modal pos
  const container = document.querySelector("body");
  let containerLeft = container.getBoundingClientRect().left; // unuseful if container is "body" tag

  // Get window height and width
  let windowHeight = window.clientHeight;
  let windowWidth = window.clientWidth;

  // Dynamically set modals w and h to cover
  // window height (excluding header) and window width

  let modalHeight = `${windowHeight - headerHeight}px`;
  let modalWidth = `${windowWidth}px`;

  // Get container padding to adapt modals inner spacing
  let containerPaddingLeft = $(container).css("padding-left");
  let containerPaddingRight = $(container).css("padding-right");

  modals.forEach(modal => {
    let modalDialog = modal.querySelector(".modal-dialog");

    // Modal
    modal.style.top = `${headerHeight}px`;
    modal.style.left = `${containerLeft}px`;
    modal.style.height = modalHeight;
    modal.style.paddingLeft = `${containerPaddingLeft}`;
    modal.style.paddingRight = `${containerPaddingRight}`;

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
  const header = document.querySelector("#header");
  const search = document.querySelector(".search_container");
  const headerHeight = header.offsetHeight;
  const modals = document.querySelectorAll(".modal");

  const backButton = $("#backButton");

  //Handle Modal Sizing on DOM ready
  handleModalSizing(modals, headerHeight);

  //Handle search "top" by headerHeight
  search.style.top = `${headerHeight}px`;

  // Close modals
  backButton.on("click", function () {
    $(".modal").modal("hide");
  });

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
    //Handle Modal Sizing on rezise
    handleModalSizing(modals, headerHeight);
  });
});
