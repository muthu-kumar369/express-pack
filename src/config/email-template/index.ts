export default {
  welcome: ({ data }: any) => ({
    subject: `Welcome, ${data?.name}`,
    html: `<h1>Hello ${data?.name},</h1><p>We're happy to have you!</p>`,
  }),
  resetPassword: ({ data }: any) => ({
    subject: "Reset Your Password",
    html: `<p>Click <a href="https://example.com/reset/${data?.token}">here</a> to reset your password.</p>`,
  }),
  orderConfirmed: ({ data }: any) => ({
    subject: `Order #${data?.orderId} Confirmed`,
    html: `<p>Your order <strong>#${data?.orderId}</strong> has been confirmed.</p>`,
  }),
};
