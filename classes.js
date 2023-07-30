/**
 * @typedef JQuery - A jQuery object
 */

/**
 * Get a random ID
 * @param {Number} [length] - length of ID 
 * @returns {String}
 */
const newID = (length = 4) => {
  try {
    return crypto.randomUUID().slice(-1*length);
  } catch {
    return String(new Date().getTime()).slice(-1*length);
  }
}

/**
 * returns the html text for an emoji in an `<i>` tag with class .btn-symbol
 * @param {String} unicodeCode - unicode for emoji
 * @param {String} [attributes] - any extra html attributes to include in the `<i>` tag 
 * @returns {String}
 */
function emoji(unicodeCode,attributes='') {
  return `<i class="btn-symbol" role='icon' ${attributes}>&#x${unicodeCode};</i>`
} 

/**
 * The structure of the object in local storage in key `tokili-board-${this.id}`
 * @typedef BoardStore
 * @prop {String} id - board's id number
 * @prop {String} title - title of board
 * @prop {String[]} cards - array of card key ids, in the form `tokili-card-${this.cardId}`, the key they're saved in localstorage under
*/

/**
 * @class
 * @prop {String} id - board's id number
 * @prop {String} title - title of board
 * @prop {Card[]} cards - array of Card instances, cards[0] is the heading.
 */
class Board {
  constructor(data={}) {
    this.id = data.id || newID();
    this.title = data.title || "";
    this.cards = data.cards || [ new Card({show: false})]; 
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
   * Set in Local Storage, with key `tokili-board-${this.id}`
   * @param {boolean} [all=false] - store each card instance, as well.
   */
  store(all=false) {
    localStorage.setItem(
      `tokili-board-${this.id}`,
      JSON.stringify({
        id: this.id,
        title: this.title,
        cards: this.cards.map(card => `tokili-card-${card.id}`), // store cards by their ids 
      })
    );
    if (all) {
      this.cards.forEach(card => {
        card.store();
      });
    }
  }

  static retrieve(boardId) {
    return new Board(JSON.parse(
      localStorage.getItem(`tokili-board-${boardId}`,
       (key, value) => key.startsWith("tokili-card-") ? Card.retrieve(value) : value )
    ));
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
      const cardEl = card.renderCard();
      const modalEl = card.renderModal();
      // append these to the appropriate place
      this.cards.push(card);
      this.store();
    }
  }
}

/**
 * @class
 * @prop {String} id - the card's id
 * @prop {String} title - the word or words that label the symbol
 * @prop {String} src - url of the image
 * @prop {Boolean} show - if false, hide the card
 */
class Card {
  /**
   * create new card, or parse card data from local storage
   * @param {Object} data - Any data the new card should come with, if coming from localstorage, it should be complete
   * @param {String} data.id - the card's id
   * @param {String} data.title - the word or words that label the symbol
   * @param {String} data.src - url of the image
   * @param {Boolean} data.show - if false, hide the card
   */
  constructor(data={}) {
    this.id = data.id || newID();
    this.title = data.title || "";
    this.src = data.src || "";
    this.show = data.show || true;
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

  renderCard() {
    const card = $( `
    <div class="card m-1" id="card-${this.id}" data-id="${this.id}">
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
        <button id="delete-${this.id}" data-id="${this.id}" type="button" class="close" aria-label="Delete Card">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div id="img-${this.id}" data-id="${this.id}" role="button" class="btn btn-outline-primary img-card img-div" data-toggle="modal" data-target="#modal-${this.id}">
        <button id="delete-img-${this.id}" data-id="${this.id}" type="button" class="close" aria-label="Delete Image">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    </div>
    ` )

    card.find("form").submit((e) => {
      e.preventDefault();
      this.setCardTitle( $(`#input-${this.id}`).val() );
    })

    card.find(".btn-speak").click(() => {
        speak( card.find("input").val() );
      });
    
    let image = $(`#img-${this.id}`);
    image.click(() => {
      this.preShowModal();
      $(`#modal-${this.id}`).modal('show');
    });
    
    if (!this.src) {
      image.html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"));
      $(`#delete-img-${this.id}`).addClass("d-none");
    } else {
      image.css("background-image",`url("${this.src}")`);
    }
    
    $(`#delete-${this.id}`).click(() => this.hideCard());

    $(`#delete-img-${this.id}`).click(() => this.deleteImage());
  
    if (!this.show) {
      card.addClass("d-none");
    }

    return card;
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
            <button type="button" class="btn btn-primary" id="saveImgBtn-${this.id}" data-id="${this.id}">Save</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  `);

  // // Append the modal to the body of the document
  // $("#window-container").append(modal);

  // attach submit event handler
  $(`#modal-form-${this.id}`).submit(showSearchResults);

  // close button
  $(`#modal-${this.id} button[data-dismiss='modal']`).click(() => modal.modal("hide") )

  $(`#saveImgBtn-${this.id}`).click((e) => this.saveNewImg($(e.target).data("src")));

  }

  setCardTitle( newTitle ) {
    this.title = newTitle;
    this.store();
  }

  hideCard() {
    this.show = false;
    $(`#card-${this.id}`).addClass('d-none');
    this.store();
  }

  showCard() {
    this.show = true;
    $(`#card-${this.id}`).removeClass('d-none');
    this.store();
  }

  deleteImage() {
    this.src = "";
    $(`#img-${this.id}`)
      .html("<h4>Click to add an image!</h4>"+emoji("2795","style='font-size:4rem'"))
      .css("background-image","");
      $(`#delete-img-${this.id}`).addClass("d-none");
    this.store();
  }

  saveNewImg(src) {
    // set new image src and save in local storage
    this.src = src;
    this.store();

    // close the modal
    $(`#modal-${this.id}`).modal("hide");

    // re-set the image in the card
    $(`#img-${this.id}`)
  }

  preShowModal() {
    // If something hasn't already been searched for, and the image has a title, go ahead and search for that by default, otherwise do nothing.
  
    const modalInput = $(`#modal-${this.id} input`);
    if (!modalInput.val()) {
      const cardInputVal = $(`#card-${this.id} input`).val();
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
  }

}


