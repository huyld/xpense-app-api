import * as dynamoDbLib from 'libs/dynamodb-lib';
import { getUserPoolUserId } from 'libs/utils';
import { success, failure } from 'libs/response-lib';

/**
 * Get list accounts
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @param {function} callback
 * @returns
 */
export async function main(event, context, callback) {
  console.log('List accounts queryStringParameters', event.queryStringParameters);

  // Filter accounts by request params
  let conditionClause = '';
  let conditionExpression = {};
  if (event.queryStringParameters && event.queryStringParameters['currency']) {
    conditionClause += 'AND begins_with(accountId, :currency)';
    conditionExpression = {
      ...conditionExpression,
      ':currency': event.queryStringParameters['currency']
    }
  }

  const params = {
    TableName: 'accounts',
    KeyConditionExpression: `userId = :userId ${conditionClause}`,
    ExpressionAttributeValues: {
      ':userId': getUserPoolUserId(event.requestContext),
      ...conditionExpression
    }
  };

  try {
    const result = await dynamoDbLib.call('query', params);
    // Return the matching list of items in response body
    return success(result.Items);
  } catch (e) {
    console.error('List accounts:', e);
    return failure({ status: false });
  }
}
