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
            primaryIndex: {hashKey: "author", rangeKey: "title"},
            globalIndexes: {
                IdIndex: {hashKey: "id"}
            }
        });

        const api = new sst.aws.ApiGatewayV1("MyBookstore",{
            domain: {
              name: "api.elkouhen.fyi",
              dns: sst.aws.dns({
                zone: "Z02521192K6GG1EW6CPZA"
              })
            }
          })

        api.route("GET /books",
            {
                handler: "packages/python/main.handler",
                runtime: "python3.11",
                // dev: false,
                link: [table]
            },
            {
                auth: {
                    iam: true
                }
            });

        api.deploy();

        const bucket = new sst.aws.Bucket("MyBucket");

        bucket.subscribe("packages/js/index.books_import");

        const web_bucket = new sst.aws.Bucket("MyWebBucket");

        new sst.aws.Nuxt("MyWeb", {
            link: [bucket],
            path: "packages/gui", 
            domain: {
                name: "app.elkouhen.fyi",
                dns: sst.aws.dns({
                  zone: "Z02521192K6GG1EW6CPZA"
                })
              }
        });
    },
});
