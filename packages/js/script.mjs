import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const tableName = Resource.MyTable.name; //"sst-api-development-MyTableTable"

const books = [ {
    author: "F. Scott Fitzgerald",
    title: "The Great Gatsby",
  },
  {
    author: "In Search of Lost Time",
    title: "Marcel Proust",
  },
  {
    author: "Nineteen Eighty Four",
    title: "George Orwell",
  },{
    author: "Don Quixote",
    title: "Miguel de Cervantes",
  },{
    author: "Crime and Punishment",
    title: "Fyodor Dostoevsky",
  }]

books.forEach(book => {
    const command = new PutCommand({
        TableName: tableName,
        Item: book,
      });
      
    const response = docClient.send(command);
})


