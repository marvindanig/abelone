// function homogenize() {

//     const fsp = require('fs-promise');
//     const path = require('path');
//     const chalk = require('chalk');
//     const wc = require('wordcount');

//     let manuscript = {};

//     fsp.readJson(path.join('.', 'interim', 'tmp', '.prebook'))
//         .then((prebook) => {

//             manuscript.START_PAGE = parseInt(prebook.START_PAGE);

//             delete prebook.START_PAGE;

//             let counter = 0;

//             for (var key in prebook) {
//                 if (prebook.hasOwnProperty(key)) {
//                     // console.log(key);
//                     // console.log(prebook[key]);
//                     // console.log(prebook[key].len);

//                     if (prebook[key].len > 160) {

//                         let elem = prebook[key];
//                         for (var tag in elem) {
//                             if (elem.hasOwnProperty(tag)) {
//                                 let source = elem[tag];
//                                 if (tag !== 'len') {
//                                     // console.log('SOURCE IS HERE', source);
//                                     let textArr = source.split('. ');
//                                     // console.log('TEXTARRAY:', textArr.length);
//                                     if (textArr.length > 1) {
//                                         for (i = 0; i < textArr.length; i++) {
//                                             let newParaObj = {};
                                            
//                                             newParaObj[tag] = textArr[i];

//                                             counter += i;
//                                             manuscript[counter] = newParaObj;
                                            
//                                             console.log(`NEW PARA-${counter} HERE `, textArr[i]);


//                                         }
//                                     } else {
//                                         // console.log('HOUSTON WE\'VE A sitUATION');
//                                         // console.log(textArr[0]);
//                                     }

//                                 }
//                             }
//                         }



//                     } else {

//                         let newObj = prebook[key];
//                         delete newObj.len;

//                         manuscript[counter] = newObj;

//                         counter++;

//                     }
//                 }
//             }


//             // let bookArr = Object.keys(prebook).map(key => prebook[key]); // Obj => Array conversion. Magic is here. 

//             // console.log(bookArr.length);



//             // for ( let i = 0; i < bookArr.length; i++) {
//             //     // console.log(wc(bookArr[i]));
//             //     console.log(bookArr[i]);
//             // }
//         }).then(() => {
//             fsp.writeFile(path.join('.', 'interim', 'tmp', '.manuscript'), JSON.stringify(manuscript, null, 2))
//                 .then(() => {
//                     console.log(chalk.green('.manuscript prepared'));
//                 }).catch((err) => {
//                     if (err)
//                         return console.log(chalk.bold.red('Failed to write .manuscript json', err));
//                 });
//         }).catch((err) => {
//             if (err)
//                 return console.log(chalk.red('Couldn\'t read prebook', err));

//         });




// }

// module.exports.homogenize = homogenize;
