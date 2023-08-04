module.exports = {
  /**
   * returns the html text for an emoji in an `<i>` tag with class .btn-symbol
   * @param {string} unicodeCode - unicode for emoji
   * @param {string} [attributes] - any extra html attributes to include in the `<i>` tag 
   * @returns {string}
   */
  emoji(unicodeCode,attributes='') {
    return `<i class="btn-symbol" role='icon' ${attributes}>&#x${unicodeCode};</i>`
  }
}