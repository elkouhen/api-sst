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

        const api = new sst.aws.ApiGatewayV1("MyBookstore");

        api.route("GET /books",
            {
                handler: "packages/js/index.books_list",
                link: [table]
            },
            {
                auth: {
                    iam: true
                }
            });

        api.deploy();
    },
});
