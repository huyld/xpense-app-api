import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';
import { splitArray } from 'libs/utils';
import baseCategories from 'libs/base-categories.json';

// BatchWriteItem can comprise as many as 25 put or delete requests
const BATCH_WRITE_ITEM_LIMIT = 25;

/**
 * Insert list of default categories for new user
 * This function is triggered by user signing up event
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @param {function} callback
 * @returns
 */
export async function main(event, context, callback) {
  console.log("event", event);
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp')
    return

  const userName = event.userName;
  console.log("userName", userName);

  const customizedCategories = baseCategories.map(category => {
    const categoryId = dynamoDbLib.randomString();
    category['categoryId'] = categoryId;
    category['userId'] = `${userName}`;

    if (category.subCategories) {
      category.subCategories = category.subCategories.map(subName => {
        const subId = dynamoDbLib.randomString();
        let sub = {};

        sub['categoryId'] = subId;
        sub['userId'] = `${userName}_${subId}`;
        sub['isExpense'] = category.isExpense;
        sub['categoryName'] = subName;

        return sub;
      });
    }
    return category;
  });

  let requestBatch = customizedCategories.map(category => {
    let isDefault = !!category.isDefault ? { isDefault: true } : {};
    return {
      PutRequest: {
        Item: {
          userId: category.userId,
          categoryId: category.categoryId,
          categoryName: category.name || '',
          isExpense: category.isExpense,
          iconId: category.iconId ? category.iconId : 'default',
          subCategories: category.subCategories,
          ...isDefault,
        }
      }
    };
  });

  let splitBatch = splitArray(requestBatch, BATCH_WRITE_ITEM_LIMIT);

  try {
    for (let i = 0; i < splitBatch.length; i++) {
      const subRequest = splitBatch[i];

      let params = {
        RequestItems: {
          'categories': subRequest
        }
      };
      const data = await dynamoDbLib.call('batchWrite', params);
      console.log(`Split batch ${i}:`, data);

      if (Object.entries(data.UnprocessedItems).length > 0) {
        console.error('Failed to initialize base categories:', data);
        event.response = {
          status: false,
          message: 'Failed to initialize base categories.'
        };
        break;
      }
    }

  } catch (e) {
    console.error('Init category:', e);
    event.response = { status: false };
  }

  return event;
}
