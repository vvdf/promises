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
var fs = require('fs');
var { CLARIFAI_API_KEY, GITHUB_OATH } = require('../../config.js');

const app = new Clarifai.App({ apiKey: CLARIFAI_API_KEY });

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
  var requestPromiseArr = githubHandles.map(handle => requestPromise({
    url: `https://api.github.com/users/${handle}`,
    headers: {
      'User-Agent': 'node.js',
      'Authorization': `token ${GITHUB_OATH}`
    },
  }));
  Promise.all(requestPromiseArr)
    .then(gitHubResponses => {
      // extract avatar url for each profile
      return gitHubResponses.map(response => {
        return app.models.predict(Clarifai.GENERAL_MODEL, JSON.parse(response.body).avatar_url);
      }
      );
    })
    .then(clarifaiPromises => (
      Promise.all(clarifaiPromises)
    ))
    .then(clarifaiResponses => {
      const conceptsArr = clarifaiResponses.map(response => response.outputs[0].data.concepts);
      const conceptNamesArr = conceptsArr.map(userConcepts => userConcepts.map(userConcept => userConcept.name));
      const intersectingTags = lib.getIntersection(conceptNamesArr);
      resolve(intersectingTags);
    })
    .catch(err => reject(err));
});

// Export these functions so we can unit test them
module.exports = {
  searchCommonConceptsFromGitHubProfiles,
};
