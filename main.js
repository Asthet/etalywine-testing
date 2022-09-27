function handleModalSizing(modals, headerHeight) {
  const device = document.querySelector(".device");
  let windowHeight = device.clientHeight;
  let windowWidth = device.clientWidth;
  let windowLeft = device.getBoundingClientRect().left;
  let modalHeight = `${windowHeight - headerHeight}px`;
  let modalWidth = `${windowWidth}px`;

  // Get container padding to resize modal width
  let containerPaddingLeft = $(".page.container").css("padding-left");
  let containerPaddingRight = $(".page.container").css("padding-right");

  modals.forEach(modal => {
    let modalDialog = modal.querySelector(".modal-dialog");

    // Modal
    modal.style.top = `${headerHeight}px`;
    modal.style.left = `${windowLeft + parseFloat($(device).css("border-left"))}px`;
    modal.style.height = modalHeight;
    modal.style.marginLeft = `-${containerPaddingLeft}`;
    modal.style.marginRight = `-${containerPaddingRight}`;

    modal.style.width = modalWidth;

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
