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


    new sst.aws.Function("MyBookListFunction", {
      handler: "packages/js/index-step-1.books_list",
      runtime: "nodejs20.x",
      timeout: "900 seconds",
    });

    new sst.aws.Function("MyBookListFunctionPython", {
      handler: "packages/python/main.books_list",
      runtime: "python3.11",
      timeout: "900 seconds",
    });
  },
});
