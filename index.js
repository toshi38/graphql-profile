import { GraphQLClient } from 'graphql-request'

console.log(`Welcome to a fun profiling!`);

const API = process.env.GRAPHQL_API || 'insert api link here';
const TOKEN = process.env.GRAPHQL_TOKEN || 'insert token here';
const ITERATIONS = 500;

const client = new GraphQLClient(API, {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

let profiledRequest = (...args) => {
  let start = new Date();
  return client.request(...args).then(data => {
    let end = new Date();
    console.log(`${start.toISOString()}, ${end.toISOString()}, ${end.getTime() - start.getTime()}`);
    return data;
  })
};

const query = `
    query pointlessQuery {
      __type(name: "ID") {
        name
      }
    }`;

const superSimpleQuery = async () => {
  return profiledRequest(query);
};

console.log(`Running with query: ${query}`);
console.log(`Profiling: ${API}`);
console.log(`Using API Key: ${TOKEN}`);

console.log(`startTime, endTime, duration(mS)`);

const runTest = async () => {
  for(let i = 0; i < ITERATIONS; i++) {
    await superSimpleQuery();
  }
};

runTest().catch(err => console.log(`Caught an error while profiling: ${err} ${err.stack}`));
