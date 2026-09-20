import { Locator } from '@playwright/test';
import { test, expect } from '../../fixtures/pagesFixtures';

type AgreementIdentifier = {
  employerName: string;
  krs?: string;
  regon?: string;
  nip?: string;
  registrationDate?: string;
};

async function firstAwaitingAgreementIdentifier(agreementPage: {
  firstPendingAgreementEmployerName: Locator;
  firstPendingAgreementKrs: Locator;
  firstPendingAgreementRegon: Locator;
  firstPendingAgreementNip: Locator;
  firstPendingAgreementRegistrationDate: Locator;
}): Promise<AgreementIdentifier> {
  const [employerName, krs, regon, nip, registrationDate] = await Promise.all([
    agreementPage.firstPendingAgreementEmployerName.innerText(),
    agreementPage.firstPendingAgreementKrs.innerText(),
    agreementPage.firstPendingAgreementRegon.innerText(),
    agreementPage.firstPendingAgreementNip.innerText(),
    agreementPage.firstPendingAgreementRegistrationDate.innerText(),
  ]);

  return {
    employerName: employerName.trim(),
    krs: krs.trim() || undefined,
    regon: regon.trim() || undefined,
    nip: nip.trim() || undefined,
    registrationDate: registrationDate.trim() || undefined,
  };
}

test.describe('TC-FI-CONTRACTS - Contract management', () => {
  test('TC-FI-CONTRACTS-001 verifies every details tab for the first accepted agreement', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAcceptedAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();
    await expect(agreementPage.contractRows.first()).toBeVisible();

    await agreementPage.openAgreementDetails(agreementPage.contractRows.first());

    const tabs = [
      { tab: agreementPage.generalTab, panel: 'Ogólne' },
      { tab: agreementPage.companyTab, panel: 'Dane firmy' },
      { tab: agreementPage.representativesTab, panel: 'Reprezentanci/Pełnomocnicy' },
      { tab: agreementPage.documentsTab, panel: 'Dokumenty' },
      { tab: agreementPage.eventsTab, panel: 'Zdarzenia' },
    ];

    for (const { tab, panel } of tabs) {
      await tab.click();
      await expect(tab).toHaveAttribute('aria-selected', 'true');
      await expect(agreementPage.tabPanel(panel)).toBeVisible();
    }
  });

  test('TC-FI-CONTRACTS-002 searches accepted agreements by the first employer name', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAcceptedAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();

    const employerName = (await agreementPage.contractRows.first().getByRole('cell').nth(1).innerText()).trim();
    expect(employerName).not.toBe('');

    await agreementPage.searchAgreements(employerName);

    const matchingAgreements = agreementPage.contractRowsMatching({ employerName });
    await expect(matchingAgreements.first()).toBeVisible();
    expect(await matchingAgreements.count()).toBeGreaterThan(0);
  });

  test('TC-FI-CONTRACTS-003 sorts accepted agreements by registration date in both directions', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAcceptedAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();

    const columnName = 'Data rejestracji';
    const columnIndex = await agreementPage.columnIndex(columnName);
    const values = (await agreementPage.columnValues(columnIndex)).filter(Boolean);
    expect(new Set(values).size).toBeGreaterThan(1);

    await agreementPage.sortButton(columnName).click();
    await expect.poll(() => agreementPage.columnSortDirection(columnIndex)).toBe('ascending');

    await agreementPage.sortButton(columnName).click();
    await expect.poll(() => agreementPage.columnSortDirection(columnIndex)).toBe('descending');
  });

  test('TC-FI-CONTRACTS-004 cancels the first awaiting agreement and finds the same record on the cancelled tab', async ({
    loginAsFinancialInstitution,
    financialInstitutionAgreementPage: agreementPage,
  }) => {
    await loginAsFinancialInstitution();
    await agreementPage.openAwaitingAgreements();
    await agreementPage.waitForAcceptedAgreementsTable();
    await expect(agreementPage.firstPendingAgreement).toBeVisible();

    const identifier = await firstAwaitingAgreementIdentifier(agreementPage);
    expect(identifier.employerName).not.toBe('');

    await agreementPage.openAgreementDetails(agreementPage.firstPendingAgreement);
    const agreementId = await agreementPage.agreementId(agreementPage.firstPendingAgreement);
    await agreementPage.closeAgreementDetails(agreementPage.firstPendingAgreement);

    await agreementPage.firstPendingAgreementActionsButton.click();
    await agreementPage.firstPendingAgreementCancelLink.click();
    await expect(agreementPage.cancelAgreementDialog).toContainText(identifier.employerName);
    await agreementPage.confirmAgreementCancellationLink.click();
    await expect(agreementPage.agreementCancellationSuccessMessage(identifier.employerName)).toBeVisible();

    await agreementPage.openAgreementStatusTab('Anulowane');
    await agreementPage.searchAgreements(identifier.employerName);
    await agreementPage.setAgreementPageSize('100');

    const cancelledAgreements = agreementPage.contractRowsMatching(identifier);
    await expect(cancelledAgreements.first()).toBeVisible();

    const cancelledAgreementIds = await Promise.all(
      Array.from({ length: await cancelledAgreements.count() }, async (_, index) => {
        const candidate = cancelledAgreements.nth(index);
        await agreementPage.openAgreementDetails(candidate);
        const candidateId = await agreementPage.agreementId(candidate);
        await agreementPage.closeAgreementDetails(candidate);
        return candidateId;
      }),
    );

    expect(cancelledAgreementIds).toContain(agreementId);
  });
});
