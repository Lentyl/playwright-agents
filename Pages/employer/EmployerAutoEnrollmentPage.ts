import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

export class EmployerAutoEnrollmentPage extends BasePage {
  readonly participantsPreviewCard: Locator;
  readonly guideCard: Locator;
  readonly materialsCard: Locator;
  readonly materialLinks: Locator;
  readonly orderPostersAndLeafletsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.participantsPreviewCard = page.getByRole('heading', {
      level: 5,
      name: 'Podgląd Uczestników objętych autozapisem',
      exact: true,
    });
    this.guideCard = page.getByRole('heading', {
      level: 5,
      name: 'Przewodnik po autozapisie dla kadr i płac',
      exact: true,
    });
    this.materialsCard = page.getByRole('heading', {
      level: 5,
      name: 'Materiały do pobrania',
      exact: true,
    });
    this.materialLinks = page
      .locator('a[href^="http"]')
      .filter({ hasText: /Plakat|Ulotka|Wideo|Rezygnacja|Wznowienie|Dane kontaktowe/ });
    this.orderPostersAndLeafletsButton = page.getByRole('button', {
      name: 'Zamów plakaty i ulotki',
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.page.getByRole('link', {
      name: /Autozapis/i,
    }).click();
  }

  async openParticipantsPreview(): Promise<void> {
    await this.participantsPreviewCard.waitFor({ state: 'visible' });
    await this.page.getByRole('link').filter({ has: this.participantsPreviewCard }).click();
  }

  async openGuide(): Promise<void> {
    await this.guideCard.waitFor({ state: 'visible' });
    await this.page.getByRole('link').filter({ has: this.guideCard }).click();
  }

  async openMaterials(): Promise<void> {
    await this.materialsCard.waitFor({ state: 'visible' });
    await this.page.getByRole('link').filter({ has: this.materialsCard }).click();
  }

  async openFirstMaterial(): Promise<Page> {
    const materialLink = this.materialLinks.first();
    await materialLink.waitFor({ state: 'visible' });
    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => undefined);
    await materialLink.click();
    const popup = await popupPromise;
    const openedPage = popup ?? this.page;
    await openedPage.waitForLoadState('domcontentloaded');
    return openedPage;
  }
}