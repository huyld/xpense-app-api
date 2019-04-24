import AWS from 'aws-sdk';
import crypto from 'crypto';
import awsConfig from '../aws.config.json';

AWS.config.update(awsConfig);

/**
 * Interact with DynamoDB
 *
 * @export
 * @param {string} action `get` | `put`
 * @param {*} params
 * @returns
 */
export function call(action, params) {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
}

/**
 * Generate reasonably unique string
 *
 * @export
 * @returns {string} random string
 */
export function randomString() {
  return crypto.randomBytes(5).toString('hex');
}
