module.exports = {
    apps: [
        {
            name: "pdv_api",
            script: "./src/server.js",
            watch: true,
            env: {
                "DATABASE_URL":"postgresql://production_user:aTbh5DTDtFF2@localhost:5432/pdv?schema=public"
            },
            env_production: {
                "DATABASE_URL":"postgresql://production_user:aTbh5DTDtFF2@localhost:5432/pdv?schema=public"
            }
        }
    ]
}