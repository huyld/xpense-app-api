import * as dynamoDbLib from 'libs/dynamodb-lib';
import { getUserPoolUserId } from 'libs/utils';
import { success, failure } from 'libs/response-lib';

/**
 * Update category
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {
  const data = JSON.parse(event.body);

  console.log('Update category data', data);

  const params = {
    TableName: 'categories',
    Key: {
      userId: getUserPoolUserId(event.requestContext),
      categoryId: event.pathParameters.id
    },
    UpdateExpression:
      `SET
        categoryName = :categoryName,
        isExpense = :isExpense,
        iconId = :iconId,
        subCategories= :subCategories,
        lastModified = :lastModified
    `,
    ExpressionAttributeValues: {
      ':categoryName': data.categoryName || '',
      ':isExpense': data.isExpense || true,
      ':iconId': data.iconId || '',
      ':subCategories': data.subCategories,
      ':lastModified': Date.now(),
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDbLib.call('update', params);
    return success({
      status: true,
      data: result,
    });
  } catch (e) {
    console.error('Update Category exception', e);
    return failure({
      status: false,
      data: e,
    });
  }
}
