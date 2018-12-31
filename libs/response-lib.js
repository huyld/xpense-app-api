/**
 * Build the response objects for success case
 *
 * @export
 * @param {*} body
 * @returns
 */
export function success(body) {
  return buildResponse(200, body);
}

/**
 * Build the response objects for failure case
 *
 * @export
 * @param {*} body
 * @returns
 */
export function failure(body) {
  return buildResponse(500, body);
}

/**
 * Build the response object with proper headers and given HTTP status code
 *
 * @param {number} statusCode
 * @param {*} body
 * @returns
 */
function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
}
