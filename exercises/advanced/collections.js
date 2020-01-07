/**
 * Using Promise.all, write a function, combineFirstLineOfManyFiles, that:
 *    1. Reads each file at the path in the `filePaths` array
 *    2. Plucks the first line of each file
 *    3. Joins each first line into a new file
 *      - The lines should be in the same order with respect to the input array
 *      - i.e. the second line in the new file should be the first line of `filePaths[1]`
 *    4. Writes the new file to the file located at `writePath`
 */
const fs = require('fs');
const Promise = require('bluebird');
const {pluckFirstLineFromFileAsync} = require('../bare_minimum/promiseConstructor.js');


var combineFirstLineOfManyFiles = (filePaths, writePath) => new Promise((resolve, reject) => {

  // TODO
  const readLinePromises = filePaths.map(filePath => pluckFirstLineFromFileAsync(filePath));
  Promise.all(readLinePromises)
    .then(firstLines => {
      const outputText = firstLines.join('\n');
      fs.writeFile(writePath, outputText, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(outputText);
        }
      });
    })
    .catch(err => reject(err));
});

// Export these functions so we can unit test them
module.exports = {
  combineFirstLineOfManyFiles: combineFirstLineOfManyFiles
};