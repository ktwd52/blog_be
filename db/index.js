import pg from "pg";
const { Client } = pg;

export const query = async (queryString, queryParams = []) => {
  const client = new Client({ connectionString: process.env.PG_URI });
  client.connect();

  const result = await client.query(queryString, queryParams);

  client.end();
  return result;
};
