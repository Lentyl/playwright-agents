import { Page, Locator } from '@playwright/test';

/** Application context path shared by every page of the new N-Portal PPK app. */
export const APP_PATH = '/ppk-nnpte2/nnpte';

/**
 * Shared elements and helpers available on every authenticated screen
 * (header banner, Menu flyout, logout) plus generic navigation helpers.
 */
export default class BasePage {
  readonly page: Page;
  readonly menuToggle: Locator;
  readonly menuContent: Locator;
  readonly logoutButton: Locator;
  readonly companyName: Locator;
  readonly sessionCountdown: Locator;
  readonly accessDeniedHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuToggle = page.getByRole('link', { name: 'Menu' });
    this.menuContent = page.locator('#nav-content');
    this.logoutButton = page.getByRole('button', { name: 'Wyloguj' });
    this.companyName = page.getByRole('banner').getByRole('paragraph').first();
    this.sessionCountdown = page.getByText('Koniec sesji za');
    this.accessDeniedHeading = page.getByRole('heading', { name: 'Brak dostępu!' });
  }

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async openMenu(): Promise<void> {
    await this.toggleMenu();
    // The flyout is a Bootstrap collapse whose wrapper is not reported as
    // visible; wait for a section heading inside it to render instead.
    await this.menuSection('Dyspozycje').waitFor({ state: 'visible' });
  }

  async toggleMenu(): Promise<void> {
    await this.menuToggle.click();
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  /** Section heading inside the Menu flyout (e.g. "PPK", "Dyspozycje").
   *  Level-3 headings appear only in the flyout, so no scoping is needed. */
  menuSection(name: string): Locator {
    return this.page.getByRole('heading', { level: 3, name, exact: true });
  }

  /** A link inside the Menu flyout, scoped to avoid clashing with dashboard cards. */
  menuLink(name: string): Locator {
    return this.menuContent.getByRole('link', { name, exact: true });
  }

  async replaceFirstCharacterWithRandom(locator: Locator): Promise<void> {
    const randomLetter = String.fromCharCode(
      97 + Math.floor(Math.random() * 26)
    );

    await locator.click();
    await locator.press('Home');
    await locator.press('Shift+ArrowRight');
    await locator.press(randomLetter);
  }

  async waitForLocatorOrClick(
    locatorToWaitFor: Locator,
    timeoutInSeconds: number,
    locatorToClick: Locator,
  ): Promise<boolean> {
    try {
      await locatorToWaitFor.waitFor({
        state: 'visible',
        timeout: timeoutInSeconds * 1000,
      });

      return true;
    } catch (error) {
      console.warn(
        `Locator nie pojawił się w ciągu ${timeoutInSeconds}s. Klikam element zastępczy.`,
      );

      await locatorToClick.click();
      await locatorToWaitFor.waitFor({
        state: 'visible',
        timeout: timeoutInSeconds * 1000,
      });

      return true;
    }
  }


  async generateUniqueRegon(): Promise<string> {
    const base = Date.now().toString().slice(-8);

    const weights = [8, 9, 2, 3, 4, 5, 6, 7];
    const digits = base.split('').map(Number);

    const sum = digits.reduce(
      (acc, digit, index) => acc + digit * weights[index],
      0
    );

    const controlDigit = sum % 11 === 10 ? 0 : sum % 11;

    return `${base}${controlDigit}`;
  }

  async generateNip(): Promise<string> {
    const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];

    const digits = Array.from(
      { length: 9 },
      () => Math.floor(Math.random() * 10)
    );

    const sum = digits.reduce(
      (acc, digit, index) => acc + digit * weights[index],
      0
    );

    const controlDigit = sum % 11;

    // jeśli cyfra kontrolna wynosi 10, generujemy ponownie
    if (controlDigit === 10) {
      return this.generateNip();
    }

    return [...digits, controlDigit].join('');
  }


  async generateKrs(): Promise<string> {
    return Math.floor(Math.random() * 1_000_000_0000)
      .toString()
      .padStart(10, '0');
  }
}
