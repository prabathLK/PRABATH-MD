local pipeline(version) = {
    kind: "pipeline",
    name: "node-v" + version,
    steps: [
        {
            name: "tests",
            image: "node:" + version,
            commands: [
                "node -v",
                "uname -r",
                "npm install",
                "npm test"
            ]
        },
    ],
    services: [
      {
        name: "mongodb",
        image: "mongo:3.4",
        environment: {
          AUTH: "no"
        },
      },
      {
        name: "redis",
        image: "redis:5",
      },
      {
        name: "mysql",
        image: "mysql:5",
        environment: {
          MYSQL_DATABASE: "test",
          MYSQL_ROOT_PASSWORD: "password"
        },
      },
      {
        name: "postgres",
        image: "postgres:11",
        environment: {
          POSTGRES_DB: "test",
          POSTGRES_PASSWORD: "password"
        },
      },
    ],
    trigger: {
      event: ["push", "pull_request"]
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
        name: "build & publish",
        trigger: {
          event: "tag"
        },
        steps: [
          {
            name: "build",
            image: "node:8",
            commands: [
              "export PATH=$PATH:./node_modules/.bin/",
              "yarn 2> /dev/null",
              "mkdir build",
              "yarn run build",
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
    }
]
