function bookify () {
  const fsp = require('fs-promise')
  const path = require('path')
  const chalk = require('chalk')
  const wc = require('wordcount')

  const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']

  let book = {}
  let index = {}

  let page_count = 1

  fsp.readJson(path.join('.', 'interim', 'tmp', '.prebook'))
        .then((prebook) => {
          page_count = parseInt(prebook.START_PAGE)

          var html = '' // Assign p tags to it.
          var wordcount = 0
          var linecount = 0
          var indexer = 0

          for (var key in prebook) {
            if (prebook.hasOwnProperty(key)) {
              let elem = prebook[key]

              for (var tag in elem) {
                if (elem.hasOwnProperty(tag)) {
                  if (tag === 'img') {
                    let image = '<' + tag + ' width = "100%" src = "' + elem[tag] + '" />'
                    book[`page-${page_count}`] = image
                    page_count += 1
                  } else if (headerTags.indexOf(tag) > -1) {
                    if (html !== '') {
                      book[`page-${page_count}`] = html
                      page_count += 1
                      html = ''
                      wordcount = 0
                      linecount = 0
                    }

                    let heading = '<' + tag + '>' + elem[tag] + '</' + tag + '>'
                    book[`page-${page_count}`] = heading

                    if (tag === 'h3' || tag === 'h2' && elem[tag].substr(0, 5).trim() === 'CHAPT') {
                      index[indexer] = `<li><a class = "page" href="${page_count}"> ${elem[tag]} <span>${page_count}</span></a> </li>`
                      indexer++
                    }

                    page_count += 1
                  } else if (tag === 'p') {
                    const LOWER_WORD_LIMIT = 112 // Full page
                    const UPPER_WORD_LIMIT = 154 // Full page 22 lines = max.
                    const LOWER_LINE_LIMIT = 18
                    const UPPER_LINE_LIMIT = 24 // 20 is ideal.
                                // const MAX_CHAR_LIMIT = 850; // Based on visual readability tests

                    let newcount = wc(elem[tag])
                    let newlines = Math.round(newcount / 7) + 1

                    if (wordcount + newcount <= LOWER_WORD_LIMIT && linecount + newlines <= LOWER_LINE_LIMIT) {
                      html += '<' + tag + '>' + elem[tag] + '</' + tag + '>'

                      wordcount += newcount

                      linecount += Math.round(newcount / 7) + 1
                    } else if (wordcount + newcount > LOWER_WORD_LIMIT || linecount + newlines > LOWER_LINE_LIMIT) {
                      if (wordcount + newcount <= UPPER_WORD_LIMIT && linecount + newlines <= UPPER_LINE_LIMIT) {
                        html += '<' + tag + '>' + elem[tag] + '</' + tag + '>'

                        wordcount += newcount

                        linecount += Math.round(newcount / 7) + 1

                        book[`page-${page_count}`] = html

                        page_count += 1

                        html = ''

                        wordcount = 0

                        linecount = 0
                      } else if (wordcount + newcount > UPPER_WORD_LIMIT || linecount + newlines > UPPER_LINE_LIMIT) {
                        let longPage = true, rightPartSentence = '', content = elem[tag]

                        do {
                          let availableRoom = UPPER_WORD_LIMIT - wordcount

                          let leftPartSentence = ''

                          let nearestDot = content.lastIndexOf('.', availableRoom * 5)

                          if (nearestDot !== -1) {
                            leftPartSentence = content.substr(0, nearestDot + 1)

                            // if (wc(leftPartSentence) - availableRoom > 7) { // one line extra only.
                            //                         // Split midsentence with spaces and words.
                            //   let wordsArray = content.split(' ')

                            //   leftPartSentence = wordsArray.slice(0, availableRoom).join(' ')

                            //   rightPartSentence = wordsArray.slice(availableRoom).join(' ')

                            //   html += '<' + tag + '>' + leftPartSentence + '</' + tag + '>'

                            //   book[`page-${page_count}`] = html

                            //   page_count += 1

                            //                         // html = '<' + tag + '>' + rightPartSentence + '</' + tag + '>';

                            //                         // wordcount = wc(rightPartSentence);

                            //                         // linecount = Math.round(wordcount / 7) + 1;
                            // } else {
                            html += '<' + tag + '>' + leftPartSentence + '</' + tag + '>'

                            book[`page-${page_count}`] = html

                            page_count += 1

                            rightPartSentence = content.substr(nearestDot + 1)

                                                    // html = '<' + tag + '>' + elem[tag].substr(nearestDot + 1) + '</' + tag + '>';

                                                    // wordcount = wc(elem[tag].substr(nearestDot + 1));

                                                    // linecount = Math.round(wordcount / 7) + 1;
                            // }
                          } else {
                            let wordsArray = content.split(' ')

                            leftPartSentence = wordsArray.slice(0, availableRoom).join(' ')

                            rightPartSentence = wordsArray.slice(availableRoom).join(' ')

                            html += '<' + tag + '>' + leftPartSentence + '</' + tag + '>'

                            book[`page-${page_count}`] = html

                            page_count += 1

                                                // html = '<' + tag + '>' + rightPartSentence + '</' + tag + '>';

                                                // wordcount = wc(rightPartSentence);

                                                // linecount = Math.round(wordcount / 7) + 1;
                          }

                          let rightWordCount = wc(rightPartSentence)
                          let rightLineCount = rightWordCount / 7 + 1

                          if (rightWordCount > UPPER_WORD_LIMIT || rightLineCount > UPPER_LINE_LIMIT) {
                            longPage = true

                            html = ''

                            wordcount = 0

                            linecount = 0

                            content = rightPartSentence

                            rightPartSentence = ''
                          } else {
                            longPage = false

                            html = '<' + tag + '>' + rightPartSentence + '</' + tag + '>'

                            wordcount = wc(rightPartSentence)

                            linecount = Math.round(wordcount / 7) + 1
                          }
                        } while (longPage)
                      }
                    }
                  }
                }
              }
            }
          }

          function createPage (html, page_count, carryOverHtml) {
            book[`page-${page_count}`] = html

            page_count += 1

            html = carryOverHtml
            wordcount = 0
            charcount = 0
            linecount = 0
          }
        }).then(() => {
          fsp.writeFile(path.join('.', 'interim', 'tmp', '.book'), JSON.stringify(book, null, 2))
                .then(() => {
                  console.log(chalk.green(`Bookification… (.book) is ${chalk.blue('complete')}`))
                }).catch((err) => {
                  if (err) { return console.log(chalk.bold.red('Failed to write .book json', err)) }
                })
        }).then(() => {
          fsp.writeFile(path.join('.', 'interim', 'tmp', '.index'), JSON.stringify(index, null, 2))
                .then(() => {
                  console.log(chalk.green(`book.index) is ${chalk.blue('ready')}`))
                }).catch((err) => {
                  if (err) { return console.log(chalk.bold.red('Failed to write index json', err)) }
                })
        }).catch((err) => {
          if (err) { console.log(chalk.red('Could not read .book json', err)) }
        })
}

module.exports.bookify = bookify

// if (linecount + newlines <= LOWER_LINE_LIMIT) {

//     html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

//     wordcount += newcount;

//     linecount += Math.round(newcount / 7) + 1;

// } else if (linecount + newlines > LOWER_LINE_LIMIT) {
//     if (linecount + newlines <= UPPER_LINE_LIMIT) {

//         html += '<' + tag + '>' + elem[tag] + '</' + tag + '>';

//         wordcount += newcount;

//         linecount += Math.round(newcount / 7) + 1;

//         book[`page-${ page_count }`] = html;

//         page_count += 1;

//         html = '';

//         wordcount = 0;

//         linecount = 0;

//     } else if (linecount + newlines > UPPER_LINE_LIMIT) {

//         book[`page-${ page_count }`] = html;

//         page_count += 1;

//         html = '<' + tag + '>' + elem[tag] + '</' + tag + '>';

//         wordcount = wc(html);

//         linecount = Math.round(wordcount / 7) + 1;

//     }

// }
