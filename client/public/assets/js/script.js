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
    board.renderEditorEventListeners();
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
      return Board.retrieve(boardId);
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

const utils = {
  /**
   * returns the html text for an emoji in an `<i>` tag with class .btn-symbol.  This function is also included in the Handlebars helpers.
   * @param {string} unicodeCode - unicode for emoji
   * @param {string} [attributes] - any extra html attributes to include in the `<i>` tag 
   * @returns {string}
   */
  emoji(unicodeCode,attributes='') {
    return `<i class="btn-symbol" role='icon' ${attributes}>&#x${unicodeCode};</i>`
  } ,

  /**
   * Use text-to-speech to speak word or phrase aloud.  See https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
   * @param {string} term - the word or phrase to speak
   */
  speak(term) {
    let utterance = new SpeechSynthesisUtterance(term);
    speechSynthesis.speak(utterance);
  }
}

/**
 * @typedef Symbol
 * @prop {string} id - id in database
 * @prop {string} image_url - the actual image source url
 * @prop {string} details_url - reference to Open Symbols API to get all their data on the symbol
*/

/**
 * @class
 * @prop {string} id - board's id number
 * @prop {string} [title] - title of board
 * @prop {Heading} [heading] - The heading card - the Heading model extends the Card model
 * @prop {Card[]} [cards] - array of Card instances
 * @prop {Symbol} [symbol] - the symbol for the board itself
 * @prop {string} [username] - the username associated with the user_id with the board's user_id in the database
 */
class Board {
  constructor(data={}) {
    // data will be generated from the API upon creation of a new Board in the database, or upon retrieval of an existing board.
  }
  static async retrieve(id) {
    try {
      const response = await fetch(`/boards/${id}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve board');
      }
      const boardData = await response.json();
      return new Board( boardData );
    } catch (error) {
      console.error('Error retrieving board:', error.message);
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await fetch(`/boards/`, { 
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve board');
      }
      const boardData = await response.json();
      return new Board( boardData );
    } catch (error) {
      console.error('Error retrieving board:', error.message);
      throw error;
    }
  }  

  static async copy(boardId, title) {
    try {
      const response = await fetch(`/boards/${boardId}/copy`, { 
        method: 'POST',
        body: JSON.stringify({ title }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve board');
      }
      const boardData = await response.json();
      return new Board( boardData );
    } catch (error) {
      console.error('Error retrieving board:', error.message);
      throw error;
    }
  }

  async save() {

  }

  async saveAll() {

  }

  /**
   * @returns {JQuery} - html
   */
  renderMenuCard() {
    return $( `
    <div class="card board-card m-1" data-id="${this.id}">
      <div style="display: flex; align-self: center; text-align: center; height: 20vh; width: 28vw; max-width: fit-content;">
        <img class="img-page-card card-img-top" style="height: 100%; width: 100%;" src="${this.symbol.image_url}">
      </div>
      <div class="card-footer" style="text-align: center;">
        <h5 class="card-title" style="font-size: 2.5vw;">
          ${this.title}
        </h5>
      </div>
    </div>
    ` )
  }

  renderEditorEventListeners() {
    $("#heading-btn").on( "click", () => {
      this.heading.showCard()
    });

    $("#add-card-btn").on( "click", () => {
      this.addCard();
    });

    $("#save-board-btn").on( "click", async () => {
      this.saveAll( () => {
        console.log("saved!")
      });
    });

    $("#board-title-form").on("submit" , async (e) => {
      e.preventDefault();
      this.title = $("#board-title-input").val();
      await this.save();
    });
  }

  addCard() {
    // see if there's a hidden card first
    let card = this.cards.find( (card) => !card.show );
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
 * @prop {string} [title] - the word or words that label the symbol
 * @prop {boolean} show - if false, hide the card
 * @prop {Symbol} [symbol] - symbol details
 */
class Card {
  constructor(data={}) {
    this.id = data.id || newID();
    this.title = data.title || "";
    this.src = data.src || "";
    this.show = data.show !== undefined ? data.show : true;
  }

  static async retrieve(id) {
    try {
      const response = await fetch(`/boards/${id}`);
      if (!response.ok) {
        throw new Error('Failed to retrieve board');
      }
      const boardData = await response.json();
      return new Board( boardData );
    } catch (error) {
      console.error('Error retrieving board:', error.message);
      throw error;
    }
  }

  static async create(data) {
    try {
      const response = await fetch(`/boards/`, { 
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error('Failed to retrieve board');
      }
      const boardData = await response.json();
      return new Board( boardData );
    } catch (error) {
      console.error('Error retrieving board:', error.message);
      throw error;
    }
  } 

  save() {

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
                ${utils.emoji("1F4AC")}
              </button>
            </div>
            <input id="title-${this.id} "type="text" class="form-control" placeholder="add title" data-id="${this.id}" ${(this.title ? `value="${this.title}"` : "")}>
          </div>
        </form>
        <button data-id="${this.id}" type="button" class="close delete-card" aria-label="Delete Card">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="img-${this.id}" data-id="${this.id}" role="button" class="btn btn-outline-primary img-card img-div" data-toggle="modal" data-target="#modal-${this.id}" ${ this.src ? `style="background-image: url('${this.src}')"` : ""}>
        <button data-id="${this.id}" type="button" class="close delete-img ${this.src ? "" : "d-none" }" aria-label="Delete Image">
          <span aria-hidden="true">&times;</span>
        </button>
        <div class="add-img-message ${this.src ? "d-none" : ""}">
        <h4>Click to add an image!</h4> ${utils.emoji("2795","style='font-size:4rem'")}</div>
      </div>
    </div>
    ` );

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

    // The form element contains the input text element that displays the card's word/phrase.
    card.find("form").on("submit",(e) => {
      e.preventDefault();
      this.setCardTitle( card.find("input").val()  );
    })

    // This is the little speech button to show what it sounds like.  This is the same function that is called when clicking on the whole card in deploy mode.
    card.find(".btn-speak").on( "click", () => {
        utils.speak( card.find("input").val() );
      });
    
    // Clicking on the image itself opens the modal to choose your picture.  
    card.find(".img-div").on( "click", () => {
      this.preShowModal();
      this.modal.modal('show');
    });
    
    // This deletes the whole card.
    card.find(".delete-card").on( "click", () => this.hideCard());

    // This just re-sets the image to blank.
    card.find(".delete-img").on( "click", (e) => {
      e.stopPropagation();
      this.deleteImage()
    } );
  }

  renderModalEventListeners() {
    let modal = this.modal;
    // attach submit event handler
    modal.find("form").on("submit", (e) => {
      e.preventDefault();
      modal.find(".modal-body").empty();
      this.fetchPicture(modal.find("input").val())
    });

    // close button
    modal.find("button[data-dismiss='modal']").on( "click", () => modal.modal("hide") )

    modal.find(".save-img-btn").on( "click", (e) => this.saveNewImg());
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
    this.card.find(".img-div").css("background-image","");
    this.card.find(".add-img-message").removeClass("d-none")
    this.card.find(".delete-img").removeClass("d-none");
    this.store();
  }

  saveNewImg() {
    if (this.newSrc) {
      // set new image src and save in local storage
      this.src = this.newSrc;
      this.newSrc = "";
      this.store();
        
      // re-set the image in the card
      this.card.find(".img-div").css("background-image", `url('${this.src}')`);

      this.card.find("delete-img").removeClass("d-none");
    }

    // close the modal
    this.modal.modal("hide");
  }

  preShowModal() {
    // If something hasn't already been searched for, and the image has a title, go ahead and search for that by default, otherwise do nothing.
  
    const modalInput = this.modal.find("input");
    if (!modalInput.val()) {
      const cardInputVal = this.card.find("input").val();
      if (cardInputVal) {
        modalInput.val(cardInputVal);
        this.fetchPicture(cardInputVal);
      }
    }
  }

  fetchPicture(term) {
    // see if term has already been searched for
    // do api fetch
    // fill in results
    // save search in local storage

    if (!term) {return}

    this.modal.find(".modal-body").append($(`<span>Search for ${term}</span>`))
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
    this.show
      ? this.showCard()
      : this.hideCard();
    if (this.src) {
      this.card.find(".img-div").css("background-image", `url('${this.src}')`);
    } else {
      this.card.find(".add-img-message").removeClass("d-none");
      this.card.find(".delete-img").addClass("d-none");
    }
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


