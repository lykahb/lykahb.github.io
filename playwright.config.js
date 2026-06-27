// @ts-check
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
    testDir: "./tests/e2e",
    timeout: 30 * 1000,
    expect: {
        timeout: 5 * 1000,
    },
    use: {
        baseURL: "http://127.0.0.1:1111",
        trace: "on-first-retry",
    },
    webServer: {
        command: "zola serve --interface 127.0.0.1 --port 1111 --force",
        url: "http://127.0.0.1:1111",
        reuseExistingServer: !process.env.CI,
        timeout: 30 * 1000,
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
});
