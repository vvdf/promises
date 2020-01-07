/**
 * Your task is to write a function that uses a deep learning
 * algorithm to determine the common set of concepts between
 * multiple github profile pictures
 *
 * Given an array of github handles, searchCommonConceptsFromGitHubProfiles should:
 *   1) get the public profile associated with each handle
 *   2) extract the avatar_url of each profile
 *   4) get the set of concepts for each avatar_url (requires API key)
 *   5) find the intersection of the concepts
 *
 * Much of the heavy lifting has been done already in `lib/advancedChainingHelpers`,
 * you just have to wire everything up together! Once you pass this one, you'll
 * be a promise chaining master! Have fun!
 */

var Promise = require('bluebird');
var lib = require('../../lib/advancedChainingLib');
var Clarifai = require('clarifai');
var request = require('request');

const app = new Clarifai.App({ apiKey: 'fe05697f794f453280c897a019735c4b' });

// We're using Clarifai's API to recognize concepts in an image into a list of concepts
// Visit the following url to sign up for a free account
//     https://developer.clarifai.com/login/
// Then, create a new API Key and add your API key to the
// `advancedChainingLib.js` file. When creating an API key, you can give it
// the `Predict on Public and Custom Models` scope

var searchCommonConceptsFromGitHubProfiles = githubHandles => new Promise((resolve, reject) => {
  // get the public profile with each handle
  var requestPromise = Promise.promisify(request);
  // console.log(githubHandles);
  var requestPromiseArr = githubHandles.map(handle => requestPromise(`https://api.github.com/users/${handle}`));
  Promise.all(requestPromiseArr)
    .then(gitHubResponses => {
      // extract avatar url for each profile
      return Promise.all(gitHubResponses.map(response => {
        console.log(response.body);
        app.models.predict(Clarifai.GENERAL_MODEL, response.avatar_url);
      }
      ));
    })
    .then(clarafaiResponses => {
      // console.log(clarafaiResponses);
    });
  // get the 'concepts' for each avatar url (requires API key)

  // find intersection of concepts
  // ie, resolve our promise into an array of intersecting/overlapping 'concepts'
  // between each pulled profile's data
  // iterating through each set of concepts
});

// Export these functions so we can unit test them
module.exports = {
  searchCommonConceptsFromGitHubProfiles,
};
