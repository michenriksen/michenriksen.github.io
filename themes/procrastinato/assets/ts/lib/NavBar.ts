const menuBtnId = "toggleMobileMenu";
const menuId = "mobileMenu";
const themeMenuBtnId = "toggleThemeMenu";
const themeMenuId = "themeMenu";
const lightThemeBtnId = "lightThemeBtn";
const darkThemeBtnId = "darkThemeBtn";
const systemThemeBtnId = "systemThemeBtn";
const localStorageThemeKey = "theme";

type Theme = "light" | "dark" | "system";

export class NavBar {
  private menuBtn: Element;
  private menu: Element;
  private showingMenu: boolean = false;

  private themeMenuBtn: Element;
  private themeMenu: Element;
  private showingThemeMenu: boolean = false;

  public constructor() {
    const menuBtn = document.getElementById(menuBtnId);
    if (!menuBtn) {
      throw new Error(`#${menuBtnId} element not found`);
    }

    const menu = document.getElementById(menuId);
    if (!menu) {
      throw new Error(`#${menuId} element not found`);
    }

    const themeMenuBtn = document.getElementById(themeMenuBtnId);
    if (!themeMenuBtn) {
      throw new Error(`#${themeMenuBtnId} element not found`);
    }

    const themeMenu = document.getElementById(themeMenuId);
    if (!themeMenu) {
      throw new Error(`#${themeMenuId} element not found`);
    }

    this.menuBtn = menuBtn;
    this.menu = menu;
    this.themeMenuBtn = themeMenuBtn;
    this.themeMenu = themeMenu;

    this.init();
  }

  private init() {
    this.menuBtn.addEventListener("click", (e) => this.toggleMenu(e));
    this.themeMenuBtn.addEventListener("click", (e) => this.toggleThemeMenu(e));

    const themeBtn = this.themeButton();
    themeBtn.setAttribute("aria-current", "true");

    document.querySelectorAll(".theme-menu-item").forEach((item) => {
      item.addEventListener("click", (e) => this.updateTheme(e));
    });

    this.log("initialized");
  }

  private toggleMenu(e: Event) {
    e.preventDefault();

    if (this.showingMenu) {
      this.hideMenu();
      return;
    }

    this.showMenu();
  }

  private showMenu() {
    if (this.showingMenu) {
      return;
    }

    this.menu.classList.remove("hidden");
    this.menuBtn.setAttribute("aria-expanded", "true");
    this.showingMenu = true;

    this.log("showing mobile menu");
  }

  private hideMenu() {
    if (!this.showingMenu) {
      return;
    }

    this.menu.classList.add("hidden");
    this.menuBtn.setAttribute("aria-expanded", "false");
    this.showingMenu = false;

    this.log("hiding mobile menu");
  }

  private toggleThemeMenu(e: Event) {
    e.preventDefault();
    e.stopImmediatePropagation();

    if (this.showingThemeMenu) {
      this.hideThemeMenu();
      return;
    }

    this.showThemeMenu();
  }

  private showThemeMenu() {
    if (this.showingThemeMenu) {
      return;
    }

    this.themeMenu.classList.remove("hidden");
    this.themeMenuBtn.setAttribute("aria-expanded", "true");
    this.showingThemeMenu = true;

    this.log("showing theme menu");

    const controller = new AbortController();

    document.addEventListener(
      "click",
      (e) => {
        const withinThemeMenu = e.composedPath().includes(this.themeMenu);

        if (!withinThemeMenu) {
          this.log("detected click outside of theme menu");
          this.hideThemeMenu();
          controller.abort();
        }
      },
      { signal: controller.signal },
    );
  }

  private hideThemeMenu() {
    if (!this.showingThemeMenu) {
      return;
    }

    this.themeMenu.classList.add("hidden");
    this.themeMenuBtn.setAttribute("aria-expanded", "false");
    this.showingThemeMenu = false;

    this.log("hiding theme menu");
  }

  private getTheme(): Theme {
    switch (localStorage.getItem(localStorageThemeKey)) {
      case "light":
        return "light";
      case "dark":
        return "dark";
      default:
        return "system";
    }
  }

  private updateTheme(e: Event) {
    const el = e.currentTarget as HTMLButtonElement;

    switch (el.value) {
      case "light":
        this.setTheme("light");
        break;
      case "dark":
        this.setTheme("dark");
        break;
      default:
        this.setTheme("system");
        break;
    }

    const previous = document.querySelector(".theme-menu-item[aria-current='true']");
    if (previous) {
      previous.removeAttribute("aria-current");
    }

    el.setAttribute("aria-current", "true");
  }

  private setTheme(theme: Theme) {
    switch (theme) {
      case "light":
        localStorage.setItem(localStorageThemeKey, "light");
        document.documentElement.classList.remove("dark");
        break;
      case "dark":
        localStorage.setItem(localStorageThemeKey, "dark");
        document.documentElement.classList.add("dark");
        break;
      default:
        localStorage.removeItem(localStorageThemeKey);

        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        break;
    }
  }

  private themeButton(): HTMLElement {
    const theme = this.getTheme();

    let btn: HTMLElement | null;

    switch (theme) {
      case "light":
        btn = document.getElementById(lightThemeBtnId);
        break;
      case "dark":
        btn = document.getElementById(darkThemeBtnId);
        break;
      default:
        btn = document.getElementById(systemThemeBtnId);
        break;
    }

    if (!btn) {
      throw new Error(`button element for ${theme} theme not found`);
    }

    return btn;
  }

  private log(message: string, kind: null | string = null) {
    message = `[navbar] ${message}`;
    if (kind === "error") {
      console.error(message);
      return;
    }

    console.debug(message);
  }
}
