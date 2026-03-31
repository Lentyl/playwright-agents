import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async click(selector: string) {
    await this.page.click(selector);
  }

  async isVisible(selector: string) {
    return await this.page.isVisible(selector);
  }
 
  buttonDynamic = async (text: string, tag: string = 'button'): Promise<Locator> => this.page.getByRole(tag as any, { name: text, exact: true });

  inputDynamic = async (text: string): Promise<Locator> => this.page.getByLabel(text);

  radioDynamic = async (text: string, tag: string = 'radio'): Promise<Locator> => this.page.getByLabel(text);

  checkboxDynamic = async (text: string, tag: string = 'checkbox'): Promise<Locator> => this.page.getByLabel(text);

  linkDynamic = async (text: string, tag: string = 'link'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  headingDynamic = async (text: string, tag: string = 'heading'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  textDynamic = async (text: string): Promise<Locator> => this.page.getByText(text, { exact: true });

  listitemDynamic = async (text: string, tag: string = 'li'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  tableDynamic = async (text: string, tag: string = 'table'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  rowDynamic = async (text: string, tag: string = 'row'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  cellDynamic = async (text: string, tag: string = 'cell'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  comboboxDynamic = async (text: string, tag: string = 'combobox'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  tabDynamic = async (text: string, tag: string = 'tab'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  tabpanelDynamic = async (text: string, tag: string = 'tabpanel'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  dialogDynamic = async (text: string, tag: string = 'dialog'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  alertDynamic = async (text: string, tag: string = 'alert'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  navigationDynamic = async (text: string, tag: string = 'navigation'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  mainDynamic = async (text: string, tag: string = 'main'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  formDynamic = async (text: string, tag: string = 'form'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  groupDynamic = async (text: string, tag: string = 'group'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  imgDynamic = async (text: string, tag: string = 'img'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  menuDynamic = async (text: string, tag: string = 'menu'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  menuitemDynamic = async (text: string, tag: string = 'menuitem'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  sliderDynamic = async (text: string, tag: string = 'slider'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });

  progressbarDynamic = async (text: string, tag: string = 'progressbar'): Promise<Locator> => this.page.getByRole(tag as any, { name: text });
}
