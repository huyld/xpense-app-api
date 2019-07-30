import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';
import { getUserPoolUserId } from 'libs/utils';

/**
 * Insert new category to DB
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @param {function} callback
 * @returns
 */
export async function main(event, context, callback) {
  const data = JSON.parse(event.body);

  let categoryId = dynamoDbLib.randomString();
  let subList = data.subCategories;
  let subCategories = subList.map(sub => {
    sub.categoryId = categoryId + '_' + dynamoDbLib.randomString();
    sub.createdDate = Date.now();
    return sub;
  });

  const params = {
    TableName: 'categories',
    Item: {
      ...data,
      userId: getUserPoolUserId(event.requestContext),
      categoryId: categoryId,
      categoryName: data.categoryName,
      isExpense: !!data.isExpense,
      createdDate: Date.now(),
      iconId: data.iconId ? data.iconId : 'default',
      subCategories: subCategories,
    }
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch (e) {
    console.error('Error on DynamoDb.PUT:', e);
    return failure({ status: false });
  }
}
