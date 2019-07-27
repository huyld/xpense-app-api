import * as dynamoDbLib from 'libs/dynamodb-lib';
import { getUserPoolUserId } from 'libs/utils';
import { success, failure } from 'libs/response-lib';

/**
 * Get detail of a single category by category ID
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {
  console.log('Get category pathParameters', event.pathParameters);

  const params = {
    TableName: 'categories',
    Key: {
      userId: getUserPoolUserId(event.requestContext),
      categoryId: event.pathParameters.id
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
    console.log('Exception', e);
    return failure({ status: false });
  }
}
