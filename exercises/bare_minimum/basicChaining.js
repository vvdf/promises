/*
 * Write a function WITH NO CALLBACKS that,
 * (1) reads a GitHub username from a `readFilePath`
 *     (the username will be the first line of the file)
 * (2) then, sends a request to the GitHub API for the user's profile
 * (3) then, writes the JSON response of the API to `writeFilePath`
 *
 * HINT: We exported some similar promise-returning functions in previous exercises
 */

var fs = require('fs');
var Promise = require('bluebird');
var request = require('request');
var { pluckFirstLineFromFileAsync } = require('./promiseConstructor');
var { getGitHubProfileAsync } = require('./promisification');


// var userPath = 'https://api.github.com/users/d-rowe'

var fetchProfileAndWriteToFile = (readFilePath, writeFilePath) => new Promise((resolve, reject) => {
  pluckFirstLineFromFileAsync(readFilePath)
    .then(userName => getGitHubProfileAsync(userName))
    .then(data => {
      fs.writeFile(writeFilePath, JSON.stringify(data), err => err ? reject(err) : resolve());
    })
    .catch(reject);
});

// Export these functions so we can test them
module.exports = {
  fetchProfileAndWriteToFile: fetchProfileAndWriteToFile
};
