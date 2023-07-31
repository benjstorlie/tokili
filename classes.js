window.onload = function () {

  // Elements

  /** The element filling the viewport that all other elements are children of @type {jQuery} */
  const $windowContainer = $("#window-container")
  /** Where most of the cards go @type {jQuery} */
  const $cardDeck = $("#card-deck");
  /** Where the heading, or "add heading" button goes @type {jQuery} */
  const $headingArea = $("#heading-area");

  /** Either "editor.html" or "deploy.html" @type {String} */
  const view = location.pathname.split('/').pop();

  /** The Board this page is displaying @type {Board} */
  const board = retrieveBoard();

  if (view === "editor.html") {
    board.renderAllCards();
  }

}


/** Assigning a variable "board: Board" for the page, based on the search parameters.
 * If there are no search parameter "board" or the id does not exist in local storage, it will create a new board instance and store it, then redirect the page if necessary.
 * @returns {Board | void}
*/
function retrieveBoard() {
  /** URL search param value for key "board". @type {String} */
  let boardId = new URLSearchParams(location.search).get("board");

  if (!boardId) {
    const board = new Board();
    board.storeAll( () => location.replace(`./editor.html?board=${board.id}`) );
  } else {
    try {
      return  Board.retrieve(boardId);
    } catch {
      const board = new Board({id: boardId});
      board.storeAll( );
      return board;
    }
  }
}

function gotoHomePage() {
  // include some kind of saving function, just in case?
  location.assign("./homepage.html");
}

function deploy() {
  // include some kind of saving function, just in case?
  location.assign("./deploy.html"+location.search);
}

/**
 * Get a random ID
 * @param {number} [length] - length of ID 
 * @returns {string}
 */
const newID = (length = 8) => {
  try {
    return crypto.randomUUID().slice(-1*length);
  } catch {
    return String(new Date().getTime()).slice(-1*length);
  }
}

/**
 * returns the html text for an emoji in an `<i>` tag with class .btn-symbol
 * @param {string} unicodeCode - unicode for emoji
 * @param {string} [attributes] - any extra html attributes to include in the `<i>` tag 
 * @returns {string}
 */
function emoji(unicodeCode,attributes='') {
  return `<i class="btn-symbol" role='icon' ${attributes}>&#x${unicodeCode};</i>`
} 

/**
 * The structure of the object in local storage in key `tokili-board-${this.id}`
 * @typedef BoardStore
 * @prop {string} id - board's id number
 * @prop {string} title - title of board
 * @prop {string[]} cards - array of card key ids, in the form `tokili-card-${this.cardId}`, the key they're saved in localstorage under
*/

/**
 * @class
 * @prop {string} id - board's id number
 * @prop {string} title - title of board
 * @prop {Card[]} cards - array of Card instances, cards[0] is the heading.
 */
class Board {
  constructor(data={}) {
    this.id = data.id || newID();
    this.title = data.title || "";
    this.cards = data.cards || [ new Heading({show: false})]; 
  }

  /**
   * The heading is the card at index 0.  It should always be present, even as a blank card.
   * @returns {Heading}
   */
  get heading() {
    if (this.cards[0]) {
      return this.cards[0];
    } else {
      this.cards[0] = new Heading({show: false});
      return this.cards[0];
    }
  }

  static retrieve(boardId) {
    try {
      const board = new Board(JSON.parse(localStorage.getItem(`tokili-board-${boardId}`)));
      board.cards.forEach((cardId,index) => {
        board.cards[index] = index === 0 ? Heading.retrieve(cardId) : Card.retrieve(cardId)
      })
      return board;
    } catch {
      throw new Error("Could not retrieve board "+boardId);
    }
  }

  /**
   * Set in Local Storage, with key `tokili-board-${this.id}`
   * @param {function} [cb] - callback function
   */
  store(cb) {
    localStorage.setItem(
      `tokili-board-${this.id}`,
      JSON.stringify({
        id: this.id,
        title: this.title,
        cards: this.cards.map(card => `tokili-card-${card.id}`), // store cards by their ids 
      })
    );
    if (cb) {cb()}
  }

    /**
   * Set in Local Storage, with key `tokili-board-${this.id}` AND store each card as well.
   * @param {function} [cb] - callback function
   */
  storeAll(cb) {
    this.store();
    this.cards.forEach(card => {
      card.store();
    });
    if (cb) {cb()}
  }

  /**
   * @returns {JQuery} - html
   */
  renderMenuCard() {
    return $( `
    <div class="card board-card m-1" data-id="${this.id}">
      <div style="display: flex; align-self: center; text-align: center; height: 20vh; width: 28vw; max-width: fit-content;">
        <img class="img-page-card card-img-top" style="height: 100%; width: 100%;" src="${this.menuImgSrc}">
      </div>
      <div class="card-footer" style="text-align: center;">
        <h5 class="card-title" style="font-size: 2.5vw;">
          ${this.title}
        </h5>
      </div>
    </div>
    ` )
  }

  get menuImgSrc() {
    // Get heading img src.
    // Else get one of the cards' img src
    // Else default img
    return "./assets/images/img-sample.png"
  }

  /**
   * Render Card and render Modal for each card (apart from the heading, since those are pre-rendered);
   */
  renderAllCards() {
    this.cards.forEach((card) => {
      card.renderAll();
    })
  }

  renderEditorEventListeners() {
    $("#heading-btn").click(() => {
      this.heading.showCard()
    });
    $("#add-card-btn").click(() => {
      this.addCard();
    });
  }

  addCard() {
    // see if there's a hidden card first
    let card = this.cards.find( (card, index) => !card.show && index>0 );
    if ( card ) {
      card.showCard();
    } else {
      // Create a new card instance
      card = new Card();
      card.store();
      card.renderAll();
      this.cards.push(card);
      this.store();
    }
  }
}

/**
 * @class
 * @prop {string} id - the card's id
 * @prop {string} title - the word or words that label the symbol
 * @prop {string} src - url of the image
 * @prop {boolean} show - if false, hide the card
 */
class Card {
  /**
   * create new card, or parse card data from local storage
   * @param {object} data - Any data the new card should come with, if coming from localstorage, it should be complete
   * @param {string} data.id - the card's id
   * @param {string} data.title - the word or words that label the symbol
   * @param {string} data.src - url of the image
   * @param {boolean} data.show - if false, hide the card
   */
  constructor(data={}) {
    this.id = data.id || newID();
    this.title = data.title || "";
    this.src = data.src || "";
    this.show = data.show !== undefined ? data.show : true;
  }

  static retrieve(key) {
    if (!key.startsWith("tokili-card-")) {
      key = "tokili-card-"+key;
    }
    try {
      return new Card(JSON.parse(localStorage.getItem(key)));
    } catch {
      return new Card({id: key.slice(12)}).store();
    }
  }

  store() {
    localStorage.setItem(
      `tokili-card-${this.id}`,
      JSON.stringify({
        id: this.id,
        boardId: this.boardId,
        title: this.title,
        show: this.show,
        src: this.src
      })
    );
    return this
  }

  renderAll() {
    this.renderCard();
    this.renderModal();
    this.renderCardEventListeners();
    this.renderModalEventListeners();
  }

  renderCard() {
    const card = $( `
    <div class="card m-1 ${this.show ? "" : "d-none"}" id="card-${this.id}" data-id="${this.id}">
      <div class="card-header d-flex flex-row">
        <form id="form-${this.id}" data-id="${this.id}" class="flex-grow-1">
          <div class="input-group">
            <div class="input-group-prepend">
              <button id="#speak-${this.id}" class="btn btn-secondary btn-speak">
                ${emoji("1F4AC")}
              </button>
            </div>
            <input type="text" class="form-control" placeholder="add title" data-id="${this.id}" ${(this.title ? `value="${this.title}"` : "")}>
          </div>
        </form>
        <button data-id="${this.id}" type="button" class="close delete-card" aria-label="Delete Card">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="img-${this.id}" data-id="${this.id}" role="button" class="btn btn-outline-primary img-card img-div" data-toggle="modal" data-target="#modal-${this.id}">
        <button data-id="${this.id}" type="button" class="close delete-img" aria-label="Delete Image">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    ` );

    if (!this.src) {
      image.html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"));
      $(`#delete-img-${this.id}`).addClass("d-none");
    } else {
      image.css("background-image",`url("${this.src}")`);
    }

    $("#card-deck").append(card);
  }

  renderModal() {
      // Create the modal HTML elements
    const modal =  $(`
      <div class="modal fade" id="modal-${this.id}" data-id="${this.id}" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header flex-wrap sticky-top">
              <h4 class="modal-title">Add Image</h4>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <div class="w-100"></div>
              <form id="modal-form-${this.id}" data-id="${this.id}" class="d-block">
              <input type="text" class="form-control" id="search-input-${this.id}" data-id="${this.id}" placeholder="search">
              </form>
            </div>
            <div id="modal-body-${this.id}" class="modal-body overflow-auto" data-id="${this.id}">

            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary save-img-btn" id="saveImgBtn-${this.id}" data-id="${this.id}">Save</button>
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `);

    // Append the modal to the body of the document
    $("#window-container").append(modal);
  }

  get card() {
    return $(`#card-${this.id}`);
  }

  get modal() {
    return $(`#modal-${this.id}`);
  }

  renderCardEventListeners() {
    let card = this.card;

    card.find("form").submit((e) => {
      e.preventDefault();
      this.setCardTitle( card.find("input").val()  );
    })

    card.find(".btn-speak").click(() => {
        speak( card.find("input").val() );
      });
    
    card.find(".img-card").click(() => {
      this.preShowModal();
      this.modal.modal('show');
    });
    
    card.find(".delete-card").click(() => this.hideCard());

    card.find(".delete-img").click((e) => {
      e.stopPropagation();
      this.deleteImage()
    } );
  }

  renderModalEventListeners() {
    let modal = this.modal;
    // attach submit event handler
    modal.find("form").submit( () => {
      e.preventDefault();
      modal.find(".card-body").empty();
      this.fetchPicture(modal.find("input").val())
    });

    // close button
    modal.find("button[data-dismiss='modal']").click(() => modal.modal("hide") )

    modal.find(".save-img-btn").click((e) => this.saveNewImg($(e.target).data("src")));
  }

  setCardTitle( newTitle ) {
    this.title = newTitle;
    this.store();
  }

  hideCard() {
    this.show = false;
    this.card.addClass('d-none');
    this.store();
  }

  showCard() {
    this.show = true;
    this.card.removeClass('d-none');
    this.store();
  }

  deleteImage() {
    this.src = "";
    this.card.find(".img-div")
      .html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"))
      .css("background-image","");
      this.card.find(".delete-img").addClass("d-none");
    this.store();
  }

  saveNewImg(src) {
    // set new image src and save in local storage
    this.src = src;
    this.store();

    // close the modal
    this.modal.modal("hide");

    // re-set the image in the card
    this.card.find(".img-div")
  }

  preShowModal() {
    // If something hasn't already been searched for, and the image has a title, go ahead and search for that by default, otherwise do nothing.
  
    const modalInput = this.modal.find("input");
    if (!modalInput.val()) {
      const cardInputVal = this.card.find("input").val();
      if (cardInputVal) {
        modalInput.val(cardInputVal);
        fetchPicture(cardInputVal);
      }
    }
  }

  fetchPicture(term) {
    // see if term has already been searched for
    // do api fetch
    // fill in results
    // save search in local storage

    if (!term) {return}

    this.modal.find(".card-body").append(`<span>Search for ${term}</span>`)
  }

}


class Heading extends Card {
  static retrieve(key) {
    if (!key.startsWith("tokili-card-")) {
      key = "tokili-card-"+key;
    }
    try {
      return new Heading(JSON.parse(localStorage.getItem(key)));
    } catch {
      return new Heading({id: key.slice(12)}).store();
    }
  }

  get card() {
    return $(`#heading`);
  }

  get modal() {
    return $(`#modal-heading`);
  }

  renderCard() {
    return
  }

  renderModal() {
    return
  }

  hideCard() {
    this.show = false;
    this.card.addClass('d-none');
    this.store();
    $("#heading-btn").removeClass("d-none");
  }

  showCard() {
    this.show = true;
    this.card.removeClass('d-none');
    this.store();
    $("#heading-btn").addClass("d-none");
  }
}


