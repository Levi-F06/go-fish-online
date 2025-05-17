const rangeValue = document.querySelector("#range-value");
const rangeSlider = document.querySelector("#range-slider");

rangeSlider.addEventListener("change", () => {
  rangeValue.textContent = rangeSlider.value;
});
