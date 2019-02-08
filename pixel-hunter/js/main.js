(function () {
'use strict';

const GameScreenTypes = {
  'ONE-OF-THREE': `GAME-3`,
  'TINDER-LIKE': `GAME-2`,
  'TWO-OF-TWO': `GAME-1`
};

const ImageTypes = {
  'PAINTING': `paint`,
  'PHOTO': `photo`
};


const adaptServerData = (data) => {
  return data.map((item) => {
    return {
      type: GameScreenTypes[item.type.toUpperCase()],
      question: item.question,
      images: item.answers.map(({type, image: {url, width, height}}) => ({
        src: url,
        width,
        height,
        type: ImageTypes[type.toUpperCase()]
      }))
    };
  });
};

const contentContainer = document.querySelector(`.central`);

const renderScreen = (element) => {
  contentContainer.innerHTML = ``;
  contentContainer.appendChild(element);
};

const onLoadError = (errorMessage) => {
  const node = document.createElement(`div`);
  node.textContent = errorMessage;
  node.setAttribute(`class`, `error-message`);
  document.body.insertAdjacentElement(`afterbegin`, node);
  setTimeout(function () {
    const Message = document.querySelector(`.error-message`);
    document.body.removeChild(Message);
  }, 5000);
};

const LENGTH_ARR_ANSWERS = 10;
const MIN_LIVES = 0;

const StatPoints = {
  CORRECT_ANSWER: 100,
  FAST_ANSWER: 50,
  SLOW_ANSWER: 50,
  LIVE: 50
};

const AnswerDurations = {
  FAST: 20,
  SLOW: 10
};

const countScore = (data, lives) => {
  if (lives < MIN_LIVES) {
    return false;
  }
  if (data.answers && data.answers.length !== LENGTH_ARR_ANSWERS) {
    return false;
  }
  const answersPoints = data.answers.reduce((previousValue, item) => {
    if (item) {
      previousValue += StatPoints.CORRECT_ANSWER;
    }
    return previousValue;
  }, 0);

  const answersDurationPoints = data.time.reduce((previousValue, item) => {
    if (item >= AnswerDurations.FAST) {
      previousValue += StatPoints.FAST_ANSWER;
    } else if (item < AnswerDurations.SLOW) {
      previousValue -= StatPoints.SLOW_ANSWER;
    }
    return previousValue;
  }, 0);

  return (lives * StatPoints.LIVE) + answersPoints + answersDurationPoints;
};

const INITIAL_LIVES = 3;
const ScreenTypes = {
  INTRO: `INTRO`,
  GREETING: `GREETING`,
  RULES: `RULES`,
  STATS: `STATS`
};
const AnswerTypes = {
  FAST: `fast`,
  SLOW: `slow`,
  SUCCESS: `succes`,
  FAIL: `fail`
};

class GameModel {
  constructor(handleDataLoad) {
    this._handleDataLoad = handleDataLoad;
    this._dataLoaded = false;
    this._onLoadError = onLoadError;
    this._state = null;
    this.restart = this.restart.bind(this);
    this._loader = this._loader.bind(this);
    this._onLoad = this._onLoad.bind(this);
    this._levelsData = [];
    this.init = this.init.bind(this);
    this.restart();
  }


  get gameData() {
    return {
      currentLevel: this._state.currentLevel,
      answers: this._state.answers,
      lives: this._state.lives,
      levels: this._state.levels,
      userName: this._state.userName,
      questionStats: this._state.questionStats,
      timeOver: this._state.timeOver,
      time: this._state.time
    };
  }


  _getIntro() {
    return {
      type: ScreenTypes.INTRO,
      dataLoaded: this._dataLoaded
    };
  }

  static _getGreeting() {
    return {
      type: ScreenTypes.GREETING
    };
  }

  static _getRules() {
    return {
      type: ScreenTypes.RULES,
      userName: ``
    };
  }

  static _getStats() {
    return {
      type: ScreenTypes.STATS
    };
  }

  _onLoad(data) {
    this._dataLoaded = true;
    this._levelsData = data;
    this._state.levels = this._getGameList();
    if (typeof this._handleDataLoad === `function`) {
      return this._handleDataLoad();
    }
    return false;
  }

  _loader() {
    const onLoad = this._onLoad;
    let formatData;
    window.fetch(`https://es.dump.academy/pixel-hunter/questions`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 404) {
            return Promise.reject(`Файлы на сервере не найдены`);
          }
          return Promise.reject(`Неизвестный статус: ${response.status} ${response.statusText}`);
        })
        .then((data) => {
          formatData = adaptServerData(data);
          return onLoad(formatData);
        })
        .catch((err) => {
          if (err.stack === `TypeError: Failed to fetch`) {
            return this._onLoadError(`Сервер недоступен`);
          }
          return this._onLoadError(`Ошибка: ${err}`);
        });
  }

  _getGameList() {
    return [this._getIntro(), GameModel._getGreeting(), GameModel._getRules(), ...this._levelsData, GameModel._getStats()];
  }

  static _getQuestionStats(time) {
    if (time >= AnswerDurations.FAST) {
      return AnswerTypes.FAST;
    } else if (time <= AnswerDurations.SLOW) {
      return AnswerTypes.SLOW;
    }
    return AnswerTypes.SUCCESS;
  }


  init() {
    this._state = {
      stats: [],
      lives: INITIAL_LIVES,
      answers: [],
      levels: this._getGameList(),
      currentLevel: 0,
      userName: ``,
      questionStats: [],
      time: []
    };
    if (!this._dataLoaded) {
      this._loader();
    }
  }

  setSuccessAnswer(time) {
    this._state.answers.push(true);
    this._state.questionStats.push(GameModel._getQuestionStats(time));
    this._state.time.push(time);
  }

  restart() {
    this.init();
  }

  setWrongAnswer() {
    this._state.answers.push(false);
    this._state.lives--;
    this._state.currentLevel++;
    this._state.questionStats.push(AnswerTypes.FAIL);
    if (this._state.lives < 0) {
      this._state.currentLevel = this._state.levels.length - 1;
    }
  }

  setTimeOut() {
    this._state.time.push(TimerValues.MAX);
    this._state.questionStats.push(AnswerTypes.FAIL);
    this._state.currentLevel++;
    this._state.lives--;
  }

  savePlayerName(playerName) {
    this._state.userName = playerName;
  }

  setNextScreen() {
    this._state.currentLevel++;
  }
}

const timer = function (time) {
  if (typeof time !== `number`) {
    throw new Error(`Значение не числового типа`);
  }

  if (time < 0) {
    throw new Error(`Время не может быть отрицательным`);
  }

  return {
    value: time,
    tick() {
      if (time > 0) {
        this.value--;
      } else if (time === 0) {
        return `Время вышло`;
      }
      return this.value;
    }
  };
};

const createElement = (template) => {
  return document.createRange().createContextualFragment(template);
};

const FOOTER = ` <footer class="footer">
    <a href="https://htmlacademy.ru" class="social-link social-link--academy">HTML Academy</a>
    <span class="footer__made-in">Сделано в <a href="https://htmlacademy.ru" class="footer__link">HTML Academy</a> &copy; 2016</span>
    <div class="footer__social-links">
      <a href="https://twitter.com/htmlacademy_ru" class="social-link  social-link--tw">Твиттер</a>
      <a href="https://www.instagram.com/htmlacademy/" class="social-link  social-link--ins">Инстаграм</a>
      <a href="https://www.facebook.com/htmlacademy" class="social-link  social-link--fb">Фэйсбук</a>
      <a href="https://vk.com/htmlacademy" class="social-link  social-link--vk">Вконтакте</a>
    </div>
  </footer>`;

class AbstractView {
  constructor(dispatch) {
    if (new.target === AbstractView) {
      throw new Error(`Нельзя создать AbstractView`);
    }
    if (!dispatch) {
      throw new Error(`Не передан dispatch`);
    }
    this.dispatch = this.dispatch.bind(this);
    this._footer = FOOTER;
    this._dispach = dispatch;
  }
  get template() {
    throw new Error(`Не найден подходящий шаблон`);
  }

  get element() {
    if (this._element) {
      return this._element;
    } else {
      this._element = this.render().cloneNode(true);
      this.bind(this._element);
      return this._element;
    }
  }

  get timer() {
    return this.element.querySelector(`.game__timer`);
  }

  render() {
    return createElement(this.template);
  }

  dispatch(data) {
    return this._dispach(data);
  }

  bind() {
  }
}

class GreetingView extends AbstractView {
  constructor(dispatch) {
    super(dispatch);
    this.onMouseDownGreeting = this.onMouseDownGreeting.bind(this);
  }

  get template() {
    return `<div class="greeting central--blur">
    <div class="greeting__logo"><img src="img/logo_big.png" width="201" height="89" alt="Pixel Hunter"></div>
    <h1 class="greeting__asterisk">*</h1>
    <div class="greeting__challenge">
      <h3>Лучшие художники-фотореалисты бросают&nbsp;тебе&nbsp;вызов!</h3>
      <p>Правила игры просты.<br>
        Нужно отличить рисунок&nbsp;от фотографии и сделать выбор.<br>
        Задача кажется тривиальной, но не думай, что все так просто.<br>
        Фотореализм обманчив и коварен.<br>
        Помни, главное — смотреть очень внимательно.</p>
    </div>
    <div class="greeting__continue"><span><img src="img/arrow_right.svg" width="64" height="64" alt="Next"></span></div>
  </div>
      ${this._footer}`;
  }

  bind() {
    this._nextBtn = this.element.querySelector(`.greeting__continue`);
    this._nextBtn.addEventListener(`mousedown`, this.onMouseDownGreeting);
  }

  onMouseDownGreeting() {
    this._nextBtn.removeEventListener(`mousedown`, this.onMouseDownGreeting);
    this.dispatch({status: GameStatuses.SUCCES, isGame: false});
  }
}

class IntroView extends AbstractView {
  constructor(dispatch, levelData) {
    super(dispatch);
    this._levelData = levelData;
    this.onMouseDownAsterisk = this.onMouseDownAsterisk.bind(this);
  }

  get template() {
    return `<div id="main" class="central__content"> 
      <div id="intro" class="intro">
        <h1 class="intro__asterisk">${this._levelData.dataLoaded ? `*` : `загрузка`}</h1>
        <img src="" alt="" width="50">
        <p class="intro__motto"><sup>*</sup> Это не фото. Это рисунок маслом нидерландского художника-фотореалиста Tjalf Sparnaay.</p>
       </div>
    </div>
      ${this._footer}`;
  }

  bind() {
    this._ASTERISK = this.element.querySelector(`.intro__asterisk`);
    this._ASTERISK.addEventListener(`mousedown`, this.onMouseDownAsterisk);
  }

  onMouseDownAsterisk() {
    this._ASTERISK.removeEventListener(`mousedown`, this.onMouseDownAsterisk);
    this.dispatch({status: GameStatuses.SUCCES, isGame: false});
  }
}

const headerStatistics = (state) =>
  `<header class="header">
    <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>
    <h1 class="game__timer"></h1>
    <div class="game__lives">
    ${new Array(3 - state.lives).fill(`<img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">`).join(``)}
    ${new Array(state.lives).fill(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">`).join(``)}
    </div>
  </header>`;

const HEADER = `<header class="header">
    <div class="header__back">
      <button class="back">
        <img src="img/arrow_left.svg" alt="Back" width="45" height="45">
        <img src="img/logo_small.svg" width="101" height="44">
      </button>
    </div>
  </header>`;

class RulesView extends AbstractView {
  constructor(dispatch) {
    super(dispatch);
    this.onMouseDownButtonGo = this.onMouseDownButtonGo.bind(this);
    this.onMouseDownButtonBack = this.onMouseDownButtonBack.bind(this);
    this.onKeyUpInputName = this.onKeyUpInputName.bind(this);
    this.header = HEADER;
  }

  get template() {
    return `${this.header}
<div class="rules">
    <h1 class="rules__title">Правила</h1>
    <p class="rules__description">Угадай 10 раз для каждого изображения фото <img
      src="img/photo_icon.png" width="16" height="16"> или рисунок <img
      src="img/paint_icon.png" width="16" height="16" alt="">.<br>
      Фотографиями или рисунками могут быть оба изображения.<br>
      На каждую попытку отводится 30 секунд.<br>
      Ошибиться можно не более 3 раз.<br>
      <br>
      Готовы?
    </p>
    <form class="rules__form">
      <input class="rules__input" autofocus type="text" placeholder="Ваше Имя">
      <button class="rules__button  continue" type="submit" disabled>Go!</button>
    </form>
  </div>
      ${this._footer}`;
  }

  bind() {
    this.buttonGo = this.element.querySelector(`.rules__button`);
    this.buttonBack = this.element.querySelector(`.header__back`);
    this.inputName = this.element.querySelector(`.rules__input`);
    this.buttonGo.addEventListener(`mousedown`, this.onMouseDownButtonGo);
    this.buttonBack.addEventListener(`mousedown`, this.onMouseDownButtonBack);
    this.inputName.addEventListener(`keyup`, this.onKeyUpInputName);
  }

  onKeyUpInputName() {
    if (this.inputName.value.length) {
      this.buttonGo.removeAttribute(`disabled`);
    } else {
      this.buttonGo.setAttribute(`disabled`, `disabled`);
    }
  }

  removeListeners() {
    this.buttonGo.removeEventListener(`mousedown`, this.onMouseDownButtonGo);
    this.buttonBack.removeEventListener(`mousedown`, this.onMouseDownButtonBack);
    this.inputName.removeEventListener(`keyup`, this.onKeyUpInputName);
  }

  onMouseDownButtonGo(evt) {
    evt.preventDefault();
    this.removeListeners();
    this.dispatch({status: GameStatuses.SUCCES, isGame: false, name: this.inputName.value});
  }

  onMouseDownButtonBack() {
    this.removeListeners();
    this.dispatch({status: GameStatuses.GO_BACK});
  }
}

const LENGTH_STATS = 10;

const drawStats = (stats) => {
  const arrayStats = new Array(LENGTH_STATS).fill(`<li class="stats__result stats__result--unknown"></li>`);

  stats.forEach((item, index) =>{
    if (item === AnswerTypes.SUCCESS) {
      arrayStats[index] = `<li class="stats__result stats__result--correct"></li>`;
    } else if (item === AnswerTypes.FAIL) {
      arrayStats[index] = `<li class="stats__result stats__result--wrong"></li>`;
    } else if (item === AnswerTypes.SLOW) {
      arrayStats[index] = `<li class="stats__result stats__result--slow"></li>`;
    } else if (item === AnswerTypes.FAST) {
      arrayStats[index] = `<li class="stats__result stats__result--fast"></li>`;
    }
  });
  return arrayStats.join(``);
};

const stats = (statsList) => `
      <ul class="stats">
        ${drawStats(statsList)}
      </ul>`;

const templateFirst = (data, statsData) => {
  return `<div class="game">
    <p class="game__task">${data.question}</p>
    <form class="game__content">
      <div class="game__option">
        <img src="${data.images[0].src}" alt="Option 1" width="${data.images[0].width}" height="${data.images[0].height}">
        <label class="game__answer game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
      <div class="game__option">
        <img src="${data.images[1].src}" alt="Option 2" width="${data.images[1].width}" height="${data.images[1].height}">
        <label class="game__answer  game__answer--photo">
          <input name="question2" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--paint">
          <input name="question2" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    <div class="stats">
    ${stats(statsData)}
    </div>
  </div>
  `;
};


const templateSecond = (data, statsData) => `<div class="game">
    <p class="game__task">${data.question}</p>
    <form class="game__content  game__content--wide">
      <div class="game__option">
        <img src="${data.images[0].src}" alt="Option 1" width="${data.images[0].width}" height="${data.images[0].height}">
        <label class="game__answer  game__answer--photo">
          <input name="question1" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer  game__answer--wide  game__answer--paint">
          <input name="question1" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>
    </form>
    <div class="stats">
    ${stats(statsData)}
    </div>
  </div>
  `;

const templateThird = (data, statsData) => `
  <div class="game">
    <p class="game__task">${data.question}</p>
    <form class="game__content  game__content--triple">
      <div class="game__option">
        <img src="${data.images[0].src}" alt="Option 1" data="${data.images[0].type}" width="${data.images[0].width}" height="${data.images[0].height}">
      </div>
      <div class="game__option  game__option--selected">
        <img src="${data.images[1].src}" alt="Option 1" data="${data.images[1].type}" width="${data.images[0].width}" height="${data.images[1].height}">
      </div>
      <div class="game__option">
        <img src="${data.images[2].src}" alt="Option 1" data="${data.images[2].type}" width="${data.images[0].width}" height="${data.images[2].height}">
      </div>
    </form>
    <div class="stats">
  ${stats(statsData)}
  </div>
  </div>
  `;

const MODAL = `
<div class="modal">
	<div class="modal__wrapper">
		<h3 class="modal__title">Результаты игры будет не сохранены. <br>Продолжить?</h3>
		<button class="back">Да</button>
		<button class="still">Нет</button>
	</div>
	<div class="modal__overlay"></div>
</div>
`;

class GameTwoView extends AbstractView {
  constructor(dispatch, levelData, stats) {
    super(dispatch);
    this._levelData = levelData;
    this._stats = stats;
    this._headerStatistics = headerStatistics;
    this._templateSecomnd = templateSecond;
    this._gameImages = levelData.images;
    this.onMouseDownButtonBack = this.onMouseDownButtonBack.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onMouseDownModal = this.onMouseDownModal.bind(this);
    this._modaltemplate = MODAL;
  }

  get template() {
    return `${this._headerStatistics(this._stats)} ${this._templateSecomnd(this._levelData, this._stats.questionStats)} ${this._footer} ${this._modaltemplate}`;
  }

  bind() {
    this._buttonBack = this.element.querySelector(`.header__back`);
    this._timeAnswer = this.element.querySelector(`.game__timer`);
    this._gameContent = this.element.querySelector(`.game__content`);
    this._modal = this.element.querySelector(`.modal`);
    this._buttonBack.addEventListener(`mousedown`, this.onMouseDownButtonBack);
    this._gameContent.addEventListener(`change`, this.onChangeInput);
    this._modal.classList.add(`modal--close`);
  }

  removeListeners() {
    this._buttonBack.removeEventListener(`mousedown`, this.onMouseDownButtonBack);
    this._gameContent.removeEventListener(`change`, this.onChangeInput);
  }

  removeModalListener() {
    this._modal.removeEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownButtonBack() {
    this._modal.classList.remove(`modal--close`);
    this._modal.addEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownModal(evt) {
    if (evt.target.className === `back`) {
      this.removeListeners();
      this.removeModalListener();
      this.dispatch({status: GameStatuses.GO_BACK, isGame: true});
    } else {
      this.removeModalListener();
      this._modal.classList.add(`modal--close`);
    }
  }

  onChangeInput(evt) {
    this.removeListeners();
    if (this._gameImages[0].type === evt.target.value) {
      this.dispatch({status: GameStatuses.SUCCES, time: this._timeAnswer.innerText, isGame: true});
    } else {
      this.dispatch({status: GameStatuses.FAIL, isGame: true});
    }
  }
}

const Questions = {
  FIRST: `question1`,
  SECOND: `question2`
};

class GameOneView extends AbstractView {
  constructor(dispatch, levelData, stats) {
    super(dispatch);
    this._levelData = levelData;
    this._stats = stats;
    this._headerStatistics = headerStatistics;
    this._templateFirst = templateFirst;
    this._chekedOne = false;
    this._chekedTwo = false;
    this._gameImages = levelData.images;
    this._modalTemplate = MODAL;
    this.onMouseDownButtonBack = this.onMouseDownButtonBack.bind(this);
    this.onChangeInput = this.onChangeInput.bind(this);
    this.onMouseDownModal = this.onMouseDownModal.bind(this);
    this.setNextScreen = this.setNextScreen.bind(this);
  }

  get template() {
    return `${this._headerStatistics(this._stats)} ${this._templateFirst(this._levelData, this._stats.questionStats)} ${this._footer} ${this._modalTemplate}`;
  }

  bind() {
    this._buttonBack = this.element.querySelector(`.header__back`);
    this._timeAnswer = this.element.querySelector(`.game__timer`);
    this._modal = this.element.querySelector(`.modal`);
    this._gameContent = this.element.querySelector(`.game__content`);

    this._buttonBack.addEventListener(`mousedown`, this.onMouseDownButtonBack);
    this._gameContent.addEventListener(`change`, this.onChangeInput);
    this._modal.classList.add(`modal--close`);
  }

  removeListeners() {
    this._buttonBack.removeEventListener(`mousedown`, this.onMouseDownButtonBack);
    this._gameContent.removeEventListener(`change`, this.onChangeInput);
  }
  removeModalListener() {
    this._modal.removeEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownButtonBack() {
    this._modal.classList.remove(`modal--close`);
    this._modal.addEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownModal(evt) {
    if (evt.target.className === `back`) {
      this.removeListeners();
      this.removeModalListener();
      this.dispatch({status: GameStatuses.GO_BACK, isGame: true});
    } else {
      this.removeModalListener();
      this._modal.classList.add(`modal--close`);
    }
  }

  setNextScreen() {
    if (this._chekedOne && this._chekedTwo) {
      this.removeListeners();
      if (this._gameImages[0].type === this._chekedOne && this._gameImages[1].type === this._chekedTwo) {
        this.dispatch({status: GameStatuses.SUCCES, time: this._timeAnswer.innerText, isGame: true});
      } else {
        this.dispatch({status: GameStatuses.FAIL, isGame: true});
      }
      this._chekedOne = false;
      this._chekedTwo = false;
    }
  }

  onChangeInput(evt) {
    if (evt.target.name === Questions.FIRST) {
      this._chekedOne = evt.target.value;
    } else if (evt.target.name === Questions.SECOND) {
      this._chekedTwo = evt.target.value;
    }
    this.setNextScreen();
  }

}

const AnswerTypes$1 = {
  PAINT: `paint`,
  PHOTO: `photo`
};

class GameThreeView extends AbstractView {
  constructor(dispatch, levelData, stats) {
    super(dispatch);
    this._levelData = levelData;
    this._stats = stats;
    this._headerStatistics = headerStatistics;
    this._templateThird = templateThird;
    this._modalTemplate = MODAL;

    this.onMouseDownButtonBack = this.onMouseDownButtonBack.bind(this);
    this.onMouseDownModal = this.onMouseDownModal.bind(this);
    this.onMouseDownGameCard = this.onMouseDownGameCard.bind(this);
  }

  get template() {
    return `${this._headerStatistics(this._stats)} ${this._templateThird(this._levelData, this._stats.questionStats)} ${this._footer} ${this._modalTemplate}`;
  }

  bind() {
    this.buttonBack = this.element.querySelector(`.header__back`);
    this.gameCards = this.element.querySelectorAll(`.game__option`);
    this._gameContent = this.element.querySelector(`.game__content`);
    this._modal = this.element.querySelector(`.modal`);
    this._timeAnswer = this.element.querySelector(`.game__timer`);
    this.buttonBack.addEventListener(`mousedown`, this.onMouseDownButtonBack);
    this._gameContent.addEventListener(`mousedown`, this.onMouseDownGameCard);
    this._modal.classList.add(`modal--close`);
  }

  removeListeners() {
    this._gameContent.removeEventListener(`mousedown`, this.onMouseDownGameCard);
    this.buttonBack.removeEventListener(`mousedown`, this.onMouseDownButtonBack);
  }

  removeModalListener() {
    this._modal.removeEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownButtonBack() {
    this._modal.classList.remove(`modal--close`);
    this._modal.addEventListener(`mousedown`, this.onMouseDownModal);
  }

  onMouseDownModal(evt) {
    if (evt.target.className === `back`) {
      this.removeListeners();
      this.removeModalListener();
      this.dispatch({status: GameStatuses.GO_BACK, isGame: true});
    } else {
      this.removeModalListener();
      this._modal.classList.add(`modal--close`);
    }
  }

  onMouseDownGameCard(evt) {
    this.removeListeners();
    const correctAnswer = () => {
      let counterPaint = 0;
      let counterPhoto = 0;

      for (let gameCard of this.gameCards) {
        if (gameCard.children[0].attributes[2].value === AnswerTypes$1.PAINT) {
          counterPaint++;
        } else {
          counterPhoto++;
        }
      }
      return counterPhoto > counterPaint ? AnswerTypes$1.PAINT : AnswerTypes$1.PHOTO;
    };
    if (evt.target.attributes[2].value === correctAnswer()) {
      this.dispatch({status: GameStatuses.SUCCES, time: this._timeAnswer.innerText, isGame: true});
    } else {
      this.dispatch({status: GameStatuses.FAIL, isGame: true});
    }
  }
}

const countStat = (arrayAnswers) => {
  const counter = {
    fast: 0,
    slow: 0,
    total: 0
  };

  for (let answer of arrayAnswers) {
    if (answer === AnswerTypes.FAST) {
      counter.fast++;
    } else if (answer === AnswerTypes.SLOW) {
      counter.slow++;
    }
    if (answer !== AnswerTypes.FAIL) {
      counter.total++;
    }
  }
  return counter;
};

const winTemplate = (gameData) => {
  const countedStats = countStat(gameData.questionStats);
  return `<div class="result">
<h1>Победа!</h1>
  <table class="result__table">
      <tr>
        <td class="result__number">1.</td>
        <td colspan="2">
          ${stats(gameData.questionStats)}
        </td>
        <td class="result__points">×&nbsp;${StatPoints.CORRECT_ANSWER}</td>
        <td class="result__total">${countedStats.total * StatPoints.CORRECT_ANSWER}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Бонус за скорость:</td>
        <td class="result__extra">${countedStats.fast}&nbsp;<span class="stats__result stats__result--fast"></span></td>
        <td class="result__points">×&nbsp;${StatPoints.FAST_ANSWER}</td>
        <td class="result__total">${countedStats.fast * StatPoints.FAST_ANSWER}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Бонус за жизни:</td>
        <td class="result__extra">${gameData.lives}&nbsp;<span class="stats__result stats__result--alive"></span></td>
        <td class="result__points">×&nbsp;${StatPoints.LIVE}</td>
        <td class="result__total">${gameData.lives * StatPoints.LIVE}</td>
      </tr>
      <tr>
        <td></td>
        <td class="result__extra">Штраф за медлительность:</td>
        <td class="result__extra">${countedStats.slow}&nbsp;<span class="stats__result stats__result--slow"></span></td>
        <td class="result__points">×&nbsp;${StatPoints.SLOW_ANSWER}</td>
        <td class="result__total">-${countedStats.slow * StatPoints.SLOW_ANSWER}</td>
      </tr>
      <tr>
        <td colspan="5" class="result__total  result__total--final">${countScore(gameData, gameData.lives)}</td>
      </tr>
    </table>
</div>`;
};


const failTemplate = (gameData) =>
  `<div class="result">
<h1>Поражение!</h1>
<table class="result__table">
    <tr>
    <td class="result__number">1.</td>
    <td>
    ${stats(gameData.questionStats)}
    </td>
    <td class="result__total"></td>
    <td class="result__total  result__total--final">fail</td>
    </tr>
    </table>
</div>`;

const historyTemplate = (gameData, index) =>{
  const resultTotat = countScore(gameData, gameData.lives);
  return `<div class="result">
<table class="result__table">
    <tr>
    <td class="result__number">${index + 1}</td>
    <td>
    ${stats(gameData.questionStats)}
    </td>
    <td class="result__total"></td>
    <td class="result__total  result__total--final">${resultTotat ? resultTotat : `FAIL` }</td>
    </tr>
    </table>
</div>`;
};

const compareTotalPoints = (itemOne, itemTwo) => {
  return itemTwo.totalPoints - itemOne.totalPoints;
};

class StatsView extends AbstractView {
  constructor(dispatch, status, stats) {
    super(dispatch);
    this._status = status;
    this._stats = stats;
    this._header = HEADER;
    this.applicationId = 215150;
    this._html = ``;
    this._countScore = countScore;
    this._onLoadError = onLoadError;
    this._onLoad = this._onLoad.bind(this);
    this.onMouseDownButtonBack = this.onMouseDownButtonBack.bind(this);
    this.getUserData();
    this.postData();
  }

  postData() {
    fetch(`https://es.dump.academy/pixel-hunter/stats/:${this.applicationId}-:${this._stats.userName}`, {
      method: `POST`,
      body: JSON.stringify({
        'questionStats': this._stats.questionStats,
        'lives': this._stats.lives,
        'status': `historyGame`,
        'answers': this._stats.answers,
        'time': this._stats.time
      }),
      headers: {
        'Content-Type': `application/json`
      }
    })
        .then((response) => {
          if (!response.ok) {
            Promise.reject(`Произошла ошибка, при отправлении данных.`);
          }
        })
        .catch((err) => {
          if (err.stack === `TypeError: Failed to fetch`) {
            return this._onLoadError(`Ошибка при отправлении данных: Сервер недоступен`);
          }
          return this._onLoadError(`Ошибка при отправлении данных: ${err}`);
        });
  }

  _onLoad(data) {
    const serverData = data;
    const historyContainer = document.createDocumentFragment();
    const lastGameScore = this._countScore(this._stats, this._stats.lives);
    const historyTitle = document.createElement(`h2`);
    let lastGamePosition = 1;
    historyTitle.textContent = `Предыдущие результаты`;
    historyContainer.appendChild(historyTitle);

    const countingUserStatistics = serverData.map((item) => {
      item.totalPoints = this._countScore(item, item.lives);
      return item;
    });

    countingUserStatistics.sort(compareTotalPoints);

    countingUserStatistics.forEach((item, index) => {
      if (item.totalPoints > lastGameScore) {
        lastGamePosition = index + 2;
      }
      const templateElement = this._createTemplate(item.status, item, index);
      historyContainer.appendChild(createElement(templateElement));
    });

    this.resultNumber.textContent = `${lastGamePosition}`;
    this.resultContainer.appendChild(historyContainer);
  }

  _getCheckData(data) {
    return this._onLoad(data);
  }


  getUserData() {
    window.fetch(`https://es.dump.academy/pixel-hunter/stats/:${this.applicationId}-:${this._stats.userName}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else if (response.status === 404) {
            return Promise.reject(`Cтатистики прошлых игр нет`);
          }
          throw new Error(`Неизвестный статус: ${response.status} ${response.statusText}`);
        })
        .then((data) => {
          return this._getCheckData(data);
        })
        .catch((err) => {
          if (err.stack === `TypeError: Failed to fetch`) {
            return this._onLoadError(`Сервер со статистикой недоступен`);
          } else if (err === `Cтатистики прошлых игр нет`) {
            return this._onLoadError(err);
          }
          return this._onLoadError(`Неизвестная ошибка: ${err} свяжитесь с администратором`);
        });
  }

  _createTemplate(gameStatus, stats, index) {
    if (gameStatus === GameStatuses.FAIL) {
      this._html = failTemplate(stats);
    } else if (gameStatus === GameStatuses.HISTORY) {
      this._html = historyTemplate(stats, index);
    } else {
      this._html = winTemplate(stats);
    }
    return this._html;
  }

  get template() {
    return `${this._header} ${this._createTemplate(this._status, this._stats)} ${this._footer}`;
  }

  bind() {
    this.buttonBack = this.element.querySelector(`.header__back`);
    this.resultNumber = this.element.querySelector(`.result__number`);
    this.resultContainer = this.element.querySelector(`.result`);
    this.buttonBack.addEventListener(`mousedown`, this.onMouseDownButtonBack);
  }

  onMouseDownButtonBack() {
    this.buttonBack.removeEventListener(`mousedown`, this.onMouseDownButtonBack);
    this.dispatch({status: GameStatuses.GO_BACK, isGame: false});
  }

}

const TimerValues = {
  MAX: 30,
  BLINK: 5
};
const LevelScreens = {
  'INTRO': IntroView,
  'GREETING': GreetingView,
  'RULES': RulesView,
  'GAME-1': GameOneView,
  'GAME-2': GameTwoView,
  'GAME-3': GameThreeView,
  'STATS': StatsView
};
const GameStatuses = {
  SUCCES: `succes`,
  FAIL: `fail`,
  TIMEOUT: `timeOut`,
  HISTORY: `historyGame`,
  GO_BACK: `goBack`
};

class GameDispatcher {
  constructor() {
    this.run = this.run.bind(this);
    this._timer = null;
    this._handlerDispatcher = this._handlerDispatcher.bind(this);
    this._handleDataLoad = this._handleDataLoad.bind(this);
    this._data = new GameModel(this._handleDataLoad);
  }
  _handleDataLoad() {
    this.run();
  }

  _handlerDispatcher({status, time, isGame, name}) {
    if (isGame) {
      this._stopTimer();
    }
    if (status === GameStatuses.SUCCES) {
      if (name) {
        this._data.savePlayerName(name);
      } else if (time) {
        this._data.setSuccessAnswer(time);
      }
      this._data.setNextScreen();
    } else if (status === GameStatuses.GO_BACK) {
      this._data.restart();
    } else if (status === GameStatuses.FAIL) {
      this._data.setWrongAnswer();
    }
    this.run();
  }

  run() {
    const gameData = this._data.gameData;
    const levelData = gameData.levels[gameData.currentLevel];
    if (gameData.currentLevel === 0) {
      renderScreen(new IntroView(this._handlerDispatcher, levelData).element);
    } else if (gameData.lives < 0) {
      renderScreen(new StatsView(this._handlerDispatcher, GameStatuses.FAIL, gameData).element);
    } else if (gameData.currentLevel <= 14) {
      const levelScreen = new LevelScreens[levelData.type](this._handlerDispatcher, levelData, gameData);
      const element = levelScreen.timer;
      renderScreen(levelScreen.element);
      this._initTimer(element, TimerValues.MAX);
    }
  }

  _initTimer(element, sec) {
    let time = sec;
    if (element !== null) {
      element.textContent = sec;
      this._timer = setInterval(() => {
        if (time === 1) {
          this._stopTimer();
          this._data.setTimeOut();
          this.run();
        }
        time = GameDispatcher._getNextTick(time);
        GameDispatcher._renderTimer(element, time);
      }, 1000);
    }

  }

  static _getNextTick(sec) {
    return timer(sec).tick();
  }

  static _renderTimer(element, value) {
    element.textContent = value;
    if (value === TimerValues.BLINK) {
      element.classList.add(`blink`);
    }
  }

  _stopTimer() {
    clearInterval(this._timer);
  }
}

const game = new GameDispatcher();
game.run();

}());

//# sourceMappingURL=main.js.map
