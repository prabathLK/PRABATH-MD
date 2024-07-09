local pipeline(version) = {
    kind: "pipeline",
    name: "node-v" + version,
    steps: [
        {
            name: "tests",
            image: "node:" + version,
            commands: [
              "npm install",
              "npm run test",
            ],
            environment: {
              NODE_ENV: "test",
              KEYMETRICS_TOKEN: {
                from_secret: "keymetrics_token",
              },
            },
        },
    ],
    trigger: {
      event: ["push", "tag"]
    },
};

[
    pipeline("10"),
    pipeline("12"),
    pipeline("14"),
    {
        kind: "pipeline",
        name: "build & publish",
        trigger: {
          event: "tag"
        },
        depends_on: [
          "node-v10",
          "node-v12",
          "node-v14"
        ],
        steps: [
          {
            name: "build",
            image: "node:12",
            commands: [
              "npm install 2> /dev/null",
              "mkdir -p dist",
              "npm run build",
              "npm run dist",
            ],
          },
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
        name: "keymetrics_token",
        get: {
          path: "secret/drone/keymetrics",
          name: "token",
        },
    },
]
