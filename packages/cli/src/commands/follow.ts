import * as log from '@oasis-sh/shared';
import { gqlURL } from '@oasis-sh/shared';
import { gql, GraphQLClient } from 'graphql-request';

interface FollowUserArguments {
  user: string;
  json: boolean;
}

export const command = 'follow <user> [json]';
export const desc =
  'Follows a user. <user> must be a valid user ID. Must be authenticated with "oasis login" before running';

export const builder = {
  user: {
    type: 'string',
    describe: 'a valid user ID to follow',
  },
  json: {
    type: 'boolean',
    describe:
      'writes the raw JSON to stdout, powerful when used with jq (a JSON processor)',
  },
};

export const handler = async (yargs: FollowUserArguments) => {
  const useJSON = yargs.json;

  const client = new GraphQLClient(gqlURL, {
    headers: { authorization: 'Bearer INSERT TOKEN HERE' },
  });

  const user = yargs.user;

  if (!user)
    return log.error('you need to pass <username> in order for this to work');

  const query = gql`
    mutation FollowUser($user: String!) {
      followUser(userId: $user)
    }
  `;

  client.request(query, { user }).then((res) => {
    if (useJSON) return console.log(JSON.stringify(res));
    log.info(res);
  });
};
