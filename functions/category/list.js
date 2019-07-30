import * as dynamoDbLib from 'libs/dynamodb-lib';
import { getUserPoolUserId } from 'libs/utils';
import { success, failure } from 'libs/response-lib';

/**
 * Get categories of an user
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @param {function} callback
 * @returns
 */
export async function main(event, context, callback) {
  console.log('List categories queryStringParameters', event.queryStringParameters);

  const params = {
    TableName: 'categories',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': getUserPoolUserId(event.requestContext),
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    console.log('%s items were retrieved.', !!result.Items ? result.Items : 0);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.error('Error:', e);
    return failure({ status: false });
  }
}
