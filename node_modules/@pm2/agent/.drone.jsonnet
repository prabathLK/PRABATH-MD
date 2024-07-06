local pipeline(version) = {
    kind: "pipeline",
    name: "node-v" + version,
    steps: [
        {
            name: "tests",
            image: "node:" + version,
            commands: [
                "node -v",
                "npm -v",
                "uname -r",
                "npm install",
                "export PATH=$PATH:./node_modules/.bin/",
                "mocha test/units/InteractorClient.mocha.js",
                "mocha test/units/InteractorDaemon.mocha.js",
                "mocha test/units/PM2Client.mocha.js",
                "mocha test/units/Utility/stacktrace.mocha.js",
                "mocha test/units/Utility/cache.mocha.js",
                "mocha test/units/WatchDog.mocha.js",
                "mocha test/units/push/PushInteractor.mocha.js",
                "mocha test/units/push/TransactionAggregator.mocha.js",
                "mocha test/units/reverse/ReverseInteractor.mocha.js",
                "mocha test/units/transporters/WebsocketTransport.mocha.js",
                "mocha test/units/TransporterInterface.mocha.js",
                "mocha test/units/PM2Interface.mocha.js",
                "mocha test/integrations/websocket.mocha.js"
            ],
            environment: {
              NODE_ENV: "test",
              CC_TEST_REPORTER_ID: {
                from_secret: "code_climate_token"
              },
              PM2_HOME: "/tmp"
            },
        },
    ],
    trigger: {
      event: "push"
    },
};

[
    pipeline("8"),
    pipeline("10"),
    pipeline("12"),
    pipeline("13"),
    pipeline("14"),
    {
        kind: "pipeline",
        name: "publish",
        trigger: {
          event: "tag"
        },
        steps: [
          {
            name: "publish",
            image: "plugins/npm",
            settings: {
              username: {
                from_secret: "npm_username"
              },
              password: {
                from_secret: "npm_password"
              },
              email: {
                from_secret: "npm_email"
              },
            },
          },
        ],
    },
    {
        kind: "secret",
        name: "npm_username",
        get: {
          path: "secret/drone/npm",
          name: "username",
        },
    },
    {
        kind: "secret",
        name: "npm_email",
        get: {
          path: "secret/drone/npm",
          name: "email",
        },
    },
    {
        kind: "secret",
        name: "npm_password",
        get: {
          path: "secret/drone/npm",
          name: "password",
        },
    },
    {
        kind: "secret",
        name: "code_climate_token",
        get: {
          path: "secret/drone/codeclimate",
          name: "token_agent",
        },
    },
]
