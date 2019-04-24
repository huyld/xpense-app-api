import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';

/**
 * Get detail of a single account by account ID
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {
  console.log('Get accounts pathParameters', event.pathParameters);

  const params = {
    TableName: 'accounts',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      accountId: event.pathParameters.id
    }
  };

  try {
    const result = await dynamoDbLib.call('get', params);
    if (result.Item) {
      // Return the retrieved item
      return success(result.Item);
    } else {
      return failure({ status: false, error: 'Item not found.' });
    }
  } catch (e) {
    return failure({ status: false });
  }
}
