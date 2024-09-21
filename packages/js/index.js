import { Resource } from "sst";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const books_list = async (event, context) => {

  const command = new ScanCommand({
    TableName: Resource.MyTable.name,
  });

  const response = await docClient.send(command);

  return { "body": JSON.stringify(response.Items) };
};

export const book_get = async (event, context) => {

  return { "body": JSON.stringify({ "name": "starwars4" }) };
};

export const book_create = async (event, context) => {

  const book = {
    "author": "xxx",
    "title": "star wars"
  }

  const command = new PutCommand({ TableName: Resource.MyTable.name, Item: book });

  const response = await docClient.send(command);

  return {
    "body": JSON.stringify(book)
  };
};

export const books_import = async (event, context) => {

  return { "body": "books imported" };
};