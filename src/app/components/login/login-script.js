// login-script.js
document.addEventListener("DOMContentLoaded", function() {
  const sign_in_btn = document.querySelector("#sign-in-btn");
  const sign_up_btn = document.querySelector("#sign-up-btn");
  const container = document.querySelector(".container");

  sign_up_btn.addEventListener("click", function() {
    container.classList.add("sign-up-mode");
  });

  sign_in_btn.addEventListener("click", function() {
    container.classList.remove("sign-up-mode");
  });
});
