import * as dynamoDbLib from 'libs/dynamodb-lib';
import { getUserPoolUserId } from 'libs/utils';
import { success, failure } from 'libs/response-lib';

/**
 * Delete category
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {

  const params = {
    TableName: 'categories',
    Key: {
      userId: getUserPoolUserId(event.requestContext),
      categoryId: event.pathParameters.id
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
    console.error('Delete category error', e);
    return failure({
      status: false,
      data: e,
    });
  }
}

