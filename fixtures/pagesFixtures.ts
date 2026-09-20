import { test as base, expect } from '@playwright/test';
import testData from '../data/testData.json';
import LoginPage from '../pages/LoginPage';
import EmployerDashboardPage from '../pages/EmployerDashboardPage';
import ParticipantListPage from '../pages/ParticipantListPage';
import UserAdminPage from '../pages/UserAdminPage';
import ReportsPage from '../pages/ReportsPage';
import ReturnedFilesPage from '../pages/ReturnedFilesPage';
import DocumentsPage from '../pages/DocumentsPage';
import PasswordChangePage from '../pages/PasswordChangePage';
import ContractDataPage from '../pages/ContractDataPage';
import RelatedUsersPage from '../pages/RelatedUsersPage';
import TrustedDevicesPage from '../pages/TrustedDevicesPage';
import FileUploadPage from '../pages/FileUploadPage';
import RegistrationWizardPage from '../pages/RegistrationWizardPage';
import DispositionsPage from '../pages/DispositionsPage';
import FinancialInstitutionDashboardPage from '../pages/FinancialInstitutionDashboardPage';
import FinancialInstitutionParticipantListPage from '../pages/FinancialInstitutionParticipantListPage';
import FinancialInstitutionRegistrationPage from '../pages/FinancialInstitutionRegistrationPage';
import FinancialInstitutionAgreementPage from '../pages/FinancialInstitutionAgreementPage';
import PermissionGroupsPage from '../pages/PermissionGroupsPage';
import FinancialInstitutionReportsPage from '../pages/FinancialInstitutionReportsPage';
import FinancialInstitutionDocumentsPage from '../pages/FinancialInstitutionDocumentsPage';
import FinancialInstitutionAwaitingOrdersPage from '../pages/FinancialInstitutionAwaitingOrdersPage';
import FinancialInstitutionTerminationPage from '../pages/FinancialInstitutionTerminationPage';
import FinancialInstitutionConversionPage from '../pages/FinancialInstitutionConversionPage';

/**
 * Credentials are read from environment variables first so passwords do not
 * have to live in the repository; the committed TEST-environment values act as
 * a fallback so the suite is runnable out of the box.
 */
export const credentials = {
  employer: {
    login: process.env.PPK_EMPLOYER_LOGIN ?? testData.employer.login,
    password: process.env.PPK_EMPLOYER_PASSWORD ?? testData.employer.password,
  },
  financialInstitution: {
    login: process.env.PPK_FINANCIAL_INSTITUTION_LOGIN ?? testData.financialInstitution.login,
    password: process.env.PPK_FINANCIAL_INSTITUTION_PASSWORD ?? testData.financialInstitution.password,
  },
};

type Pages = {
  loginPage: LoginPage;
  dashboardPage: EmployerDashboardPage;
  participantListPage: ParticipantListPage;
  userAdminPage: UserAdminPage;
  reportsPage: ReportsPage;
  returnedFilesPage: ReturnedFilesPage;
  documentsPage: DocumentsPage;
  passwordChangePage: PasswordChangePage;
  contractDataPage: ContractDataPage;
  relatedUsersPage: RelatedUsersPage;
  trustedDevicesPage: TrustedDevicesPage;
  fileUploadPage: FileUploadPage;
  registrationWizardPage: RegistrationWizardPage;
  dispositionsPage: DispositionsPage;
  financialInstitutionDashboardPage: FinancialInstitutionDashboardPage;
  financialInstitutionParticipantListPage: FinancialInstitutionParticipantListPage;
  financialInstitutionRegistrationPage: FinancialInstitutionRegistrationPage;
  financialInstitutionAgreementPage: FinancialInstitutionAgreementPage;
  financialInstitutionReportsPage: FinancialInstitutionReportsPage;
  financialInstitutionDocumentsPage: FinancialInstitutionDocumentsPage;
  financialInstitutionAwaitingOrdersPage: FinancialInstitutionAwaitingOrdersPage;
  financialInstitutionTerminationPage: FinancialInstitutionTerminationPage;
  financialInstitutionConversionPage: FinancialInstitutionConversionPage;
  permissionGroupsPage: PermissionGroupsPage;
  loginAsEmployer: () => Promise<void>;
  loginAsFinancialInstitution: () => Promise<void>;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => { await use(new LoginPage(page)); },
  dashboardPage: async ({ page }, use) => { await use(new EmployerDashboardPage(page)); },
  participantListPage: async ({ page }, use) => { await use(new ParticipantListPage(page)); },
  userAdminPage: async ({ page }, use) => { await use(new UserAdminPage(page)); },
  reportsPage: async ({ page }, use) => { await use(new ReportsPage(page)); },
  returnedFilesPage: async ({ page }, use) => { await use(new ReturnedFilesPage(page)); },
  documentsPage: async ({ page }, use) => { await use(new DocumentsPage(page)); },
  passwordChangePage: async ({ page }, use) => { await use(new PasswordChangePage(page)); },
  contractDataPage: async ({ page }, use) => { await use(new ContractDataPage(page)); },
  relatedUsersPage: async ({ page }, use) => { await use(new RelatedUsersPage(page)); },
  trustedDevicesPage: async ({ page }, use) => { await use(new TrustedDevicesPage(page)); },
  fileUploadPage: async ({ page }, use) => { await use(new FileUploadPage(page)); },
  registrationWizardPage: async ({ page }, use) => { await use(new RegistrationWizardPage(page)); },
  dispositionsPage: async ({ page }, use) => { await use(new DispositionsPage(page)); },
  financialInstitutionDashboardPage: async ({ page }, use) => { await use(new FinancialInstitutionDashboardPage(page)); },
  financialInstitutionParticipantListPage: async ({ page }, use) => { await use(new FinancialInstitutionParticipantListPage(page)); },
  financialInstitutionRegistrationPage: async ({ page }, use) => { await use(new FinancialInstitutionRegistrationPage(page)); },
  financialInstitutionAgreementPage: async ({ page }, use) => { await use(new FinancialInstitutionAgreementPage(page)); },
  financialInstitutionReportsPage: async ({ page }, use) => { await use(new FinancialInstitutionReportsPage(page)); },
  financialInstitutionDocumentsPage: async ({ page }, use) => { await use(new FinancialInstitutionDocumentsPage(page)); },
  financialInstitutionAwaitingOrdersPage: async ({ page }, use) => { await use(new FinancialInstitutionAwaitingOrdersPage(page)); },
  financialInstitutionTerminationPage: async ({ page }, use) => { await use(new FinancialInstitutionTerminationPage(page)); },
  financialInstitutionConversionPage: async ({ page }, use) => { await use(new FinancialInstitutionConversionPage(page)); },
  permissionGroupsPage: async ({ page }, use) => { await use(new PermissionGroupsPage(page)); },

  loginAsEmployer: async ({ loginPage, page }, use) => {
    await use(async () => {
      await page.goto('/ppk-nnpte2/nnpte/employer');
      await page.waitForURL(/\/nnpte\/employer$/, { timeout: 15000 }).catch(() => {
        throw new Error(
          'Employer authentication state is invalid or expired. Run the setup project again and check the configured credentials.',
        );
      });
    });
  },

  loginAsFinancialInstitution: async ({ loginPage, page }, use) => {
    await use(async () => {
      await page.goto('/ppk-nnpte2/nnpte/manager/login/fork');
      await page.waitForURL(/\/nnpte\/manager\/login\/fork$/, { timeout: 15000 }).catch(() => {
        throw new Error(
          'Financial Institution authentication state is invalid or expired. Run the setup project again and check the configured credentials.',
        );
      });
    });
  },
});

export { expect, testData };
