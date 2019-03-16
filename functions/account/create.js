import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';

/**
 * Insert new account to DB
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @param {function} callback
 * @returns
 */
export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  console.log('Create account data: ', data);

  const params = {
    TableName: 'accounts',
    Item: {
      ...data,
      userId: event.requestContext.identity.cognitoIdentityId,
      accountId: `${data.currency}_${dynamoDbLib.randomString()}`,
      accountName: data.accountName,
      currency: data.currency,
      openDate: Date.now(),
      color: data.color ? data.color : 'default',
    }
  };

  try {
    await dynamoDbLib.call('put', params);
    return success(params.Item);
  } catch (e) {
    console.error('Create account:', e);
    return failure({ status: false });
  }
}
