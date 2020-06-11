import json


def lambda_handler(event, context):

    jwtToken = event['requestContext']['authorizer']
    print('jwtToken ', jwtToken)

    username = event['requestContext']['authorizer']['claims']['cognito:username']
    print('username ', username)

    obj = json.loads(event['body'])

    inValue = obj['InValue']

    # This is where AWS Lambda (or even HTTP REST) uncontaminated python functions
    # should be called, eg

    outValue = inValue + 1

    return {
        'statusCode': 200,
        'body': json.dumps({
        'OutValue': outValue
        })
    }
