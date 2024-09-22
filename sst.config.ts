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

    // site web
    const bucket = new sst.aws.Bucket("MyBucket", {
      public: false,
    });

    new sst.aws.Nuxt("MyWeb", {
      link: [bucket],
      path: "packages/gui"
    });


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
    
    bucket.subscribe("packages/js/index.books_import");

    const userPool = new sst.aws.CognitoUserPool("My", {
      usernames: ["email"]
    });

    userPool.addClient("Web")

    const api = new sst.aws.ApiGatewayV1("MyBookstore");

    const myAuthorizer = api.addAuthorizer ({
      name: "MyAuthorizer",
      userPools: [userPool.arn],
    }); 

    api.route("GET /books",
      {
        handler: "packages/js/index.books_list",
        link: [table]
      }, 
      {
        auth: {
          cognito: {
            authorizer: myAuthorizer.id,
            scopes: ["email"],
          }
        } 
      });

    api.route("POST /books",
      {
        handler: "packages/js/index.book_create",
        link: [table]
      }, 
      {
        auth: {
          cognito: {
            authorizer: myAuthorizer.id,
            scopes: ["email"],
          }
        } 
      });

    api.route("GET /books/{id}",
      {
        handler: "packages/js/index.book_get",
        link: [table]
      }, 
      {
        auth: {
          cognito: {
            authorizer: myAuthorizer.id,
            scopes: ["email"],
          }
        } 
      });

    api.deploy();

    const secrets = {
      secret1: new sst.Secret("Secret1", "some-secret-value-1"),
      secret2: new sst.Secret("Secret2", "some-secret-value-2"),
    }; 

    const allSecrets = Object.values(secrets);

    new sst.aws.Function("MyBookListFunction", {
      handler: "packages/js/index.books_list",
      link: [table, ...allSecrets]
    });

  },
});
