const URL = '../db/db.json';

const FORM = document.querySelector('#calc-form');

function calc(event) {

  // console.log(event.type, event.target);

  let resultArray = [];

  axios.get(URL).then(response => {

    let resultHTML = document.querySelector('#result #res-table');
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

      const PRICE     = document.querySelector('#estate-price-input').value * 1000000, // Стоимость недвижимости
            PAY       = document.querySelector('#initial-fee-input').value * 1000000,  // Первоначальный платеж
            PERCENT   = percent,                                                       // Процентная ставка
            INSURANCE = PRICE / 100 * insurance,                                       // Страховка
            YEARS     = document.querySelector('#credit-term-input').value;            // Срок кредита

      // Если процент первоначального взноса соответсвует заданному банком, то делаем вычисление
      if(PERCENT_CUURENT_PAY >= rate && PRICE > PAY) {

        // Собственно функция ипотечного вычисления
        function ipoteka( price, pay, percent, years ) {
          var i = parseFloat( percent / 100 / 12 );
          var n = parseFloat( years * 12 );
          var r = ( price - pay ) * ( ( i * Math.pow( 1+i, n ) ) / ( Math.pow( 1+i, n ) - 1 ) );
          return r.toFixed(2);
        }

        // Пушим результаты в массив с результатами
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

      if (key % 2 === 0) {
      resultHTML.insertAdjacentHTML('beforeend', `
        <tr>
          <th scope="row">${Number(key) + 1}</th>
          <td class="animated fadeInLeft faster">${resultArray[key].name}</td>
          <td class="animated fadeInLeft faster">${resultArray[key].percent}%</td>
          <td class="animated fadeInLeft faster">${resultArray[key].monthlyPayment} руб</td>
          <td class="animated fadeInLeft faster">${resultArray[key].insurance} руб</td>
          <td class="animated fadeInLeft faster">${resultArray[key].price} руб</td>
          <td class="animated fadeInLeft faster">${resultArray[key].pay} руб</td>
          <td class="animated fadeInLeft faster">${resultArray[key].years} лет</td>
        </tr>
      `);
      } else {
        resultHTML.insertAdjacentHTML('beforeend', `
        <tr>
          <th scope="row">${Number(key) + 1}</th>
          <td class="animated fadeInRight faster">${resultArray[key].name}</td>
          <td class="animated fadeInRight faster">${resultArray[key].percent}%</td>
          <td class="animated fadeInRight faster">${resultArray[key].monthlyPayment} руб</td>
          <td class="animated fadeInRight faster">${resultArray[key].insurance} руб</td>
          <td class="animated fadeInRight faster">${resultArray[key].price} руб</td>
          <td class="animated fadeInRight faster">${resultArray[key].pay} руб</td>
          <td class="animated fadeInRight faster">${resultArray[key].years} лет</td>
        </tr>
      `);
      }
    
    }

    if (resultArray.length <= 0) {
      resultHTML.innerHTML = 'По вашему запросу результаты не найдены'
    }

  });

}

calc();

// Считаваем значения при изменении формы
FORM.addEventListener('change', calc);
estatePriceSlider.noUiSlider.on('change', calc);
initialFeeSlider.noUiSlider.on('change', calc);
creditTermSlider.noUiSlider.on('change', calc);