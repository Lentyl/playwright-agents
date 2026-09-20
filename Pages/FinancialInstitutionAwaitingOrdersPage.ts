import { Locator, Page } from '@playwright/test';
import BasePage, { APP_PATH } from './BasePage';

type OrderAction = 'Akceptuj' | 'Odrzuć' | 'Wyjaśnij';

export default class FinancialInstitutionAwaitingOrdersPage extends BasePage {
  readonly heading: Locator;
  readonly pageSizeSelect: Locator;
  readonly paginationStatus: Locator;
  readonly noData: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1, name: 'Zlecenia do akceptacji' });
    this.pageSizeSelect = page.locator('#dt-length-0');
    this.paginationStatus = page.locator('#reqTrade-table_info');
    this.noData = page.getByText('Brak danych', { exact: true });
  }

  async open(): Promise<void> {
    await this.goto(`${APP_PATH}/manager/reqtrade/list/awaiting`);
  }

  statusTab(name: 'Oczekujące' | 'Zaakceptowane' | 'Odrzucone'): Locator {
    return this.page.getByRole('link', { name, exact: true });
  }

  table(): Locator {
    return this.page.locator('#reqTrade-table');
  }

  async waitForResults(): Promise<void> {
    await this.table().locator('tbody td:not([colspan])').first().waitFor();
  }

  async visibleRows(): Promise<string[][]> {
    return this.table().locator('tbody tr').evaluateAll((rows) => rows.map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
    ));
  }

  async columnValues(columnName: string): Promise<string[]> {
    return this.table().evaluate((table, name) => {
      const columnIndex = Array.from(table.querySelectorAll('thead th')).findIndex((header) =>
        header.textContent?.trim().startsWith(name),
      );

      if (columnIndex === -1) {
        throw new Error(`Column not found: ${name}`);
      }

      return Array.from(table.querySelectorAll('tbody tr')).map((row) =>
        row.querySelectorAll('td')[columnIndex]?.textContent?.trim() ?? '',
      );
    }, columnName);
  }

  firstOrder(): Locator {
    return this.table().locator('tbody tr').first();
  }

  matchingOrders(text: string): Locator {
    return this.table().locator('tbody tr', { hasText: text });
  }

  async openOrderAction(row: Locator, action: OrderAction): Promise<void> {
    await row.getByRole('button', { name: 'Zmiana' }).click();
    await this.page.getByRole('link', { name: new RegExp(`${action}$`) }).click();
  }

  actionDialog(action: OrderAction): Locator {
    const dialogId = {
      Akceptuj: '#acceptReqTradeModal',
      Odrzuć: '#cancelReqTradeModal',
      Wyjaśnij: '#needInfoCommentReqTradeModal',
    }[action];

    return this.page.locator(dialogId);
  }

  actionReason(action: 'Odrzuć' | 'Wyjaśnij'): Locator {
    return this.actionDialog(action).getByRole('textbox');
  }

  async fillActionReason(action: 'Odrzuć' | 'Wyjaśnij', reason: string): Promise<void> {
    const reasonField = this.actionReason(action);
    await reasonField.fill(reason);
    await reasonField.press('End');
  }

  actionSubmit(action: OrderAction): Locator {
    const buttonName = {
      Akceptuj: 'Akceptuj',
      Odrzuć: 'Odrzuć zlecenie',
      Wyjaśnij: 'Wyjaśnij zlecenie',
    }[action];

    return this.actionDialog(action).getByRole('button', { name: buttonName, exact: true });
  }

  searchBox(): Locator {
    return this.page.getByRole('searchbox', { name: 'Szukaj:' });
  }

  sortButton(name: string): Locator {
    return this.table().getByRole('button', { name: new RegExp(`^${name}:`) });
  }

  columnHeader(name: string): Locator {
    return this.table().getByRole('columnheader', { name, exact: false });
  }

  nextPage(): Locator {
    return this.page.locator('.dt-paging .next');
  }

  previousPage(): Locator {
    return this.page.locator('.dt-paging .previous');
  }

  confirmationDownload(): Locator {
    return this.table().locator('a[href*="/reqtrade/confirmation/"][href$="/download"]').first();
  }
}