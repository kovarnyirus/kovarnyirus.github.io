var click = document.querySelector(".search-title");
var popup = document.querySelector(".search-form");
click.addEventListener("click", function(event) {
    event.preventDefault();
    popup.classList.toggle("search-form-show");
  });
