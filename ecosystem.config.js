module.exports = {
    apps: [
        {
            name: "giftcode-center",
            cwd: "./",
            script: "npm",
            args: "start",
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: "512M",
            env: {
                NODE_ENV: "production",
                PORT: 3068,
            },
        },
    ],
};
