import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';

/**
 * Delete account
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {
  console.log('Delete account pathParameters', event.pathParameters);

  const params = {
    TableName: 'accounts',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      accountId: event.pathParameters.id
    }
  };

  // TODO: Remove related transaction and balance records

  try {
    const result = await dynamoDbLib.call('delete', params);
    return success({
      status: true,
      data: result,
    });
  } catch (e) {
    return failure({
      status: false,
      data: result,
    });
  }
}
