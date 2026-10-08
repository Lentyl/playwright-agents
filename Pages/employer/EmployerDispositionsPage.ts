import { Page, Locator } from '@playwright/test';
import BasePage, { APP_PATH } from '../BasePage';

/**
 * Access-control probe helper for the Dyspozycje (order wizard) entry points.
 * Each entry maps a menu label to its route and the level-1 heading expected
 * once the screen loads. The `contributioncancel` route is expected to be 403.
 */
export interface DispositionEntry {
  label: string;
  path: string;
  heading: string;
}

export const DISPOSITION_ENTRIES: DispositionEntry[] = [
  { label: 'Zgłoszenie pracownika', path: '/employer/registration?mode=init', heading: 'Zgłoszenie pracownika' },
  { label: 'Zgłoszenie wpłat', path: '/employer/contributions?mode=init', heading: 'Zgłoszenie wpłat' },
  { label: 'Zgłoszenie korekt do wpłat', path: '/employer/corrections?mode=init', heading: 'Zgłoszenie korekt do wpłat' },
  { label: 'Wznowienie odprowadzania wpłat', path: '/employer/contributionrenewal', heading: 'Wznowienie odprowadzania wpłat' },
  { label: 'Zmiana wysokości wpłaty podstawowej Pracownika', path: '/employer/contribution/primary', heading: 'Zmiana wysokości wpłaty podstawowej Pracownika' },
  { label: 'Deklaracja wpłaty dodatkowej Pracownika', path: '/employer/contribution/secondary', heading: 'Deklaracja wpłaty dodatkowej Pracownika' },
  { label: 'Zmiana danych', path: '/employer/dataChange', heading: 'Zmiana danych' },
  { label: 'Wypłata transferowa do Nationale-Nederlanden', path: '/employer/transfer', heading: 'Wypłata transferowa do Nationale-Nederlanden' },
  { label: 'Zakończenie lub wznowienie zatrudnienia', path: '/employer/employmentChange', heading: 'Zakończenie lub wznowienie zatrudnienia' },
];

/** Route that is advertised in the menu but returns HTTP 403 for this role. */
export const CONTRIBUTION_CANCEL_PATH = '/employer/contributioncancel/';

export default class EmployerDispositionsPage extends BasePage {
  readonly dispositionsBreadcrumb: Locator;
  readonly errorPageBody: Locator;

  constructor(page: Page) {
    super(page);
    this.dispositionsBreadcrumb = page.getByRole('link', { name: 'Dyspozycje' });
    this.errorPageBody = page.locator('body');
  }

  async gotoDisposition(path: string): Promise<import('@playwright/test').Response | null> {
    return this.page.goto(`${APP_PATH}${path}`);
  }

  heading(name: string): Locator {
    return this.page.getByRole('heading', { level: 1, name, exact: true });
  }

  async openDispositionsBreadcrumb(): Promise<void> {
    await this.dispositionsBreadcrumb.click();
  }
}
