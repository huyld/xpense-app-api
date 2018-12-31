import AWS from 'aws-sdk';
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
