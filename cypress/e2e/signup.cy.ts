describe("Signup flow", () => {
  it("allows a new user to sign up and reach the login page", () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;

    cy.visit("/signup");

    cy.get('input[name="email"]').type(uniqueEmail);
    cy.get('input[name="password"]').type("password123");

    cy.contains("button", "Sign Up").click();

    cy.url().should("include", "/login");
  });
});