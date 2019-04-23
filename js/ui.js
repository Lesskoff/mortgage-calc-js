// document.addEventListener('DOMContentLoaded', function() {

// Инициализация Materialize-select
var elems = document.querySelectorAll('select');
var instances = M.FormSelect.init(elems /*, options */);

// Стоимость недвижимости - слайдер
var estatePriceSlider = document.getElementById("estate-price-slider");
noUiSlider.create(estatePriceSlider, {
  start: 5,
  connect: [true, false],
  step: 0.1,
  orientation: "horizontal", // 'horizontal' or 'vertical'
  animate: false,
  range: {
    min: 1,
    max: 20
  },
  format: wNumb({
    decimals: 1
  })
});

// Инициализация input для слайдера стоимости недвижимости
var estatePriceInputFormat = document.getElementById('estate-price-input');

estatePriceSlider.noUiSlider.on('update', (values, handle) => {
  estatePriceInputFormat.value = values[handle];
});

estatePriceInputFormat.addEventListener('change', () => {
  estatePriceSlider.noUiSlider.set(this.value);
});

// Первоначальный взнос - слайдер
var initialFeeSlider = document.getElementById("initial-fee-slider");
noUiSlider.create(initialFeeSlider, {
  start: 0.5,
  connect: [true, false],
  step: 0.1,
  orientation: "horizontal", // 'horizontal' or 'vertical'
  animate: false,
  range: {
    min: 0,
    max: 20
  },
  format: wNumb({
    decimals: 1
  })
});

// Инициализация input для слайдера первоначального взноса
var initialFeeInputFormat = document.getElementById('initial-fee-input');

initialFeeSlider.noUiSlider.on('update', (values, handle) => {
  initialFeeInputFormat.value = values[handle];
});

initialFeeInputFormat.addEventListener('change', () => {
  initialFeeSlider.noUiSlider.set(this.value);
});

// Срок кредита - слайдер
var creditTermSlider = document.getElementById("credit-term-slider");
noUiSlider.create(creditTermSlider, {
  start: 15,
  connect: [true, false],
  step: 1,
  orientation: "horizontal", // 'horizontal' or 'vertical'
  animate: false,
  range: {
    min: 5,
    max: 50
  },
  format: wNumb({
    decimals: 0
  })
});

// Инициализация input для слайдера срока кредита
var creditTermInputFormat = document.getElementById('credit-term-input');

creditTermSlider.noUiSlider.on('update', (values, handle) => {
  creditTermInputFormat.value = values[handle];
});

creditTermInputFormat.addEventListener('change', () => {
  creditTermSlider.noUiSlider.set(this.value);
});



var lockedState = true;
var lockedSlider = true;

// lockedValues = [
//   Number(estatePriceSlider.noUiSlider.get()),
//   Number(initialFeeSlider.noUiSlider.get())
// ]

function crossUpdate(value, slider) {
  if ((Number(estatePriceSlider.noUiSlider.get()) < Number(initialFeeSlider.noUiSlider.get()))) {
    // If the sliders aren't interlocked, don't
    // cross-update.
    if (!lockedState) return;

    // // Select whether to increase or decrease
    // // the other slider value.
    // var a = estatePriceSlider === slider ? 0 : 1;

    // // Invert a
    // var b = a ? 0 : 1;

    // value -= lockedValues[b] - lockedValues[a];

    // Set the value
    slider.noUiSlider.set(value);
  }
}

estatePriceSlider.noUiSlider.on('slide', function (values, handle) {
  crossUpdate(values[handle], initialFeeSlider);
});

initialFeeSlider.noUiSlider.on('slide', function (values, handle) {
  crossUpdate(values[handle], estatePriceSlider);
});
