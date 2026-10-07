const test = require("node:test");
const assert = require("node:assert/strict");

process.env.NODE_ENV = "production";
process.env.ALLOW_EXPO_GO_REDIRECTS = "false";
process.env.APP_ALLOWED_ORIGINS = "https://dashboard.example";

const { app, isGuildAdmin, isValidAppRedirect } = require("../server");

test("admin authorization requires owner, administrator, or manage-guild permission", () => {
  assert.equal(isGuildAdmin({ owner: true, permissions: "0" }), true);
  assert.equal(isGuildAdmin({ owner: false, permissions: "8" }), true);
  assert.equal(isGuildAdmin({ owner: false, permissions: "32" }), true);
  assert.equal(isGuildAdmin({ owner: false, permissions: "4" }), false);
  assert.equal(isGuildAdmin({ owner: false, permissions: "invalid" }), false);
});

test("OAuth redirects are limited to the app scheme and allowlisted web origins", () => {
  assert.equal(isValidAppRedirect("serverhub://auth"), true);
  assert.equal(isValidAppRedirect("https://dashboard.example/auth"), true);
  assert.equal(isValidAppRedirect("https://attacker.example/auth"), false);
  assert.equal(isValidAppRedirect("javascript:alert(1)"), false);
  assert.equal(isValidAppRedirect("exp://192.168.1.2:8081/--/auth"), false);
});

test("health remains public while dashboard data requires a session", async (context) => {
  const server = app.listen(0, "127.0.0.1");
  await new Promise((resolve) => server.once("listening", resolve));
  context.after(
    () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  );

  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;
  const health = await fetch(`${baseUrl}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: "ok" });

  const dashboard = await fetch(`${baseUrl}/api/dashboard`);
  assert.equal(dashboard.status, 401);
});
