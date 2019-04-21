const URL = '../db/db.json';

const FORM = document.querySelector('#calc-form');

function calc(event) {

  // console.log(event.type, event.target);

  let resultArray = [];

  axios.get(URL).then(response => {

    let resultHTML = document.querySelector('#result');
    resultHTML.innerHTML = '';
    
    const ESTATE_TYPE_SELECT     = document.querySelector('#estate-type-select').value,
          EMPLOYMENT_TYPE_SELECT = document.querySelector('#employment-type-select').value;

    // console.log(response.data[ESTATE_TYPE_SELECT][EMPLOYMENT_TYPE_SELECT]);
    
    for (let key in response.data[ESTATE_TYPE_SELECT][EMPLOYMENT_TYPE_SELECT]) {

      const BANK = response.data[ESTATE_TYPE_SELECT][EMPLOYMENT_TYPE_SELECT][key],     // Банк (как js-object)
            NAME = response.data[ESTATE_TYPE_SELECT][EMPLOYMENT_TYPE_SELECT][key].name // Название банка
            // Здесь вычисляем процент первоначального взноса по отношению к стоимости жилья
            PERCENT_CUURENT_PAY = ((document.querySelector('#initial-fee-input').value * 1000000) / (document.querySelector('#estate-price-input').value * 1000000)) * 100


      let rate,      // Сюда будем записывать процент первоначального взноса банка
          percent,   // Сюда запишем процентную ставку банка
          insurance; // Сюда - процент страховки

      let rateArray = [];

      // Здесь мы "переворачиваем" объект с процентом первоначального взноса и процентной
      // ставкой в обратную сторону
      for (let key in BANK.rate) {
        rateArray.unshift([key, BANK.rate[key]])
      }

      // Задаем текующую процентную ставку при заданном проценте первоначального взноса
      for(key in rateArray) {
        if(PERCENT_CUURENT_PAY >= rateArray[key][0]) {
          rate = rateArray[key][0];
          percent = rateArray[key][1];
          break;
        }
      }

      // Здесь нужно будет сделать по такой же аналогии, но с процентом страховки
      for (let key in BANK) {
        insurance = BANK.insurance;
        break;
      }

      // Если процент первоначального взноса соответсвует заданному банком, то делаем вычисление
      if(PERCENT_CUURENT_PAY >= rate) {

        const PRICE     = document.querySelector('#estate-price-input').value * 1000000, // Стоимость недвижимости
              PAY       = document.querySelector('#initial-fee-input').value * 1000000,  // Первоначальный платеж
              PERCENT   = percent,                                                       // Процентная ставка
              INSURANCE = PRICE / 100 * insurance,                                       // Страховка
              YEARS     = document.querySelector('#credit-term-input').value;            // Срок кредита

        function ipoteka( price, pay, percent, years ) {
          var i = parseFloat( percent / 100 / 12 );
          var n = parseFloat( years * 12 );
          var r = ( price - pay ) * ( ( i * Math.pow( 1+i, n ) ) / ( Math.pow( 1+i, n ) - 1 ) );
          return r.toFixed(2);
        }

        resultArray.push({
          name: NAME,
          price: PRICE,
          percent: PERCENT,
          monthlyPayment: ipoteka( PRICE, PAY, PERCENT, YEARS ),
          insurance: INSURANCE,
          pay: PAY,
          years: YEARS
        });

      }

    }

    for (key in resultArray) {

      document.querySelector('#result').insertAdjacentHTML('beforeend', `
        <div class="row justify-content-between flex-nowrap">
          <div class="col">Название банка: <b>${resultArray[key].name}</b></div>
          <div class="col">Процентная ставка банка:  <b>${resultArray[key].percent}%</b></div>
          <div class="col">Ежемесячный платеж: <b>${resultArray[key].monthlyPayment} руб</b></div>
          <div class="col">Стоимость страховки: <b>${resultArray[key].insurance} руб</b></div>
          <div class="col">Общая сумма кредита: <b>${resultArray[key].price} руб</b></div>
          <div class="col">Первый платеж: <b>${resultArray[key].pay} руб</b></div>
          <div class="col">Срок кредита: <b>${resultArray[key].years} лет</b></div>
        </div>
      `);
    
    }

  });

}

calc();

// Считаваем значения при изменении формы
FORM.addEventListener('change', calc);
estatePriceSlider.noUiSlider.on('change.one', calc);
initialFeeSlider.noUiSlider.on('change.one', calc);
creditTermSlider.noUiSlider.on('change.one', calc);