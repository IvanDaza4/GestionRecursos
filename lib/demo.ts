export function demoLoginAvailable() {
  return Boolean(process.env.DEMO_LOGIN_EMAIL && process.env.DEMO_LOGIN_PASSWORD);
}
