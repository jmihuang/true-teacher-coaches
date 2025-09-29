//burger menu
document.querySelector(".burger-trigger").addEventListener("click", function (event) {
  document.querySelector(".burger").classList.toggle("active");
  event.currentTarget.classList.toggle("active");
});

// Close burger menu when clicking on navigation links
document.addEventListener("click", function (event) {
  if (event.target.closest(".burger-nav a")) {
    var burger = document.querySelector(".burger");
    var burgerTrigger = document.querySelector(".burger-trigger");

    // Close the burger menu
    burger.classList.remove("active");
    burgerTrigger.classList.remove("active");
  }
});

// Render profiles from responses.json
function renderProfiles() {
  var mount = document.getElementById("profiles-list");
  if (!mount) return;

  // Check if modal already exists to prevent duplication
  if (!document.getElementById("feedbackModal")) {
    // Add modal HTML
    var modalHTML = "\n      <div class=\"modal fade\" id=\"feedbackModal\" tabindex=\"-1\" aria-labelledby=\"feedbackModalLabel\" aria-hidden=\"true\">\n        <div class=\"modal-dialog modal-dialog-centered\">\n          <div class=\"modal-content\">\n            <div class=\"modal-header\">\n              <h5 class=\"modal-title\" id=\"feedbackModalLabel\">\u5B78\u54E1\u56DE\u994B</h5>\n              <button type=\"button\" class=\"btn-close-custom text-primary\" data-bs-dismiss=\"modal\" aria-label=\"Close\">\n                <i class=\"fas fa-window-close\"></i>\n              </button>\n            </div>\n            <div class=\"modal-body\">\n              <div id=\"feedbackContent\"></div>\n            </div>\n            <div class=\"modal-footer\">\n              <button type=\"button\" class=\"btn btn-outline-secondary modal-close-btn btn-close\" data-bs-dismiss=\"modal\">\u95DC\u9589</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ";
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  // Add course modal if it doesn't exist
  if (!document.getElementById("courseModal")) {
    var courseModalHTML = "\n      <div class=\"modal fade\" id=\"courseModal\" tabindex=\"-1\" aria-labelledby=\"courseModalLabel\" aria-hidden=\"true\">\n        <div class=\"modal-dialog modal-dialog-centered\">\n          <div class=\"modal-content\">\n            <div class=\"modal-header\">\n              <h5 class=\"modal-title\" id=\"courseModalLabel\">\u8AB2\u7A0B\u8CC7\u8A0A</h5>\n              <button type=\"button\" class=\"btn-close-custom text-primary\" data-bs-dismiss=\"modal\" aria-label=\"Close\">\n                <i class=\"fas fa-window-close\"></i>\n              </button>\n            </div>\n            <div class=\"modal-body\">\n              <div id=\"courseContent\"></div>\n            </div>\n            <div class=\"modal-footer\">\n              <button type=\"button\" class=\"btn btn-outline-secondary modal-close-btn btn-close\" data-bs-dismiss=\"modal\">\u95DC\u9589</button>\n            </div>\n          </div>\n        </div>\n      </div>\n    ";
    document.body.insertAdjacentHTML("beforeend", courseModalHTML);
  }

  // Helper to build social URLs if only handle is provided
  var isHttp = function isHttp(v) {
    return typeof v === "string" && /^https?:\/\//.test(v);
  };
  var buildUrl = function buildUrl(platform, v) {
    if (!v) return null;
    if (isHttp(v)) return v;
    switch (platform) {
      case "ig":
        return "https://www.instagram.com/".concat(v);
      case "fb":
        return "https://www.facebook.com/".concat(v);
      case "threads":
        return "https://www.threads.net/@".concat(v);
      case "yt":
        return "https://www.youtube.com/".concat(v);
      case "line":
        return v;
      default:
        return v;
    }
  };
  fetch("responses.json", {
    cache: "no-cache"
  }).then(function (r) {
    return r.json();
  }).then(function (list) {
    if (!Array.isArray(list)) return;

    // Check for hash filter
    var hash = window.location.hash;
    var filteredList = list;
    if (hash === "#Coach") {
      filteredList = list.filter(function (item) {
        return item.type && item.type.includes("全真教練");
      });
    } else if (hash === "#Aerobic") {
      filteredList = list.filter(function (item) {
        return item.fields && item.fields.includes("有氧");
      });
    } else if (hash === "#Yoga") {
      filteredList = list.filter(function (item) {
        return item.fields && (item.fields.includes("瑜珈") || item.fields.includes("瑜伽"));
      });
    }
    var html = filteredList.map(function (item, index) {
      var isYoga = String(item.fields || "").includes("瑜珈") || String(item.fields || "").includes("瑜伽");
      var imgSrc = isYoga ? "images/yoga".concat(index % 7 + 1, ".png") : "images/fitness".concat(index % 6 + 1, ".png");
      var lineUrl = buildUrl("line", item.Line);
      var fbUrl = buildUrl("fb", item.FB);
      var igUrl = buildUrl("ig", item.IG);
      var threadsUrl = buildUrl("threads", item.Threads);
      var ytUrl = buildUrl("yt", item["YT "]);
      return "<div class=\"d-flex\">" + "<div class=\"card bg-white rounded-2 p-2 mt-6 mb-3 w-100 d-flex flex-column\">" + "<div class=\"text-center\" style=\"margin-top:-66px;\">" + "<img class=\"card-img-top rounded-circle\" src=\"".concat(imgSrc, "\" loading=\"lazy\" alt=\"").concat(item.name || "", "\" style=\"width: 120px; height: 120px; object-fit: cover;\">") + "</div>" + "<div class=\"card-body d-flex flex-column flex-grow-1\">" + "<div class=\"text-center\">" + "<h4 id=\"name\" class=\"card-title py-2\">".concat(item.name || "未命名", "</h4>") + "<div class=\"d-flex flex-wrap justify-content-center gap-1\">" + (item.fields ? item.fields.split(",").map(function (field) {
        return field.trim();
      }).filter(function (field) {
        return field;
      }).map(function (field) {
        return "<span class=\"small badge badge-pill badge-light text-gray bg-white rounded-pill px-3 py-2 border\">".concat(field, "</span>");
      }).join("") : "") + (item.type ? item.type.split(",").map(function (type) {
        return type.trim();
      }).filter(function (type) {
        return type;
      }).map(function (type) {
        return "<span class=\"small badge badge-pill badge-light text-gray bg-white rounded-pill px-3 py-2 border\">".concat(type, "</span>");
      }).join("") : "") + "</div>" + "</div>" + "<div class=\"text-center mt-4\">" + "<i class=\"fas fa-map-marker-alt text-primary me-2\"></i>" + "<span id=\"location\" class=\"small\">".concat(item.location || "", "</span>") + "</div>" + "<div class=\"social-row d-flex justify-content-center gap-3 mt-4\" aria-label=\"social links\">" + (lineUrl ? "<a class=\"social-btn social-line\" href=\"".concat(lineUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Line\"><i class=\"fab fa-line\" aria-hidden=\"true\"></i></a>") : "") + (fbUrl ? "<a class=\"social-btn social-fb\" href=\"".concat(fbUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Facebook\"><i class=\"fab fa-facebook-f\" aria-hidden=\"true\"></i></a>") : "") + (igUrl ? "<a class=\"social-btn social-ig\" href=\"".concat(igUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Instagram\"><i class=\"fab fa-instagram\" aria-hidden=\"true\"></i></a>") : "") + (threadsUrl ? "<a class=\"social-btn social-threads\" href=\"".concat(threadsUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"Threads\"><i class=\"fab fa-threads\" aria-hidden=\"true\"></i></a>") : "") + (ytUrl ? "<a class=\"social-btn social-yt\" href=\"".concat(ytUrl, "\" target=\"_blank\" rel=\"noopener noreferrer\" aria-label=\"YouTube\"><i class=\"fab fa-youtube\" aria-hidden=\"true\"></i></a>") : "") + "</div>" + "<div class=\"d-flex justify-content-center align-items-center mt-4 mb-2\">" + (item.name && item.feedback && item.feedback.trim() ? "<a href=\"#\" class=\"feedback-link text-decoration-none\" data-name=\"".concat(encodeURIComponent(item.name), "\" data-feedback=\"").concat(encodeURIComponent(item.feedback), "\">\u5B78\u54E1\u56DE\u994B</a>") : "") + (item.name && item.feedback && item.feedback.trim() && item.otherPlaces && item.otherPlaces.trim() ? "<span class=\"mx-2 text-muted\">|</span>" : "") + (item.name && item.otherPlaces && item.otherPlaces.trim() ? "<a href=\"#\" class=\"course-link text-decoration-none\" data-name=\"".concat(encodeURIComponent(item.name), "\" data-fields=\"").concat(encodeURIComponent(item.fields || ""), "\" data-type=\"").concat(encodeURIComponent(item.type || ""), "\" data-location=\"").concat(encodeURIComponent(item.location || ""), "\" data-otherplaces=\"").concat(encodeURIComponent(item.otherPlaces), "\">\u8AB2\u7A0B\u8CC7\u8A0A</a>") : "") + "</div>" + "</div>" + "</div>" + "</div>";
    }).join("");

    // Add title based on filter
    var title = "";
    if (hash === "#Coach") {
      title = '<h1 class="text-center mb-4 text-primary">全真教練</h1>';
    } else if (hash === "#Aerobic") {
      title = '<h1 class="text-center mb-4 text-primary">有氧課程</h1>';
    } else if (hash === "#Yoga") {
      title = '<h1 class="text-center mb-4 text-primary">瑜珈課程</h1>';
    } else {
      title = '<h1 class="text-center mb-4 text-primary">所有教練與老師</h1>';
    }
    mount.innerHTML = "\n        <div class=\"container\">\n          ".concat(title, "\n          <div class=\"profiles-grid\" style=\"display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;\">\n            ").concat(html, "\n          </div>\n          <div class=\"text-center mt-5\">\n            <div class=\"d-flex flex-column flex-md-row justify-content-center align-items-center gap-3\">\n              <a href=\"https://docs.google.com/forms/d/e/1FAIpQLSeWayS7SnVsHH_OaCbyLY_bbq7tucrWgsfPd5xL9sxG-TG04A/viewform\" class=\"btn btn-outline-primary\">\n                <i class=\"fas fa-envelope me-2\"></i>\n                \u63D0\u4F9B\u6559\u7DF4\u8207\u8001\u5E2B\u8CC7\u8A0A\n              </a>\n              <a href=\"mailto:jmispace@gmail.com?subject=\u8A3B\u660E\u6388\u8AB2\u8001\u5E2B\uFF0C\u5730\u9EDE\uFF0C\u4FEE\u6B63\u9805\u76EE&body=\u8001\u5E2B\uFF1A%0D%0A\u5730\u9EDE\uFF1A%0D%0A\u4FEE\u6B63\u9805\u76EE\uFF1A%0D%0A\" class=\"btn btn-outline-primary\">\n                <i class=\"fas fa-envelope me-2\"></i>\n                \u4FEE\u6B63\u806F\u7D61\u4FE1\u7BB1\n              </a>\n            </div>\n          </div>\n        </div>\n      ");

    // Scroll to top if there's a hash filter
    if (hash) {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  })["catch"](function () {
    // silent fail
  });
}

// Initialize profiles on page load
renderProfiles();

// Listen for hash changes to re-filter content
window.addEventListener("hashchange", function () {
  var mount = document.getElementById("profiles-list");
  if (!mount) return;

  // Scroll to top of window
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  // Re-run the profile rendering with new filter
  renderProfiles();
});

// Event delegation for feedback links (outside the render function)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("feedback-link")) {
    e.preventDefault();
    var link = e.target;
    var name = decodeURIComponent(link.dataset.name);
    var feedback = decodeURIComponent(link.dataset.feedback);
    document.getElementById("feedbackModalLabel").textContent = "".concat(name, " - \u5B78\u54E1\u56DE\u994B");

    // Preserve HTML formatting from JSON
    if (feedback && feedback.trim()) {
      document.getElementById("feedbackContent").innerHTML = feedback;
    } else {
      document.getElementById("feedbackContent").innerHTML = '<p class="text-muted">暫無回饋內容</p>';
    }

    // Show modal with gentle animation
    var modalElement = document.getElementById("feedbackModal");
    if (!modalElement) {
      console.error("Modal element not found");
      return;
    }

    // Check if Bootstrap is available
    if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      // Fallback: Show modal manually
      modalElement.style.display = "block";
      modalElement.classList.add("show");
      modalElement.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      // Remove existing backdrop if any
      var existingBackdrop = document.getElementById("modalBackdrop");
      if (existingBackdrop) {
        existingBackdrop.remove();
      }

      // Add backdrop
      var backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "modalBackdrop";
      document.body.appendChild(backdrop);

      // Close modal when clicking backdrop or close button
      var _closeModal = function _closeModal() {
        modalElement.style.display = "none";
        modalElement.classList.remove("show");
        modalElement.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        var existingBackdrop = document.getElementById("modalBackdrop");
        if (existingBackdrop) {
          existingBackdrop.remove();
        }
      };
      backdrop.addEventListener("click", _closeModal);
    }
  }
});

// Event delegation for modal close buttons
document.addEventListener("click", function (e) {
  // Handle btn-close-custom class (X icon)
  if (e.target.classList.contains("btn-close-custom") || e.target.closest(".btn-close-custom")) {
    e.preventDefault();
    var modal = e.target.closest(".modal");
    if (modal) {
      closeModal(modal);
    }
  }

  // Handle modal-close-btn class (關閉 button)
  if (e.target.classList.contains("modal-close-btn")) {
    e.preventDefault();
    var _modal = e.target.closest(".modal");
    if (_modal) {
      closeModal(_modal);
    }
  }
});

// Helper function to close modal
function closeModal(modalElement) {
  modalElement.style.display = "none";
  modalElement.classList.remove("show");
  modalElement.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  // Remove backdrop
  var existingBackdrop = document.getElementById("modalBackdrop") || document.getElementById("courseModalBackdrop");
  if (existingBackdrop) {
    existingBackdrop.remove();
  }
}

// Event delegation for course links
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("course-link")) {
    e.preventDefault();
    var link = e.target;
    var name = decodeURIComponent(link.dataset.name);
    var fields = decodeURIComponent(link.dataset.fields);
    var type = decodeURIComponent(link.dataset.type);
    var location = decodeURIComponent(link.dataset.location);
    var otherPlaces = decodeURIComponent(link.dataset.otherplaces);
    document.getElementById("courseModalLabel").textContent = "".concat(name, " - \u8AB2\u7A0B\u8CC7\u8A0A");

    // Build course information content
    var courseContent = '<div class="course-info">';
    if (otherPlaces) {
      courseContent += "<div class=\"mb-3\"><span class=\"text-muted\">".concat(otherPlaces, "</span></div>");
    }
    courseContent += "</div>";
    document.getElementById("courseContent").innerHTML = courseContent;

    // Show modal with gentle animation
    var modalElement = document.getElementById("courseModal");
    if (!modalElement) {
      console.error("Course modal element not found");
      return;
    }

    // Check if Bootstrap is available
    if (typeof bootstrap !== "undefined" && bootstrap.Modal) {
      var modal = new bootstrap.Modal(modalElement);
      modal.show();
    } else {
      // Fallback: Show modal manually
      modalElement.style.display = "block";
      modalElement.classList.add("show");
      modalElement.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      // Remove existing backdrop if any
      var existingBackdrop = document.getElementById("courseModalBackdrop");
      if (existingBackdrop) {
        existingBackdrop.remove();
      }

      // Add backdrop
      var backdrop = document.createElement("div");
      backdrop.className = "modal-backdrop fade show";
      backdrop.id = "courseModalBackdrop";
      document.body.appendChild(backdrop);

      // Close modal when clicking backdrop or close button
      var _closeModal2 = function _closeModal2() {
        modalElement.style.display = "none";
        modalElement.classList.remove("show");
        modalElement.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        var existingBackdrop = document.getElementById("courseModalBackdrop");
        if (existingBackdrop) {
          existingBackdrop.remove();
        }
      };
      backdrop.addEventListener("click", _closeModal2);
      modalElement.querySelectorAll(".btn-close").forEach(function (btn) {
        return btn.addEventListener("click", _closeModal2);
      });
      modalElement.querySelector(".btn-secondary").addEventListener("click", _closeModal2);
    }
  }
});