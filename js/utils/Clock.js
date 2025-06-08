import moment from 'moment';

export default class Clock {
  constructor(dateElem, hourElem) {
    this.dateElem = dateElem;
    this.hourElem = hourElem;
    moment.locale('en');
  }

  start() {
    this.update();
    this.intervalId = setInterval(() => this.update(), 1000);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  update() {
    const now = moment();
    this.dateElem.textContent = now.format("dddd, MMMM Do YYYY");
    this.hourElem.textContent = now.format("h:mm");
  }
}
