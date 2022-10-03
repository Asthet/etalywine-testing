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

  // Handle search "top" offset by headerHeight

  search.style.top = `${headerHeight + 15}px`;

  // Live search in main products page
  // add event listener to search input -> on key up filter element corresponding to string or stand id
  search.addEventListener("keyup", e => {
    [...items].map(item => {
      let stand = item.querySelector(".stand-num");
      let standText = stand.innerText.toLowerCase();
      let standID = stand.dataset.stand;

      let itemTitle = item.querySelector(".modal-title").innerText.toLowerCase();

      !itemTitle.includes(e.target.value.toLowerCase()) ? (standID === e.target.value ? (item.style.display = "block") : (item.style.display = "none")) : (item.style.display = "block");
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

    // Split modal title and rebuild it in sub elements for modal title with more than 1 words
    handleMultipleWordsTags(modalTitle);

    // Simulate filter tabs selectors
    if (modalFilters) {
      modalFiltersColl.forEach(filter => {
        xPos = filter.getBoundingClientRect().left;
        halfWidth = filter.clientWidth;
        dotPos = xPos + halfWidth;

        console.log(filter, xPos, halfWidth, dotPos);

        $(filter).on("click", e => {
          handleActiveState(e.target);
        });
      });
    }
    $(itemModal).on("shown.bs.modal", function () {
      $(window).resize(function () {
        handleDotPosition(modalFiltersColl, container);
      });
    });

    // GSAP TIMELINE

    // Create slide in GSAP TL animation

    const slideInModalTL = gsap.timeline({
      onStart: () => {
        // Set modal padding in order to mimic container padding dinamically
        itemModal.style.paddingLeft = containerPaddingLeft;
        itemModal.style.paddingRight = containerPaddingRight;
        $(itemModal).modal("show");
      },
      onComplete: () => {
        handleDotPosition(modalFiltersColl, container);
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
          ease: "power2.inOut",
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
        },
        ">-=0.05"
      );
    }
    slideInModalTL.fromTo(itemModal, { xPercent: 100 }, { xPercent: 0, duration: 0.25, ease: "power2.out" }, "<-=0.50");
    slideInModalTL.fromTo(itemModal, { opacity: 0 }, { opacity: 1, duration: 0.25 }, "<");
    slideInModalTL.fromTo(backButton, { xPercent: 70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.25 }, ">");
    slideInModalTL.fromTo(cartButton, { xPercent: -70, opacity: 0 }, { xPercent: 0, opacity: 1, ease: "power2.in", duration: 0.25 }, "<");
    slideInModalTL.staggerFromTo(modalHeaderEl, 0.075, { opacity: 0 }, { opacity: 1, ease: "Power1.easeOut" }, 0.1, "<-=0.05");
    slideInModalTL.staggerFromTo(modalHeaderEl, 0.1, { yPercent: 30 }, { yPercent: 0, ease: "Power2.easeOut" }, 0.1, "<");

    // if modal title ( cantine page title ) is greater than 1 word apply a specific animation pattern
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

    // Create slide out GSAP TL animation
    const slideOutModalTL = new gsap.timeline({
      onComplete: () => {
        $(itemModal).modal("hide");
      }
    });

    slideOutModalTL.set(itemHeaderAll, { xPercent: 0, opacity: 1 });
    slideOutModalTL.to(itemModal, { xPercent: 100, duration: 0.35, ease: "power2.in" });

    slideOutModalTL.pause();

    // Add event listeners to modal header ( main page )
    itemHeader.addEventListener("click", () => {
      // add a browser history fake state to simulate normal routing behaviour
      history.pushState("modal-open", "null", "");
      // add a one-time event listener to "popstate" (back browser action)
      window.addEventListener(
        "popstate",
        () => {
          // init modal slide out TL animation if user go back in browser history
          // to create a page transition effect -> callback onEnd to .hide() bs trigger
          slideOutModalTL.restart();
          // go back in browser history state
          if (history.state == "modal-open") {
            window.history.back();
          }
        },
        {
          once: true
        }
      );
      // init modal slide in TL animation -> callback onStart to .show() bs trigger
      slideInModalTL.restart();
    });
    // Add event listeners to back button inside cantine "page"
    backButton.addEventListener("click", () => {
      // init modal slide out TL animation using back button UI element -> callback onEnd to .hide() bs trigger
      slideOutModalTL.restart();
      // go back in browser history state
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
  // check if the cantine name is made up by more than one words
  if (el.innerText.trim().indexOf(" ") != -1) {
    let words = el.innerText.split(" "); // create an array of title's elements
    el.innerText = ""; // empty title text content

    // loop through el words array to create sub DOM elements
    words.map((word, index, words) => {
      // check if exist a previous element and if its length its less than 3 chars
      if (index - 1 >= 0 && words[index - 1].length < 3) {
        // if prev el is less than 3 chars add to it the current one
        el.lastElementChild.innerText += "  " + word;
      } else {
        // create sub elements with "sub" class and current word as innerText
        let subEl = document.createElement("span");
        subEl.classList.add("sub");
        subEl.innerText = word;
        // append sub el to the parent DOM element
        el.appendChild(subEl);
        //if it's not the first word, add a space between sub elements
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
  //just toggle active state class between siblings nav list labels to simulate a products tab sys
  if (!$(item).hasClass("active")) {
    $(item)
      .siblings()
      .each(function () {
        $(this).hasClass("active") && $(this).removeClass("active");
      });
    $(item).addClass("active");
  }
}

function handleDotPosition(refItems, container) {
  //console.log(parseFloat($(container).css("padding-left")));
  let dot = document.querySelector("#dot");
  let dotContainer = document.querySelector("#dotContainer");
  console.log(dotContainer.style.maxHeight);
  let cy = parseInt(dotContainer.style.maxHeight) / 2;

  refItems.forEach((item, i) => {
    let itemRect = item.getBoundingClientRect();
    let xPos = itemRect.x;
    let halfWidth = itemRect.width / 2;
    let strokeWidth = cy;
    let dotPos = xPos + halfWidth - cy * 2 + strokeWidth * 2 - parseFloat($(container).css("padding-left"));
    let firstRender = true;

    if (item.classList.contains("active") && firstRender === true) {
      dot.setAttribute("stroke-width", strokeWidth);
      dot.setAttribute("x1", dotPos);
      dot.setAttribute("x2", dotPos);
      dot.setAttribute("y1", cy);
      dot.setAttribute("y2", cy);
    }

    item.addEventListener("click", e => {
      firstRender = false;
      let tl = new gsap.timeline();
      tl.to(dot, { attr: { x2: dotPos, strokeWidth: 0, ease: Power2.easeIn } });
      tl.to(dot, { attr: { x1: dotPos, ease: Elastic.easeOut.config(1, 0.76) } }, "<");
      tl.to(dot, { attr: { x1: dotPos, strokeWidth, ease: Elastic.easeOut.config(1, 0.8) } }, "<");
      tl.timeScale(2);

      /* dot.setAttribute("x1", dotPos);
      dot.setAttribute("x2", dotPos); */
    });
  });
}
