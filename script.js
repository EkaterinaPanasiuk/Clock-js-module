function CLockController() {
  let container = null;
  let model = null;

  this.init = function (containerDOM, modelObject) {
    //инициализация контейнера и модели
    container = containerDOM;
    model = modelObject;

    document.addEventListener("DOMContentLoaded", this.drawDom); //по загрузке рисуем котейнер в ДОм
    document.addEventListener("DOMContentLoaded", this.startTime); //по загрузке запускаем часы
    document.addEventListener("DOMContentLoaded", this.drawClock); //по загрузке рисуем котейнер в канвас

    const btnStop = container.querySelector(".btn-stop"); //находим кнопку стоп по клику запускаем по ней остановку часов
    btnStop.addEventListener("click", this.stopTime);

    const btnStart = container.querySelector(".btn-start"); //находим кнопку стопб по клику возобновляем аботу часов
    btnStart.addEventListener("click", this.startTime);
  };
  this.drawDom = function () {
    model.drawDom();
  };
  this.drawClock = function () {
    model.drawClock();
  };

  this.stopTime = function () {
    model.stopTime();
  };
  this.startTime = function () {
    model.startTime();
  };
}

function CLockModel() {
  let view = null;
  let timeOffset = null;
  let time = null;
  let timer = null;
  this.width = 300;
  this.height = this.width;
  this.strokeWidth = 5;
  this.RadiusSmal = this.width / 20;
  const timeData = {}; //объект хранит данные о текущей дате

  /* иницилизируем даные */
  this.init = function (viewObject, timeUTCOffsetInHour) {
    view = viewObject;
    timeOffset = timeUTCOffsetInHour;
  };
  /* объект-чранилищу лданных о часах */
  const clockData = {
    buttonWidth: this.width / 4,
    buttonHeight: this.width / 10,
    yellow: "rgba(240, 232, 11, 0.57)",
    blue: "rgba(0, 48, 161, 0.91)",
    black: "black",
    green: "rgba(42, 218, 27, 0.63)",
    strokeWidth: this.strokeWidth,
    solid: "solid",
    absolutePos: "absolute",
    relativePos: "relative",
    width: this.width,
    height: this.height,
    Pi: Math.PI,
    angleRotation: Math.PI / 6,
    fontSize: `${this.width / 15}px`,
    center: this.width / 2,
    RadisBig: (this.width - this.strokeWidth) / 2,
    RadiusSmal: this.width / 20,
    radiusBigForSmallCircle: (this.width - 3 * this.RadiusSmal) / 2,
    borderRadius: "50%",
    hourArrLength: this.width / 5,
    hourArrWidth: 5,
    minuteLength: this.width / 4,
    minuteWidth: 3,
    secondLength: this.width / 3,
    secondWidth: 2,
    hourArr: [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], //создаем массив цифр циферблата

    //функция расчета координат У для поворота стрелок
    calculateY: function (i, radius) {
      let y = Number(
        this.center + radius * Math.sin(i * this.angleRotation - Math.PI / 2)
      );
      return y;
    },

    //функция расчета координат  х для поворота стрелок
    calculateX: function (i, radius) {
      let x = Number(
        this.center + radius * Math.cos(i * this.angleRotation - Math.PI / 2)
      );
      return x;
    },
  };

  /*  функция останавливает пересчет данных о текущем времени и тим останавливает часы */
  this.stopTime = function () {
    clearTimeout(timer);
  };

  /* функция получает значения текущего времени и записывает в хэшtimeData
   *запускает интервал, который обновляет время */
  this.startTime = function () {
    time = new Date();
    let hours = time.getHours(); //определяем часы

    this.updateHourUTC(hours); //вызываем функцию приведения часов к нужному часовому поясу

    timeData.minutes = time.getMinutes(); //определяем минуты
    timeData.seconds = time.getSeconds(); ////определяем секунды

    this.drawClock(clockData, timeData); //запускает отрисовку часов
    this.drawAnimationElement(clockData, timeData);
    timer = setTimeout(() => this.updateTime(), 1000);
    timer;
  };

  /* функция вызывает обновление параметрова даты в функции  startTime*/
  this.updateTime = function () {
    this.startTime();
  };

  // изменение часового пояса по отношению к текущему времени
  this.updateHourUTC = function (hours) {
    hours += timeOffset;
    if (hours > 12) {
      hours = hours % 12;
    }
    timeData.hours = hours;
  };

  this.drawDom = function () {
    view.drawStatic(clockData);
  };

  this.drawClock = function () {
    //     view.drawClock(clockData, timeData);
  };
  this.drawAnimationElement = function () {
    view.drawAnimationElement(clockData, timeData);
  };
}

/*** начало***********************DOM-view******************* * */
function CLockViewDOM() {
  let container = null;
  let model = null;

  this.init = function (containerDOM, modelObject) {
    container = containerDOM;
    model = modelObject;
  };
  /* запуск отрисовки статичных элементов часов */
  this.drawStatic = function (clockData) {
    //создаем контейнер-обертку  в верстке
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    container.append(wrapper);
    //задаем высоту/Ширину контейнеру, чтобы влезло все содержимое
    container.style.height = `${
      clockData.height + clockData.buttonWidth + 100
    }px`;
    container.style.minuteWidth = `${clockData.width + 50}px`;
    wrapper.style.width = clockData.width + "px";
    wrapper.style.height = clockData.height + "px";
    // создаем в контейнере кнопку "СТОП"
    const btnStop = container.querySelector(".btn-stop");
    btnStop.style.width = clockData.buttonWidth + "px";
    btnStop.style.height = clockData.buttonHeight + "px";
    btnStop.innerText = "STOP";
    // создаем в контейнере кнопку "Старт"
    const btnStart = container.querySelector(".btn-start");
    btnStart.style.width = clockData.buttonWidth + "px";
    btnStart.style.height = clockData.buttonHeight + "px";
    btnStart.innerText = "START";

    const wrapperClock = document.createElement("div");
    wrapperClock.classList.add("wrapper-clock");
    wrapper.append(wrapperClock);
    wrapperClock.style.position = clockData.relativePos;
    wrapperClock.style.width = clockData.width + "px";
    wrapperClock.style.height = clockData.height + "px";
    wrapperClock.style.border = `${clockData.strokeWidth}px  ${clockData.solid} ${clockData.blue} `;
    wrapperClock.style.borderRadius = clockData.borderRadius;
    wrapperClock.style.backgroundColor = clockData.yellow;

    //рисуем цифры на циферблате
    // в цикле присваиваем значение цифрам циферблата
    for (let i = 0; i < clockData.hourArr.length; i++) {
      this.createClockItem(i, clockData);
    }

    //создаем элементы-стрелки
    const hourArrow = document.createElement("div");
    wrapperClock.append(hourArrow);
    hourArrow.classList.add("hour-arrow");
    hourArrow.style.width = clockData.hourArrWidth + "px";
    hourArrow.style.height = clockData.hourArrLength + "px";
    hourArrow.style.backgroundColor = clockData.black;
    hourArrow.style.position = clockData.absolutePos;
    hourArrow.style.top = clockData.center + "px";
    hourArrow.style.left = clockData.center + "px";
    hourArrow.style.transformOrigin = "top left";

    const minuteArrow = document.createElement("div");
    wrapperClock.append(minuteArrow);
    minuteArrow.classList.add("minute-arrow");
    minuteArrow.style.width = clockData.minuteWidth + "px";
    minuteArrow.style.height = clockData.minuteLength + "px";
    minuteArrow.style.backgroundColor = clockData.black;
    minuteArrow.style.position = clockData.absolutePos;
    minuteArrow.style.top = clockData.center + "px";
    minuteArrow.style.left = clockData.center + "px";
    minuteArrow.style.transformOrigin = "top left";

    const secondArrow = document.createElement("div");
    wrapperClock.append(secondArrow);
    secondArrow.classList.add("second-arrow");
    secondArrow.style.width = clockData.secondWidth + "px";
    secondArrow.style.height = clockData.secondLength + "px";
    secondArrow.style.backgroundColor = clockData.black;
    secondArrow.style.position = clockData.absolutePos;
    secondArrow.style.top = clockData.center + "px";
    secondArrow.style.left = clockData.center + "px";
    secondArrow.style.transformOrigin = "top left";
  };
  this.createClockItem = function (i, clockData) {
    let wrapperClock = container.querySelector(".wrapper-clock"); // нашли контейнер
    let clockItem = document.createElement("div"); // создали элемент
    clockItem.classList.add("clock-Item");
    clockItem.style.position = clockData.absolutePos;
    clockItem.style.top = `${clockData.calculateY(
      i,
      clockData.radiusBigForSmallCircle
    )}px`; // задали положение по ОУ
    clockItem.style.left = `${clockData.calculateX(
      i,
      clockData.radiusBigForSmallCircle
    )}px`; //задали положение по ОХ
    clockItem.textContent = clockData.hourArr[i];
    clockItem.style.width = 1.5 * clockData.RadiusSmal + "px";
    clockItem.style.height = 1.5 * clockData.RadiusSmal + "px";
    clockItem.style.border = `${clockData.strokeWidth / 2}px  ${
      clockData.solid
    } ${clockData.blue} `;
    clockItem.style.borderRadius = clockData.borderRadius;
    clockItem.style.display = "flex";
    clockItem.style.justifyContent = "center";
    clockItem.style.alignItems = "center";
    clockItem.style.transform = "translate(-50%, -50%)";
    clockItem.style.backgroundColor = clockData.green;
    clockItem.style.fontSize = `${clockData.fontSize} `;
    wrapperClock.append(clockItem);
  };

  /* запуск отрисовки движения стрелок*/
  this.drawAnimationElement = function (clockData, timeData) {
    //  let wrapperClock = container.querySelector('.wrapper-clock');// нашли контейнер
    let minuteArrow = container.querySelector(".minute-arrow"); // нашли контейнер
    let hourArrow = container.querySelector(".hour-arrow"); // нашли контейнер
    let secondArrow = container.querySelector(".second-arrow"); // нашли контейнер

    //поворот часовой стрелки
    hourArrow.style.transform = `rotate(${
      timeData.hours * 30 + timeData.minutes / 2 - 180
    }deg)`;

    //поворот минутной стрелки
    minuteArrow.style.transform = `rotate(${timeData.minutes * 6 - 90}deg)`;

    //поворот секундной стрелки
    secondArrow.style.transform = `rotate(${timeData.seconds * 6 - 90}deg)`;
  };
}

/*** конец***********************DOM-view******************* * */

/*** начало***********************Canvas-view******************* * */
function CLockViewCanvas() {
  let container = null;
  let model = null;

  this.init = function (containerDOM, modelObject) {
    container = containerDOM;
    model = modelObject;
  };

  this.drawStatic = function (clockData) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    container.append(wrapper);
    //задаем высоту/Ширину контейнеру, чтобы влезло все содержимое
    container.style.height = `${
      clockData.height + clockData.buttonWidth + 100
    }px`;
    container.style.minuteWidth = `${clockData.width + 50}px`;
    wrapper.style.width = clockData.width + "px";
    wrapper.style.height = clockData.height + "px";

    const btnStop = container.querySelector(".btn-stop");
    btnStop.style.width = clockData.buttonWidth + "px";
    btnStop.style.height = clockData.buttonHeight + "px";
    btnStop.innerText = "STOP";

    const btnStart = container.querySelector(".btn-start");
    btnStart.style.width = clockData.buttonWidth + "px";
    btnStart.style.height = clockData.buttonHeight + "px";
    btnStart.innerText = "START";

    /* создаем контейнер для канвас*/
    const canvas = document.createElement("canvas");
    canvas.setAttribute("id", "clock");
    canvas.setAttribute("width", clockData.width);
    canvas.setAttribute("height", clockData.height);
    wrapper.append(canvas);
  };
  /* т.к. канвас нельзя изменить, только отрисовать заново, то постоянно отрисовываем весь холст заново */
  this.drawAnimationElement = function (clockData, timeData) {
    //рсуем циферблат
    let canvas = container.querySelector("#clock");
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, clockData.width, clockData.height);
    context.strokeStyle = clockData.blue; //линия обводки
    context.fillStyle = clockData.yellow; //заливка цветом
    context.lineWidth = clockData.strokeWidth; //ширина обводки
    context.beginPath(); //начало линии
    context.arc(
      clockData.center,
      clockData.center,
      clockData.RadisBig,
      0,
      2 * Math.PI,
      true
    ); //окружность в центре с большим радиусом
    context.fill(); //залили
    context.stroke(); //обвели
    // циклом запускаем создание цифр в циферблате
    for (let i = 0; i < 12; i++) {
      this.smalCircle(i, clockData);
    }
    //часовая стрелка
    context.strokeStyle = clockData.black; //черная обводка
    context.lineWidth = clockData.hourArrWidth; //ширина обводки
    context.beginPath(); //начало отрисовки
    context.moveTo(clockData.center, clockData.center); //линия стартует из центра
    //вызываем функции calculateX/Y для расчета координт конца линии
    context.lineTo(
      clockData.calculateX(
        timeData.hours + timeData.minutes / 60,
        clockData.hourArrLength
      ),
      clockData.calculateY(timeData.hours, clockData.hourArrLength)
    );
    context.closePath();
    context.stroke();
    /* минутная стрелка */
    context.lineWidth = clockData.minuteWidth; //ширина обводки
    context.beginPath(); //начало отрисовки
    context.moveTo(clockData.center, clockData.center); //линия стартует из центра
    context.lineTo(
      clockData.calculateX(timeData.minutes / 5, clockData.minuteLength),
      clockData.calculateY(timeData.minutes / 5, clockData.minuteLength)
    );
    context.closePath();
    context.stroke();
    /* seconds стрелка */
    context.lineWidth = clockData.secondWidth; //ширина обводки
    context.beginPath(); //начало отрисовки
    context.moveTo(clockData.center, clockData.center); //линия стартует из центра
    context.lineTo(
      clockData.calculateX(timeData.seconds / 5, clockData.secondLength),
      clockData.calculateY(timeData.seconds / 5, clockData.secondLength)
    );
    context.closePath();
    context.stroke();
  };
  /* рисуем зеленые крги и цифры в них */
  this.smalCircle = function (i, clockData) {
    let canvas = container.querySelector("#clock");
    let context = canvas.getContext("2d");
    const x = clockData.calculateX(i, clockData.radiusBigForSmallCircle);
    const y = clockData.calculateY(i, clockData.radiusBigForSmallCircle);
    //рисуем зеленые круги без обводки с зеленым фоном
    context.strokeStyle = clockData.blue;
    context.lineWidth = clockData.strokeWidth / 2;
    context.fillStyle = clockData.green;
    context.beginPath();
    context.arc(x, y, clockData.RadiusSmal, 0, 2 * Math.PI, true);
    context.fill();
    context.stroke();

    //отрисовывем цифры циферблата
    context.fillStyle = clockData.black; //цвет заливки
    context.font = `${clockData.fontSize} sans-serif`; //размер шрифта
    context.textAlign = "center"; //центровка относительно координт
    context.textBaseline = "center"; //центровка относительно координт
    //сaма цифра береться из массива по индексу i и вставляеться по вычисленным координатам
    context.fillText(
      `${clockData.hourArr[i]}`,
      x,
      y + parseInt(clockData.fontSize) / 5
    );
  };
}
/*** конец***********************Canvas-view******************* * */

/*** начало***********************SVG-view******************* * */
function CLockViewSVG() {
  let container = null;
  let model = null;
  const svgNS = "http://www.w3.org/2000/svg";

  this.init = function (containerDOM, modelObject) {
    container = containerDOM;
    model = modelObject;
  };
  /* запуск отрисовки статичных ДОМ и элементов часов */
  this.drawStatic = function (clockData) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    container.append(wrapper);
    //задаем высоту/Ширину контейнеру, чтобы влезло все содержимое
    container.style.height = `${
      clockData.height + clockData.buttonWidth + 100
    }px`;
    container.style.minuteWidth = `${clockData.width + 50}px`;
    //задаем высоту/Ширину контейнеру, чтобы влезло все содержимое
    container.style.height = `${
      clockData.height + clockData.buttonWidth + 100
    }px`;
    container.style.minuteWidth = `${clockData.width + 50}px`;

    /* отрисовка элементов-кнопок */
    const btnStop = container.querySelector(".btn-stop");
    btnStop.style.width = clockData.buttonWidth + "px";
    btnStop.style.height = clockData.buttonHeight + "px";
    btnStop.innerText = "STOP";

    const btnStart = container.querySelector(".btn-start");
    btnStart.style.width = clockData.buttonWidth + "px";
    btnStart.style.height = clockData.buttonHeight + "px";
    btnStart.innerText = "START";
    //запуск отрисовки статики часов
    this.drawClock(clockData);
  };

  /* создаем контейнер для svg*/
  this.drawClock = function (clockData) {
    let wrapper = container.querySelector(".wrapper");
    let wrapperClock = document.createElement("div");
    wrapperClock.classList.add("wrapper-clock");
    wrapperClock.style.position = clockData.relativePos;
    wrapperClock.style.width = clockData.width + "px";
    wrapperClock.style.height = clockData.height + "px";
    wrapper.append(wrapperClock);

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttributeNS(null, "width", clockData.width); //задаем атрибут ширины
    svg.setAttributeNS(null, "height", clockData.height); //задаем атрибут высоты
    svg.setAttributeNS(null, "class", "svgID"); //добавляем ID
    svg.setAttributeNS(null, "fill", "none"); //прозрачная заливка
    wrapperClock.append(svg);
    /*---------------рисуем фоновый желтый круг-циферблат----------------*/
    const bigCircle = document.createElementNS(svgNS, "circle");
    bigCircle.setAttributeNS(null, "cx", clockData.center); //задаем координаты центр оХ
    bigCircle.setAttributeNS(null, "cy", clockData.center); //задаем координаты центр оУ
    bigCircle.setAttributeNS(
      null,
      "r",
      (clockData.width - clockData.strokeWidth) / 2
    ); //задаем радиус
    bigCircle.setAttributeNS(null, "stroke", clockData.blue); //обводку
    bigCircle.setAttributeNS(null, "fill", clockData.yellow); //заливка цветом
    bigCircle.setAttributeNS(null, "stroke-width", clockData.strokeWidth); //ширина обводки
    svg.append(bigCircle); //вставляем круг в тег svg

    /*--------------центральный черный круг------------------*/
    const centralCircle = document.createElementNS(svgNS, "circle");
    centralCircle.setAttributeNS(null, "cx", clockData.center); //задаем координаты центр оХ
    centralCircle.setAttributeNS(null, "cy", clockData.center); //задаем координаты центр оУ
    centralCircle.setAttributeNS(null, "r", clockData.width / 40); //задаем радиус
    centralCircle.setAttributeNS(null, "fill", clockData.black); //заливка цветом
    svg.append(centralCircle); //вставляем круг в тег svg

    /* циклом вставляем зеленые круги и цифры циферблата */
    for (let i = 0; i < 12; i++) {
      this.drawSmalCircle(i, clockData);
      this.textCreate(i, clockData);
    }
    //создаем элементы-стрелки
    const hourArrow = document.createElement("div");
    wrapperClock.append(hourArrow);
    hourArrow.classList.add("hour-arrow");
    hourArrow.style.width = clockData.hourArrWidth + "px";
    hourArrow.style.height = clockData.hourArrLength + "px";
    hourArrow.style.backgroundColor = clockData.black;
    hourArrow.style.position = clockData.absolutePos;
    hourArrow.style.top = clockData.center + "px";
    hourArrow.style.left = clockData.center + "px";
    hourArrow.style.transformOrigin = "top left";

    const minuteArrow = document.createElement("div");
    wrapperClock.append(minuteArrow);
    minuteArrow.classList.add("minute-arrow");
    minuteArrow.style.width = clockData.minuteWidth + "px";
    minuteArrow.style.height = clockData.minuteLength + "px";
    minuteArrow.style.backgroundColor = clockData.black;
    minuteArrow.style.position = clockData.absolutePos;
    minuteArrow.style.top = clockData.center + "px";
    minuteArrow.style.left = clockData.center + "px";
    minuteArrow.style.transformOrigin = "top left";

    const secondArrow = document.createElement("div");
    wrapperClock.append(secondArrow);
    secondArrow.classList.add("second-arrow");
    secondArrow.style.width = clockData.secondWidth + "px";
    secondArrow.style.height = clockData.secondLength + "px";
    secondArrow.style.backgroundColor = clockData.black;
    secondArrow.style.position = clockData.absolutePos;
    secondArrow.style.top = clockData.center + "px";
    secondArrow.style.left = clockData.center + "px";
    secondArrow.style.transformOrigin = "top left";
  };
  this.drawSmalCircle = function (i, clockData) {
    /*---------------зеленые круги циферблата------------*/
    const svg = container.querySelector(".svgID");
    //вычисляем координаты центра зеленых кругов по х и у
    let x = clockData.calculateX(i, clockData.radiusBigForSmallCircle);
    let y = clockData.calculateY(i, clockData.radiusBigForSmallCircle);
    // создание аттрибута  circkle и описание его аттрибутов
    // svg
    const smalCircle = document.createElementNS(svgNS, "circle");
    smalCircle.setAttributeNS(null, "cx", x);
    smalCircle.setAttributeNS(null, "cy", y);
    smalCircle.setAttributeNS(null, "r", clockData.RadiusSmal);
    smalCircle.setAttributeNS(null, "stroke", clockData.blue);
    smalCircle.setAttributeNS(null, "fill", clockData.green);
    smalCircle.setAttributeNS(null, "stroke-width", clockData.strokeWidth / 2);
    // вставляем circle в svg
    svg.append(smalCircle);
  };

  this.textCreate = function (i, clockData) {
    const svg = container.querySelector(".svgID");
    let x = clockData.calculateX(i, clockData.radiusBigForSmallCircle);
    let y = clockData.calculateY(i, clockData.radiusBigForSmallCircle);
    //задаем смещение по оУ для текста
    const bias = parseInt(parseInt(clockData.fontSize) / 2);
    //создаем тег text  и записываем его атриббуты
    const textSVG = document.createElementNS(svgNS, "text");
    textSVG.setAttributeNS(null, "x", x); //координата Х
    textSVG.setAttributeNS(null, "text-anchor", "middle"); //координата Х
    textSVG.setAttributeNS(null, "y", y + bias / 2); //координата У
    textSVG.setAttributeNS(null, "font-size", clockData.fontSize); // размер шрифта
    // textSVG.setAttributeNS(null,  "font-weight", 'bold')// размер шрифта
    textSVG.setAttributeNS(null, "fill", clockData.black); //цвет цифры
    textSVG.setAttributeNS(null, "stroke", clockData.black); //цвет цифры
    textSVG.setAttributeNS(null, "text-align", "center"); //
    let text = clockData.hourArr[i]; // сам текст
    textSVG.append(text); //вставляем значение текста в атрибут text SVG
    svg.append(textSVG); //вставляем атрибут text в svg
  };
  /* запуск отрисовки движения стрелок*/
  this.drawAnimationElement = function (clockData, timeData) {
    //  let wrapperClock = container.querySelector('.wrapper-clock');// нашли контейнер
    let minuteArrow = container.querySelector(".minute-arrow"); // нашли контейнер
    let hourArrow = container.querySelector(".hour-arrow"); // нашли контейнер
    let secondArrow = container.querySelector(".second-arrow"); // нашли контейнер

    //поворот часовой стрелки
    hourArrow.style.transform = `rotate(${
      timeData.hours * 30 + timeData.minutes / 2 - 180
    }deg)`;

    //поворот минутной стрелки
    minuteArrow.style.transform = `rotate(${timeData.minutes * 6 - 90}deg)`;

    //поворот секундной стрелки
    secondArrow.style.transform = `rotate(${timeData.seconds * 6 - 90}deg)`;
  };
}
/*** конец***********************SVG-view******************* * */

/*создаем обьекты классов с помощью функций -конструкторов, инициализируем объекты через
функии init*/
const containerDOM1 = document.querySelector("#canvas-1-wrapper");
const timeUTCOffsetInHour1 = 0; //смещение часового пояса

const myModel = new CLockModel();
const myView = new CLockViewCanvas();
const myController = new CLockController();
myModel.init(myView, timeUTCOffsetInHour1);
myView.init(containerDOM1);
myController.init(containerDOM1, myModel);

const containerDOM2 = document.querySelector("#canvas-2-wrapper");
const timeUTCOffsetInHour2 = 2;

const myModel2 = new CLockModel();
const myView2 = new CLockViewCanvas();
const myController2 = new CLockController();
myModel2.init(myView2, timeUTCOffsetInHour2);
myView2.init(containerDOM2);
myController2.init(containerDOM2, myModel2);

const containerDOM3 = document.querySelector("#dom-1-wrapper");
const timeUTCOffsetInHour3 = 3;

const myModel3 = new CLockModel();
const myView3 = new CLockViewDOM();
const myController3 = new CLockController();
myModel3.init(myView3, timeUTCOffsetInHour3);
myView3.init(containerDOM3);
myController3.init(containerDOM3, myModel3);

const containerDOM4 = document.querySelector("#dom-2-wrapper");
const timeUTCOffsetInHour4 = -6;

const myModel4 = new CLockModel();
const myView4 = new CLockViewDOM();
const myController4 = new CLockController();
myModel4.init(myView4, timeUTCOffsetInHour4);
myView4.init(containerDOM4);
myController4.init(containerDOM4, myModel4);

const containerDOM5 = document.querySelector("#svg-1-wrapper");
const timeUTCOffsetInHour5 = -4;

const myModel5 = new CLockModel();
const myView5 = new CLockViewSVG();
const myController5 = new CLockController();
myModel5.init(myView5, timeUTCOffsetInHour5);
myView5.init(containerDOM5);
myController5.init(containerDOM5, myModel5);

const containerDOM6 = document.querySelector("#svg-2-wrapper");
const timeUTCOffsetInHour6 = -4;

const myModel6 = new CLockModel();
const myView6 = new CLockViewSVG();
const myController6 = new CLockController();
myModel6.init(myView6, timeUTCOffsetInHour6);
myView6.init(containerDOM6);
myController6.init(containerDOM6, myModel6);
