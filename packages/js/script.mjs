import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = "sst-api-development-MyTableTable"

const book = {
  author: "xxx",
  title: "star wars",
};

const command = new PutCommand({
  TableName: tableName,
  Item: book,
});

const response = await docClient.send(command);
