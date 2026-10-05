import { test, expect } from '@playwright/test';

test.describe('CFP Submission Flow (E2E)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect / to /cfp and display the form in initial state with submit button disabled', async ({
    page,
  }) => {
    await expect(page).toHaveURL(/.*cfp/);

    const title = page.locator('#cfp-title');
    await expect(title).toBeVisible();
    await expect(title).toHaveText('Submissão de Proposta (Call for Papers)');

    const nomeInput = page.locator('#cfp-nome');
    const emailInput = page.locator('#cfp-email');
    const talkTitleInput = page.locator('#cfp-talkTitle');
    const gdeCheckbox = page.locator('#cfp-isGDE');
    const submitButton = page.getByRole('button', { name: /Submeter Proposta/i });

    await expect(nomeInput).toHaveValue('');
    await expect(emailInput).toHaveValue('');
    await expect(talkTitleInput).toHaveValue('');
    await expect(gdeCheckbox).not.toBeChecked();

    // Button MUST remain disabled until form is valid
    await expect(submitButton).toBeDisabled();
  });

  test('should display inline validation errors and set WAI-ARIA invalid attributes on blurred empty/invalid fields', async ({
    page,
  }) => {
    const nomeInput = page.locator('#cfp-nome');
    const emailInput = page.locator('#cfp-email');
    const talkTitleInput = page.locator('#cfp-talkTitle');
    const submitButton = page.getByRole('button', { name: /Submeter Proposta/i });

    // Blur nome without input
    await nomeInput.focus();
    await nomeInput.blur();
    await expect(nomeInput).toHaveAttribute('aria-invalid', 'true');
    const nomeError = page.locator('#cfp-nome-error');
    await expect(nomeError).toBeVisible();
    await expect(nomeError).toHaveAttribute('role', 'alert');
    await expect(nomeError).toContainText(/nome é obrigatório/i);

    // Type invalid email and blur
    await emailInput.fill('email-invalido');
    await emailInput.blur();
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    const emailError = page.locator('#cfp-email-error');
    await expect(emailError).toBeVisible();
    await expect(emailError).toHaveAttribute('role', 'alert');
    await expect(emailError).toContainText(/informe um e-mail válido/i);

    // Blur talkTitle without input
    await talkTitleInput.focus();
    await talkTitleInput.blur();
    await expect(talkTitleInput).toHaveAttribute('aria-invalid', 'true');
    const talkTitleError = page.locator('#cfp-talkTitle-error');
    await expect(talkTitleError).toBeVisible();
    await expect(talkTitleError).toHaveAttribute('role', 'alert');
    await expect(talkTitleError).toContainText(/título da palestra é obrigatório/i);

    // Button remains disabled
    await expect(submitButton).toBeDisabled();
  });

  test('should enable button on valid inputs, submit proposal, and display success feedback notification', async ({
    page,
  }) => {
    // Intercept backend API call to guarantee deterministic response
    await page.route('**/api/cfp', async (route) => {
      if (route.request().method() === 'POST') {
        const body = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            ...body,
            id: 'mocked-id-e2e',
          }),
        });
      } else {
        await route.continue();
      }
    });

    const nomeInput = page.locator('#cfp-nome');
    const emailInput = page.locator('#cfp-email');
    const talkTitleInput = page.locator('#cfp-talkTitle');
    const gdeCheckbox = page.locator('#cfp-isGDE');
    const submitButton = page.getByRole('button', { name: /Submeter Proposta/i });

    await nomeInput.fill('Margaret Hamilton');
    await emailInput.fill('margaret@apollo.nasa.gov');
    await talkTitleInput.fill('Software Engineering for Apollo Guidance');
    await gdeCheckbox.check();

    // Field errors should not be displayed
    await expect(nomeInput).toHaveAttribute('aria-invalid', 'false');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    await expect(talkTitleInput).toHaveAttribute('aria-invalid', 'false');

    // Submit button is now enabled
    await expect(submitButton).toBeEnabled();

    // Click submit
    await submitButton.click();

    // Success notification should be displayed with WAI-ARIA role="alert"
    const successTitle = page.getByText('Proposta enviada com sucesso!');
    await expect(successTitle).toBeVisible();
    await expect(page.getByText(/Software Engineering for Apollo Guidance/)).toBeVisible();
    await expect(page.getByText(/Margaret Hamilton/)).toBeVisible();

    // Dismiss notification
    const dismissBtn = page.getByRole('button', { name: /Fechar notificação/i });
    if (await dismissBtn.isVisible()) {
      await dismissBtn.click();
      await expect(successTitle).not.toBeVisible();
    }
  });

  test('should display error notification when API call fails', async ({ page }) => {
    await page.route('**/api/cfp', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Internal Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    const nomeInput = page.locator('#cfp-nome');
    const emailInput = page.locator('#cfp-email');
    const talkTitleInput = page.locator('#cfp-talkTitle');
    const submitButton = page.getByRole('button', { name: /Submeter Proposta/i });

    await nomeInput.fill('Alan Turing');
    await emailInput.fill('alan@bletchley.org.uk');
    await talkTitleInput.fill('Universal Computing Machines');

    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    const errorTitle = page.getByText('Erro na submissão');
    await expect(errorTitle).toBeVisible();
  });
});
