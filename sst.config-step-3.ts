/// <reference path="./.sst/platform/config.d.ts" />

export default $config({

  app(input) {
    return {
      name: "sst-api",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {

    // table dynamodb pour le stockage des livres
    const table = new sst.aws.Dynamo("MyTable", {
      fields: {
        author: "string",
        title: "string",
        id: "string"
      },
      primaryIndex: { hashKey: "author", rangeKey: "title" },
      globalIndexes: {
        IdIndex: { hashKey: "id" }
      }
    });

    const mybooklist_function = new sst.aws.Function("MyBookListFunction", {
      handler: "packages/js/index-step-3.books_list",
      runtime: "nodejs20.x",
      timeout: "900 seconds",
      link: [table]
    });
  },
});
