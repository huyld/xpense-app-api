import * as dynamoDbLib from 'libs/dynamodb-lib';
import { success, failure } from 'libs/response-lib';

/**
 * Update account
 *
 * @export
 * @param {*} event
 * @param {*} context
 * @returns
 */
export async function main(event, context) {
  const data = JSON.parse(event.body);

  console.log('Update account data', data);

  const params = {
    TableName: 'accounts',
    Key: {
      userId: event.requestContext.identity.cognitoIdentityId,
      accountId: event.pathParameters.id
    },
    UpdateExpression: 'SET accountName = :accountName, color = :color',
    ExpressionAttributeValues: {
      ':accountName': data.accountName || null,
      ':color': data.color || null
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
    return failure({
      status: false,
      data: e,
    });
  }
}
