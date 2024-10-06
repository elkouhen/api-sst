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

        console.log($app);
        // table dynamodb pour le stockage des livres
        const table = new sst.aws.Dynamo("MyTable", {
            fields: {
                author: "string",
                title: "string",
                id: "string"
            },
            primaryIndex: {hashKey: "author", rangeKey: "title"},
            globalIndexes: {
                IdIndex: {hashKey: "id"}
            }
        });

        const userPool = new sst.aws.CognitoUserPool("My", {
          usernames: ["email"]
        });

        userPool.addClient("Web")

        const api = new sst.aws.ApiGatewayV1("MyBookstore",{
            domain: {
              name: `api-${$app.stage}.elkouhen.fyi`,
              dns: sst.aws.dns({
                zone: "Z02521192K6GG1EW6CPZA"
              })
            }
          })

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

        api.deploy();

        const bucket = new sst.aws.Bucket("MyBucket");

        bucket.subscribe("packages/js/index.books_import");

        const web_bucket = new sst.aws.Bucket("MyWebBucket");

        new sst.aws.Nuxt("MyWeb", {
            link: [web_bucket],
            path: "packages/gui", 
            domain: {
                name: `app-${$app.stage}.elkouhen.fyi`,
                dns: sst.aws.dns({
                  zone: "Z02521192K6GG1EW6CPZA"
                })
              }
        });
    },
});
