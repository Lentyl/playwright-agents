import { test, expect } from '../../fixtures/pagesFixtures';
import FinancialInstitutionAwaitingOrdersPage from '../../pages/FinancialInstitutionAwaitingOrdersPage';

const polishCollator = new Intl.Collator('pl', { numeric: true, sensitivity: 'base' });

async function expectColumnSorted(
  ordersPage: FinancialInstitutionAwaitingOrdersPage,
  columnName: string,
  direction: 'ascending' | 'descending',
): Promise<void> {
  await ordersPage.sortButton(columnName).click();
  await expect(ordersPage.columnHeader(columnName)).toHaveAttribute('aria-sort', direction);
  await expect.poll(async () => {
    const values = await ordersPage.columnValues(columnName);
    const expectedOrder = [...values].sort((left, right) => (
      direction === 'ascending'
        ? polishCollator.compare(left, right)
        : polishCollator.compare(right, left)
    ));

    return values.length > 1 && JSON.stringify(values) === JSON.stringify(expectedOrder);
  }).toBe(true);
}

async function verifyAscendingThenDescending(
  ordersPage: FinancialInstitutionAwaitingOrdersPage,
  columnName: string,
  startsDescending = false,
): Promise<void> {
  if (startsDescending) {
    await ordersPage.sortButton(columnName).click();
    await expect(ordersPage.columnHeader(columnName)).not.toHaveAttribute('aria-sort', 'descending');

    await expectColumnSorted(ordersPage, columnName, 'descending');
    await expectColumnSorted(ordersPage, columnName, 'ascending');
    return;
  }

  await expectColumnSorted(ordersPage, columnName, 'ascending');
  await expectColumnSorted(ordersPage, columnName, 'descending');
}

async function firstOrderIdentifier(ordersPage: FinancialInstitutionAwaitingOrdersPage): Promise<{ pesel: string; orderDate: string }> {
  const [firstOrder] = await ordersPage.visibleRows();
  const pesel = firstOrder[2];
  const orderDate = firstOrder[4];

  expect(pesel).not.toBe('');
  expect(orderDate).not.toBe('');

  return { pesel, orderDate };
}

async function expectOrderOnStatusTab(
  ordersPage: FinancialInstitutionAwaitingOrdersPage,
  status: 'Zaakceptowane' | 'Odrzucone',
  identifier: { pesel: string; orderDate: string },
): Promise<void> {
  await ordersPage.statusTab(status).click();
  await ordersPage.waitForResults();
  await ordersPage.searchBox().fill(identifier.orderDate);
  await expect.poll(async () => {
    const rows = await ordersPage.visibleRows();
    return rows.some((row) => row[2] === identifier.pesel && row[4] === identifier.orderDate);
  }).toBe(true);
}

test.describe('TC-FI-ORDERS - Orders awaiting acceptance', () => {
  test.beforeEach(async ({ loginAsFinancialInstitution, financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await loginAsFinancialInstitution();
    await ordersPage.open();
    await expect(ordersPage.heading).toBeVisible();
    await ordersPage.waitForResults();
  });

  test('TC-FI-ORDERS-001 displays statuses, table and confirmation resources', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await expect(ordersPage.statusTab('Oczekujące')).toBeVisible();
    await expect(ordersPage.statusTab('Zaakceptowane')).toBeVisible();
    await expect(ordersPage.statusTab('Odrzucone')).toBeVisible();
    await expect(ordersPage.table()).toBeVisible();
    await expect(ordersPage.confirmationDownload()).toHaveAttribute('href', /\/download$/);
  });

  test('TC-FI-ORDERS-002 filters orders by exact and partial values, clears filters, and shows an empty state', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    const [firstOrder] = await ordersPage.visibleRows();
    const pesel = firstOrder[2];
    const firstNameFragment = firstOrder[0].slice(0, 3);

    expect(pesel).not.toBe('');
    expect(firstNameFragment).not.toBe('');

    await ordersPage.searchBox().fill(pesel);
    await expect.poll(async () => (await ordersPage.visibleRows()).length).toBe(1);
    const exactMatches = await ordersPage.visibleRows();
    expect(exactMatches).toHaveLength(1);
    expect(exactMatches[0]).toContain(pesel);

    await ordersPage.searchBox().fill(firstNameFragment);
    await expect.poll(async () => {
      const rows = await ordersPage.visibleRows();
      return rows.length > 0 && rows.every((row) => (
        row.join(' ').toLocaleLowerCase('pl-PL').includes(firstNameFragment.toLocaleLowerCase('pl-PL'))
      ));
    }).toBe(true);
    const partialMatches = await ordersPage.visibleRows();
    expect(partialMatches.length).toBeGreaterThan(0);
    for (const row of partialMatches) {
      expect(row.join(' ').toLocaleLowerCase('pl-PL')).toContain(firstNameFragment.toLocaleLowerCase('pl-PL'));
    }

    await ordersPage.searchBox().fill('');
    await expect(ordersPage.paginationStatus).toContainText('Pozycje od 1 do 10 z');

    await ordersPage.searchBox().fill('ZZZ_NONEXISTENT_ORDER');

    await expect(ordersPage.noData).toBeVisible();
    await expect(ordersPage.paginationStatus).toContainText('Pozycji 0 z 0 dostępnych');
  });

  test('TC-FI-ORDERS-003 changes page size and navigates results pages', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await expect(ordersPage.paginationStatus).toContainText('Pozycje od 1 do 10 z');
    await ordersPage.pageSizeSelect.selectOption('25');
    await expect(ordersPage.paginationStatus).toContainText('Pozycje od 1 do 25 z');

    await ordersPage.nextPage().click();
    await expect(ordersPage.paginationStatus).toContainText('Pozycje od 26 do 47 z 47 łącznie');
    await ordersPage.previousPage().click();
    await expect(ordersPage.paginationStatus).toContainText('Pozycje od 1 do 25 z 47 łącznie');
  });

  test('TC-FI-ORDERS-004 sorts orders by all sortable columns in both directions', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    await verifyAscendingThenDescending(ordersPage, 'Imię');
    await verifyAscendingThenDescending(ordersPage, 'Nazwisko');
    await verifyAscendingThenDescending(ordersPage, 'Pesel');
    await verifyAscendingThenDescending(ordersPage, 'Dokument tożsamości');
    await verifyAscendingThenDescending(ordersPage, 'Data zlecenia', true);
    await verifyAscendingThenDescending(ordersPage, 'Typ zlecenia');
    await verifyAscendingThenDescending(ordersPage, 'Nr rachunku PPK');
  });

  test('TC-FI-ORDERS-005 accepts an awaiting order and displays it on the accepted tab', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    const identifier = await firstOrderIdentifier(ordersPage);

    await ordersPage.openOrderAction(ordersPage.firstOrder(), 'Akceptuj');
    await expect(ordersPage.actionDialog('Akceptuj')).toContainText('Czy na pewno chcesz zaakceptować zlecenie?');
    await ordersPage.actionSubmit('Akceptuj').click();

    await expect.poll(async () => {
      const rows = await ordersPage.visibleRows();
      return !rows.some((row) => row[2] === identifier.pesel && row[4] === identifier.orderDate);
    }).toBe(true);
    await expectOrderOnStatusTab(ordersPage, 'Zaakceptowane', identifier);
  });

  test('TC-FI-ORDERS-006 rejects an awaiting order with a reason and displays it on the rejected tab', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    test.fixme(true, 'Application defect: a rejected order disappears from Awaiting but is not displayed on the Rejected tab.');
    const identifier = await firstOrderIdentifier(ordersPage);

    await ordersPage.openOrderAction(ordersPage.firstOrder(), 'Odrzuć');
    await expect(ordersPage.actionDialog('Odrzuć')).toContainText('Powód odrzucenia zlecenia:');
    await ordersPage.fillActionReason('Odrzuć', 'Automated rejection test');
    await expect(ordersPage.actionSubmit('Odrzuć')).toBeEnabled();
    await ordersPage.actionSubmit('Odrzuć').click();

    await expect.poll(async () => {
      const rows = await ordersPage.visibleRows();
      return !rows.some((row) => row[2] === identifier.pesel && row[4] === identifier.orderDate);
    }).toBe(true);
    await expectOrderOnStatusTab(ordersPage, 'Odrzucone', identifier);
  });

  test('TC-FI-ORDERS-007 requests clarification for an awaiting order with a reason', async ({ financialInstitutionAwaitingOrdersPage: ordersPage }) => {
    const identifier = await firstOrderIdentifier(ordersPage);

    await ordersPage.openOrderAction(ordersPage.firstOrder(), 'Wyjaśnij');
    await expect(ordersPage.actionDialog('Wyjaśnij')).toContainText('Powód wyjaśnienia zlecenia:');
    await ordersPage.fillActionReason('Wyjaśnij', 'Automated clarification request');
    await expect(ordersPage.actionSubmit('Wyjaśnij')).toBeEnabled();
    await ordersPage.actionSubmit('Wyjaśnij').click();

    await expect.poll(async () => {
      const rows = await ordersPage.visibleRows();
      return !rows.some((row) => row[2] === identifier.pesel && row[4] === identifier.orderDate);
    }).toBe(true);
  });
});