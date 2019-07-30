/**
 * Split array into smaller arrays of given size
 *
 * @export
 * @param {[]} array array to be split
 * @param {number} chunkSize size of each sub-arrays
 * @returns {[]} array of smaller arrays
 */
export function splitArray(array, chunkSize) {
  return [].concat.apply([],
    array.map(function (_, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
}

/**
 * Extract user’s User Pool user id from context.
 *
 * @export
 * @param {*} context the context of lambda function retrieved from `event.requestContext`
 * @returns {string} user’s User Pool user id.
 */
export function getUserPoolUserId(context) {
  if (context.identity && context.identity.cognitoAuthenticationProvider) {
    const regex = /cognito-idp\.[a-z0-9\-]+\.amazonaws.com\/[\w\d-_]+,cognito-idp\.[a-z0-9\-]+\.amazonaws.com\/[\w\d-_]+:CognitoSignIn:[a-z0-9-]+/;
    const authProvider = context.identity.cognitoAuthenticationProvider;
    if (regex.test(authProvider)) {
      const parts = authProvider.split(':');
      if (parts.length >= 3) {
        const userPoolIdParts = parts[parts.length - 3].split('/');
        if (userPoolIdParts.length >= 1) {
          // const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
          const userPoolUserId = parts[parts.length - 1];
          return userPoolUserId;
        }
      }
    }
  }
  return '';
}
