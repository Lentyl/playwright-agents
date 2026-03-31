import { test as base, expect } from '@playwright/test';
import { BasePage } from '../Pages/BasePage';
import { NavigationPage } from '../Pages/NavigationPage';
import { CheckBoxPage } from '../Pages/CheckBoxPage';
import { TextBoxPage } from '../Pages/TextBoxPage';
import { RadioButtonsPage } from '../Pages/RadioButtonsPage';
import { WebTablesPage } from '../Pages/WebTablesPage';
import { ButtonsPage } from '../Pages/ButtonsPage';
import { LinksPage } from '../Pages/LinksPage';
import { UploadDownloadPage } from '../Pages/UploadDownloadPage';
import { PracticeFormPage } from '../Pages/PracticeFormPage';
import { BrowserWindowsPage } from '../Pages/BrowserWindowsPage';
import { AlertsPage } from '../Pages/AlertsPage';
import { FramesPage } from '../Pages/FramesPage';
import { ModalDialogsPage } from '../Pages/ModalDialogsPage';
import { DatePickerPage } from '../Pages/DatePickerPage';
import { AutoCompletePage } from '../Pages/AutoCompletePage';
import { SliderPage } from '../Pages/SliderPage';
import { ProgressBarPage } from '../Pages/ProgressBarPage';
import { TabsPage } from '../Pages/TabsPage';
import { DragDropPage } from '../Pages/DragDropPage';
import { ResizablePage } from '../Pages/ResizablePage';
import { SelectablePage } from '../Pages/SelectablePage';
import { SortablePage } from '../Pages/SortablePage';

type TestFixtures = {
  navigationPage: NavigationPage;
  checkBoxPage: CheckBoxPage;
  textBoxPage: TextBoxPage;
  radioPage: RadioButtonsPage;
  webTablesPage: WebTablesPage;
  buttonsPage: ButtonsPage;
  linksPage: LinksPage;
  uploadDownloadPage: UploadDownloadPage;
  practiceFormPage: PracticeFormPage;
  browserWindowsPage: BrowserWindowsPage;
  alertsPage: AlertsPage;
  framesPage: FramesPage;
  modalDialogsPage: ModalDialogsPage;
  datePickerPage: DatePickerPage;
  autoCompletePage: AutoCompletePage;
  sliderPage: SliderPage;
  progressBarPage: ProgressBarPage;
  tabsPage: TabsPage;
  dragDropPage: DragDropPage;
  resizablePage: ResizablePage;
  selectablePage: SelectablePage;
  sortablePage: SortablePage;
};

export const test = base.extend<TestFixtures>({
  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },
  checkBoxPage: async ({ page }, use) => {
    await use(new CheckBoxPage(page));
  },
  textBoxPage: async ({ page }, use) => {
    await use(new TextBoxPage(page));
  },
  radioPage: async ({ page }, use) => {
    await use(new RadioButtonsPage(page));
  },
  webTablesPage: async ({ page }, use) => {
    await use(new WebTablesPage(page));
  },
  buttonsPage: async ({ page }, use) => {
    await use(new ButtonsPage(page));
  },
  linksPage: async ({ page }, use) => {
    await use(new LinksPage(page));
  },
  uploadDownloadPage: async ({ page }, use) => {
    await use(new UploadDownloadPage(page));
  },
  practiceFormPage: async ({ page }, use) => {
    await use(new PracticeFormPage(page));
  },
  browserWindowsPage: async ({ page }, use) => {
    await use(new BrowserWindowsPage(page));
  },
  alertsPage: async ({ page }, use) => {
    await use(new AlertsPage(page));
  },
  framesPage: async ({ page }, use) => {
    await use(new FramesPage(page));
  },
  modalDialogsPage: async ({ page }, use) => {
    await use(new ModalDialogsPage(page));
  },
  datePickerPage: async ({ page }, use) => {
    await use(new DatePickerPage(page));
  },
  autoCompletePage: async ({ page }, use) => {
    await use(new AutoCompletePage(page));
  },
  sliderPage: async ({ page }, use) => {
    await use(new SliderPage(page));
  },
  progressBarPage: async ({ page }, use) => {
    await use(new ProgressBarPage(page));
  },
  tabsPage: async ({ page }, use) => {
    await use(new TabsPage(page));
  },
  dragDropPage: async ({ page }, use) => {
    await use(new DragDropPage(page));
  },
  resizablePage: async ({ page }, use) => {
    await use(new ResizablePage(page));
  },
  selectablePage: async ({ page }, use) => {
    await use(new SelectablePage(page));
  },
  sortablePage: async ({ page }, use) => {
    await use(new SortablePage(page));
  },
});


export { expect };

// Global hook: ensure every test starts at the app home page
test.beforeEach(async ({ page }) => {
  // Inject a script that blocks/neutralizes ad iframes and observes DOM mutations
  // This runs before any page script to prevent ad elements from ever being added.
  await page.addInitScript(() => {
    try {
      const adPattern = /ads|doubleclick|googlesyndication|adservice|adroll|adserver|adscale|rubicon|adblade|amazon-ads|rtb|adtech|adform/i;

      // Override createElement to sanitize iframes at creation time
      const origCreate = Document.prototype.createElement;
      Document.prototype.createElement = function (tagName: any, options?: any) {
        const el = origCreate.call(this, tagName, options);
        try {
          if (String(tagName).toLowerCase() === 'iframe') {
            // Intercept src/data-src setting to block known ad hosts
            const origSet = (el as any).setAttribute;
            (el as any).setAttribute = function (name: string, value: any) {
              if ((name === 'src' || name === 'data-src') && typeof value === 'string' && adPattern.test(value)) {
                try { (this as HTMLElement).style.display = 'none'; } catch (e) {}
                return;
              }
              return origSet.call(this, name, value);
            };
            el.addEventListener('load', function () {
              try {
                const src = (this as any).src || (this as any).getAttribute('src') || '';
                if (src && adPattern.test(src)) (this as HTMLElement).remove();
              } catch (e) {}
            });
          }
        } catch (e) {}
        return el;
      };

      // Prevent appending ad iframes
      const origAppend = Node.prototype.appendChild;
      Node.prototype.appendChild = function (node: any) {
        try {
          if (node && node.tagName === 'IFRAME') {
            const src = node.src || node.getAttribute && (node.getAttribute('src') || node.getAttribute('data-src')) || '';
            if (src && adPattern.test(src)) {
              return node; // skip appending
            }
          }
        } catch (e) {}
        return origAppend.call(this, node);
      };

      const removeAds = () => {
        const sel = ['#fixedban', '#adplus-anchor', '.advertisement', '.ads', '.ad', '.ad-banner', '.banner', '.commercial', '.sponsor', '.region--ad', '.adunit'];
        sel.forEach((s) => document.querySelectorAll(s).forEach((el) => el.remove()));

        document.querySelectorAll('iframe').forEach((iframe) => {
          try {
            const src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || '';
            const r = (iframe as HTMLElement).getBoundingClientRect();
            if ((src && adPattern.test(src)) || r.width * r.height > 20000 || r.height > 150) iframe.remove();
          } catch (e) {}
        });

        document.querySelectorAll('body *').forEach((el) => {
          try {
            const style = window.getComputedStyle(el as Element);
            if ((style.position === 'fixed' || style.position === 'sticky') && style.display !== 'none') {
              const r = (el as HTMLElement).getBoundingClientRect();
              if (r.width * r.height > 20000 || r.height > 120 || r.width > window.innerWidth * 0.5) el.remove();
            }
          } catch (e) {}
        });
      };

      removeAds();
      const obs = new MutationObserver(removeAds);
      obs.observe(document, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 8000);
    } catch (e) {
      // ignore
    }
  });

  // Navigate after the init script is in place
  await page.goto('/');

  // Final cleanup after navigation in case any ads slipped through
  await page.evaluate(() => {
    const removeAds = () => {
      const selectors = ['#fixedban', '#adplus-anchor', '.advertisement', '.ads', '.ad', '.ad-banner', '.banner', '.commercial', '.sponsor', '.region--ad', '.adunit'];
      selectors.forEach((s) => document.querySelectorAll(s).forEach((el) => el.remove()));
      document.querySelectorAll('iframe').forEach((iframe) => {
        try {
          const src = iframe.getAttribute('src') || iframe.getAttribute('data-src') || '';
          const r = (iframe as HTMLElement).getBoundingClientRect();
          if (/ads|doubleclick|googlesyndication|adservice|adroll|adserver|adscale|rubicon|adblade|amazon-ads|rtb/i.test(src) || r.width * r.height > 20000 || r.height > 150) iframe.remove();
        } catch (e) {}
      });
      document.querySelectorAll('body *').forEach((el) => {
        try {
          const style = window.getComputedStyle(el as Element);
          if ((style.position === 'fixed' || style.position === 'sticky') && style.display !== 'none') {
            const r = (el as HTMLElement).getBoundingClientRect();
            if (r.width * r.height > 20000 || r.height > 120 || r.width > window.innerWidth * 0.5) el.remove();
          }
        } catch (e) {}
      });
    };
    removeAds();
  });
});
