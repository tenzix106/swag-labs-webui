// fixtures/test-data.ts
export const TestData = {
  baseUrl: process.env.BASE_URL ?? 'https://saucedemo.com/',
  validUser: {
    username: process.env.TEST_USERNAME ?? 'standard_user',
    password: process.env.TEST_PASSWORD ?? 'secret_sauce',
  },
  lockedUser: {
    username: 'locked_out_user',
    password: 'secret_sauce',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
  checkoutInfo: {
    firstName: 'Jane',
    lastName: 'Doe',
    postalCode: '94107',
  },
};