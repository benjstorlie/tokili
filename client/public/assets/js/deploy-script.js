const space = $("#space");
const headingArea = $("#heading-area");

const yesnoPageData = JSON.parse(`{"stamp":"yesno","title":"Yes/No","heading":{"show":false,"stamp":"heading","title":"","src":""},"cardOrder":["yes","no"],"cards":{"yes":{"stamp":"yes","show":true,"title":"yes","src":"https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee346d8221f87806d2b1eee0438431a/svgs/FirefoxEmoji/u2714-heavycheckmark.svg"},"no":{"stamp":"no","show":true,"title":"no","src":"https://raw.githubusercontent.com/mozilla/fxemoji/270af343bee346d8221f87806d2b1eee0438431a/svgs/FirefoxEmoji/u1F5D9-cancellationx.svg"}}}`);

window.onload = function() {

  let pageData;
  if (window.location.search == "?page=yesno") {
    pageData=yesnoPageData;
  } else {
    pageData = getPageData();
  }
  console.log(pageData);

  if (pageData.title) {
    console.log(pageData.title);
  }

  if (pageData.heading) {
    headingArea.append(displayHeading(pageData.heading));
  }

  for (i=0;i<pageData.cardOrder.length;i++) {
    if (pageData.cards[pageData.cardOrder[i]].show) {
      space.append(displayCard(pageData.cards[pageData.cardOrder[i]]));
    }
  }

}

class Page {
  constructor(pageData) {
    let {page_id, title='',cards={} } = pageData;
    if (card_id) {
      this.card_id = card_id;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      this.page_id = urlParams.get('page');
      this.card_id = new Date().getTime();
    }

  }
}

/**
 * Card class
 * @class 
 * @prop {String | Number} Card.card_id - Unique identifier for each card
 * @prop {String | Number} Card.page_id - The unique identifier of the page containing this card. 
 * @prop {String} Card.title - The word or phrase that will be spoken when the card is tapped
 * @prop {String} Card.src - The source url for the card's image
 * @prop {Boolean} Card.show - Whether the card is shown or hidden on the page, default is true.
 */
class Card {
  /**
   * Constructor function for class Card
   * @param {Object} [cardData] 
   * @param {String | Number} [cardData.card_id] - Unique identifier for each card
   * @param {String | Number} [cardData.page_id] - The unique identifier of the page containing this card. 
   * @param {String} [cardData.title] - The word or phrase that will be spoken when the card is tapped
   * @param {String} [cardData.src] - The source url for the card's image
   * @param {Boolean} [cardData.show] - Whether the card is shown or hidden on the page, default is true.
   */
  constructor(cardData={}) {
    let {card_id,page_id,title='', src='',show=true} = cardData;
    if (card_id) {
      this.card_id = card_id;
    } else {
      this.card_id = new Date().getTime();
    }
    if (page_id) {
      this.page_id = page_id;
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      this.page_id = urlParams.get('page');
    }
    this.title=title;
    this.src=src;
    this.show=show;
  }

  get cardData() {
    return {
      card_id: this.card_id,
      title: this.title,
      page_id: this.page_id,
      src: this.src,
      show: this.show,
    }
  }

  set cardData(cardData) {
    let {card_id,page_id,title, src,show} = cardData;
    if (card_id) {this.card_id = card_id}
    if (page_id) {this.page_id = page_id}
    if (title) {this.title = title}
    if (src) {this.src = src}
    if (show) {this.show = show}
  }

  toJSON() {
    return {Card: this.cardData}
  }
}

/**
 * @namespace render - a collection of functions
 */
const render = {
  reviver(key,value) {
    switch(key) {
      case "Page":
        return new Page(value);
        break;
      case "Card":
        return new Card(value);
        break;
      default:
        return value;
    }
  }
}

function gotoHomePage() {
  // include some kind of saving function, just in case?
  window.location.assign("./homepage.html");
}

function displayCard(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card", and has a card object inside

  const card=$("<div>").addClass("card m-1").attr("id","card-"+cardData.stamp);
  
  if (cardData.title) {
    card.append(`
      <div class="card-header">
        <h5 class="card-title">${cardData.title}</h5>
      </div>
    `)

    // Add event handler for clicking card to speak cardData.title
    card.click(function() {
      speakAndHighlight(cardData.title, card);
    })

  }
  if (cardData.src) {
    card.append(`
      <div class="h-100 p-1 img-deploy-card img-div" style="background-image:url('${cardData.src}')">
    `)
  }

  return card
}

function displayHeading(cardData) {
  // cardData should already come with a stamp
  // This returns a JQuery <div> object
  // The <div> has Bootstrap class="card", and has a card object inside

  const card=$("<div>").addClass("card d-flex flex-row").attr("id","heading");
  
  if (cardData.title) {
    card.append(`
      <div class="card-left-sider">
        <h5>${cardData.title}</h5>
      </div>
    `)

    // Add event handler for clicking card to speak cardData.title
    card.click(function() {
      speakAndHighlight(cardData.title, card);
    })

  }
  if (cardData.src) {
    card.append(`
      <div class="h-100 p-1 img-deploy-card img-div" style="background-image:url('${cardData.src}')">
    `)
  }

  return card
}

// **** functions for saving and getting from local storage ****


function getCurrentPageStamp() {
  // Gets the stamp of the current page from the url search parameters
  // So far, there's just one search parameter, "page"

  return window.location.search.slice(6);
}

function savePageData() {

  // Get page stamp from the url search parameters
  const stamp = getCurrentPageStamp();

  // See if there's a page title

  // See if there's a heading
    // If so, get its title and img src
  // Go through all the cards and get their title and img src

  // key = page stamp
  // {title: page title,
  // heading: {stamp: stamp, title: title, src: src}},
  // cards: {{carddata},{carddata},{carddata}}
  // }
}

function getPageData() {
  // return current page's data as an object
  return JSON.parse(localStorage.getItem(getCurrentPageStamp()));
}

function setPageData(object) {

  const stamp = getCurrentPageStamp();
  localStorage.setItem(stamp,JSON.stringify(object));
}

function getPageTitle() {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.title;
}

function getCardTitle(stamp) {
  // from local storage, get the title of a specific card
  const pageData = getPageData();
  return pageData.cards[stamp].title;
}

function setCardTitle(titleString) {
  let pageData = getPageData();
  pageData.cards[stamp].title = titleString;
  setPageData(pageData);
}

function getImgSrc(stamp) {
  // from local storage, get the img src of a specific card
  const pageData = getPageData();
  return pageData.cards[stamp].src;
}

function setImgSrc(stamp,src) {
  // from local storage, get the img src of a specific card
  let pageData = getPageData();
  pageData.cards[stamp].src = src;
  setPageData(pageData);
}

function speakAndHighlight(term, highlightElement) {
  let utterance = new SpeechSynthesisUtterance(term);
  highlightElement.toggleClass('active-modal');
  utterance.addEventListener("end", (event) => {
    highlightElement.toggleClass('active-modal');
  });  
  speechSynthesis.speak(utterance);
}

function emoji(unicodeCode,attributes='') {
  // returns the html text for an emoji in an <i> tag with class .btn-symbol
  // include more attributes with the optional second parameter


    return `<i class="btn-symbol" role='icon' `+attributes+`>&#x`+unicodeCode+`;</i>`
} 