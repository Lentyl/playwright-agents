import { test as base, expect } from '@playwright/test';
import testData from '../data/testData.json';

import LoginPage from '../pages/LoginPage';
import EmployerDashboardPage from '../pages/employer/EmployerDashboardPage';
import EmployerParticipantListPage from '../pages/employer/EmployerParticipantListPage';
import EmployerUserAdminPage from '../pages/employer/EmployerUserAdminPage';
import EmployerReportsPage from '../pages/employer/EmployerReportsPage';
import EmployerReturnedFilesPage from '../pages/employer/EmployerReturnedFilesPage';
import EmployerDocumentsPage from '../pages/employer/EmployerDocumentsPage';
import EmployerPasswordChangePage from '../pages/employer/EmployerPasswordChangePage';
import EmployerContractDataPage from '../pages/employer/EmployerContractDataPage';
import EmployerRelatedUsersPage from '../pages/employer/EmployerRelatedUsersPage';
import EmployerTrustedDevicesPage from '../pages/employer/EmployerTrustedDevicesPage';
import EmployerFileUploadPage from '../pages/employer/EmployerFileUploadPage';
import EmployerRegistrationWizardPage from '../pages/employer/EmployerRegistrationWizardPage';
import EmployerContributionsPage from '../pages/employer/EmployerContributionsPage';
import EmployerCorrectionsPage from '../pages/employer/EmployerCorrectionsPage';
import EmployerDispositionsPage from '../pages/employer/EmployerDispositionsPage';

import { EmployerPreviewPage } from '../pages/employer/EmployerPreviewPage';
import EmployerInformationMaterialsPage from '../pages/employer/EmployerInformationMaterialsPage';
import EmployerTrainingsPage from '../pages/employer/EmployerTrainingsPage';
import { EmployerAutoEnrollmentPage } from '../pages/employer/EmployerAutoEnrollmentPage';

import FinancialInstitutionDashboardPage from '../pages/financial-institution/FinancialInstitutionDashboardPage';
import FinancialInstitutionParticipantListPage from '../pages/financial-institution/FinancialInstitutionParticipantListPage';
import FinancialInstitutionRegistrationPage from '../pages/financial-institution/FinancialInstitutionRegistrationPage';
import FinancialInstitutionAgreementPage from '../pages/financial-institution/FinancialInstitutionAgreementPage';
import FinancialInstitutionReportsPage from '../pages/financial-institution/FinancialInstitutionReportsPage';
import FinancialInstitutionDocumentsPage from '../pages/financial-institution/FinancialInstitutionDocumentsPage';
import FinancialInstitutionAwaitingOrdersPage from '../pages/financial-institution/FinancialInstitutionAwaitingOrdersPage';
import FinancialInstitutionTerminationPage from '../pages/financial-institution/FinancialInstitutionTerminationPage';
import FinancialInstitutionContactPage from '../pages/financial-institution/FinancialInstitutionContactPage';
import FinancialInstitutionEmployerPreviewPage from '../pages/financial-institution/FinancialInstitutionEmployerPreviewPage';
import PermissionGroupsPage from '../pages/financial-institution/PermissionGroupsPage';
import EmployerDispositionFormPage from '../pages/employer/EmployerDispositionFormPage';

export const credentials = {
  employer: {
    login: process.env.PPK_EMPLOYER_LOGIN ?? testData.employer.login,
    password: process.env.PPK_EMPLOYER_PASSWORD ?? testData.employer.password,
  },
  financialInstitution: {
    login:
      process.env.PPK_FINANCIAL_INSTITUTION_LOGIN ??
      testData.financialInstitution.login,
    password:
      process.env.PPK_FINANCIAL_INSTITUTION_PASSWORD ??
      testData.financialInstitution.password,
  },
};

type Pages = {
  loginPage: LoginPage;
  employerDashboardPage: EmployerDashboardPage;
  employerParticipantListPage: EmployerParticipantListPage;
  employerUserAdminPage: EmployerUserAdminPage;
  employerReportsPage: EmployerReportsPage;
  employerReturnedFilesPage: EmployerReturnedFilesPage;
  employerDocumentsPage: EmployerDocumentsPage;
  employerPasswordChangePage: EmployerPasswordChangePage;
  employerContractDataPage: EmployerContractDataPage;
  employerRelatedUsersPage: EmployerRelatedUsersPage;
  employerTrustedDevicesPage: EmployerTrustedDevicesPage;
  employerFileUploadPage: EmployerFileUploadPage;
  employerRegistrationWizardPage: EmployerRegistrationWizardPage;
  employerContributionsPage: EmployerContributionsPage;
  employerCorrectionsPage: EmployerCorrectionsPage;
  employerDispositionsPage: EmployerDispositionsPage;

  employerPreviewPage: EmployerPreviewPage;
  employerInformationMaterialsPage: EmployerInformationMaterialsPage;
  employerTrainingsPage: EmployerTrainingsPage;
  employerAutoEnrollmentPage: EmployerAutoEnrollmentPage;

  financialInstitutionDashboardPage: FinancialInstitutionDashboardPage;
  financialInstitutionParticipantListPage: FinancialInstitutionParticipantListPage;
  financialInstitutionRegistrationPage: FinancialInstitutionRegistrationPage;
  financialInstitutionAgreementPage: FinancialInstitutionAgreementPage;
  financialInstitutionReportsPage: FinancialInstitutionReportsPage;
  financialInstitutionDocumentsPage: FinancialInstitutionDocumentsPage;
  financialInstitutionAwaitingOrdersPage: FinancialInstitutionAwaitingOrdersPage;
  financialInstitutionTerminationPage: FinancialInstitutionTerminationPage;
  financialInstitutionContactPage: FinancialInstitutionContactPage;
  financialInstitutionEmployerPreviewPage: FinancialInstitutionEmployerPreviewPage;

  permissionGroupsPage: PermissionGroupsPage;
  employerDispositionFormPage: EmployerDispositionFormPage;

  loginAsEmployer: () => Promise<void>;
  loginAsFinancialInstitution: () => Promise<void>;
  openRegistrationLink: () => Promise<void>;
};

export const test = base.extend<Pages>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  employerDashboardPage: async ({ page }, use) => {
    await use(new EmployerDashboardPage(page));
  },

  employerParticipantListPage: async ({ page }, use) => {
    await use(new EmployerParticipantListPage(page));
  },

  employerUserAdminPage: async ({ page }, use) => {
    await use(new EmployerUserAdminPage(page));
  },

  employerReportsPage: async ({ page }, use) => {
    await use(new EmployerReportsPage(page));
  },

  employerReturnedFilesPage: async ({ page }, use) => {
    await use(new EmployerReturnedFilesPage(page));
  },

  employerDocumentsPage: async ({ page }, use) => {
    await use(new EmployerDocumentsPage(page));
  },

  employerPasswordChangePage: async ({ page }, use) => {
    await use(new EmployerPasswordChangePage(page));
  },

  employerContractDataPage: async ({ page }, use) => {
    await use(new EmployerContractDataPage(page));
  },

  employerRelatedUsersPage: async ({ page }, use) => {
    await use(new EmployerRelatedUsersPage(page));
  },

  employerTrustedDevicesPage: async ({ page }, use) => {
    await use(new EmployerTrustedDevicesPage(page));
  },

  employerFileUploadPage: async ({ page }, use) => {
    await use(new EmployerFileUploadPage(page));
  },

  employerRegistrationWizardPage: async ({ page }, use) => {
    await use(new EmployerRegistrationWizardPage(page));
  },
  employerContributionsPage: async ({ page }, use) => {
    await use(new EmployerContributionsPage(page));
  },

  employerCorrectionsPage: async ({ page }, use) => {
    await use(new EmployerCorrectionsPage(page));
  },

  employerDispositionsPage: async ({ page }, use) => {
    await use(new EmployerDispositionsPage(page));
  },

  employerPreviewPage: async ({ page }, use) => {
    await use(new EmployerPreviewPage(page));
  },

  employerInformationMaterialsPage: async ({ page }, use) => {
    await use(new EmployerInformationMaterialsPage(page));
  },

  employerTrainingsPage: async ({ page }, use) => {
    await use(new EmployerTrainingsPage(page));
  },

  employerAutoEnrollmentPage: async ({ page }, use) => {
    await use(new EmployerAutoEnrollmentPage(page));
  },

  financialInstitutionDashboardPage: async ({ page }, use) => {
    await use(new FinancialInstitutionDashboardPage(page));
  },

  financialInstitutionParticipantListPage: async ({ page }, use) => {
    await use(new FinancialInstitutionParticipantListPage(page));
  },

  financialInstitutionRegistrationPage: async ({ page }, use) => {
    await use(new FinancialInstitutionRegistrationPage(page));
  },

  financialInstitutionAgreementPage: async ({ page }, use) => {
    await use(new FinancialInstitutionAgreementPage(page));
  },

  financialInstitutionReportsPage: async ({ page }, use) => {
    await use(new FinancialInstitutionReportsPage(page));
  },

  financialInstitutionDocumentsPage: async ({ page }, use) => {
    await use(new FinancialInstitutionDocumentsPage(page));
  },

  financialInstitutionAwaitingOrdersPage: async ({ page }, use) => {
    await use(new FinancialInstitutionAwaitingOrdersPage(page));
  },

  financialInstitutionTerminationPage: async ({ page }, use) => {
    await use(new FinancialInstitutionTerminationPage(page));
  },

  financialInstitutionContactPage: async ({ page }, use) => {
    await use(new FinancialInstitutionContactPage(page));
  },

  financialInstitutionEmployerPreviewPage: async ({ page }, use) => {
    await use(new FinancialInstitutionEmployerPreviewPage(page));
  },

  permissionGroupsPage: async ({ page }, use) => {
    await use(new PermissionGroupsPage(page));
  },

  employerDispositionFormPage: async ({ page }, use) => {
    await use(new EmployerDispositionFormPage(page));
  },

  loginAsEmployer: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/ppk-nnpte2/nnpte/employer');

      await page
        .waitForURL(/\/nnpte\/employer$/, {
          timeout: 15000,
        })
        .catch(() => {
          throw new Error(
            'Employer authentication state is invalid or expired. Run the setup project again and check the configured credentials.'
          );
        });
    });
  },

  loginAsFinancialInstitution: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/ppk-nnpte2/nnpte/manager/login/fork');

      await page
        .waitForURL(/\/nnpte\/manager\/login\/fork$/, {
          timeout: 15000,
        })
        .catch(() => {
          throw new Error(
            'Financial Institution authentication state is invalid or expired. Run the setup project again and check the configured credentials.'
          );
        });
    });
  },

  openRegistrationLink: async ({ page }, use) => {
    await use(async () => {
      await page.goto(
        'https://test.moventum.com.pl/ppk-nnpte2/nnpte/PPKAccountOpen?mode=init'
      );

      await page
        .waitForURL(/\/nnpte\/PPKAccountOpen\?mode=init$/, {
          timeout: 15000,
        })
        .catch(() => {
          throw new Error(
            'Registration page is unavailable or the URL is incorrect.'
          );
        });
    });
  },
});

export { expect, testData };