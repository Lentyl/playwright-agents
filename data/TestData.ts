export const testData = {
  loginEmployer: process.env.LOGIN_EMPLOYER!,

  employer: {
    login: process.env.LOGIN_EMPLOYER!,
    password: process.env.PASSWORD_EMPLOYER!,
    companyName:
      '"INTERFOOD-IDEA" SPÓŁKA Z OGRANICZONĄ ODPOWIEDZIALNOŚCIĄ',
  },

  financialInstitution: {
    login: process.env.FINANCIAL_INSTITUTION_LOGIN!,
    password: process.env.FINANCIAL_INSTITUTION_PASSWORD!,
  },

  invalid: {
    password: process.env.INVALID_PASSWORD!,
  },

  messages: {
    invalidLogin: 'Nieprawidłowy identyfikator lub hasło',
    loggedOut: 'Zostałeś prawidłowo wylogowany',
    accessDenied: 'Brak dostępu!',
  },

  passwords: {
    tooShort: 'Nn2026!Secu',
    tooLong: 'Nn2026!SecureExtraExtra123',
    noSpecial: 'Nn20261234567',
    oneDigit: 'NnSecure!Pass2',
    noUppercase: 'nn2026!secure',
    tripleRepeat: 'Nn2026!!!Secure',
  },

  pesel: {
    valid: '44051401359',
    tooShort: '4405140135',
    tooLong: '440514013599',
    nonNumeric: '4405140135A',
  },

  dates: {
    valid: '1990-05-01',
    future: '2099-01-01',
    malformed: '01-05-1990',
  },

  emails: {
    valid: 'jan.kowalski@example.com',
    missingAt: 'jan.kowalskiexample.com',
    missingDomain: 'jan.kowalski@',
  },

  phone: {
    valid: '500600700',
  },

  reports: [
    'Raport Uczestników',
    'Raport z rozliczenia skladek',
    'Raport z historii zleceń Uczestników',
    'Raport z historii wpłat Uczestników',
    'Raport uczestnictwa w funduszach',
  ],

  returnedFileReports: [
    'Raport Id EPPK Uczestników',
    'Raport wypłata transferowa',
    'Raport Wypłata 60 lat',
    'Raport nierozliczonych wpłat',
    'Raport z korekt',
    'Raport z błędnym stosunkiem wpłat',
    'Raport z odrzuconych zleceń niefinansowych',
    'Raport rozliczonych wpłat z rezygnacją',
  ],

  aggremantUser: {
    companyName: 'Test Company Ltd',
    krs: '2869263918',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@testmail.com',
    phoneNumber: '+48500123456',
    dateOfBirth: '1990-06-15',
    gender: 'Male',

    address: {
      street: '123 Main Street',
      city: 'Warsaw',
      postalCode: '00-001',
      country: 'Poland',
    },

    username: 'johnsmith90',
    password: process.env.AGREEMENT_USER_PASSWORD!,
    company: 'Test Company Ltd',
    jobTitle: 'QA Engineer',
    website: 'https://www.test-company.com',
    newsletterConsent: true,
  },
} as 