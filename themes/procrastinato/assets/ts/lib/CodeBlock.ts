const classSuccess = "!text-green-500";
const classFailure = "!text-red-500";
const clearStatusDelayMs = 3500;

export class CodeBlock {
  private wrapper: Element;
  private copyBtn: Element;

  public constructor(el: Element) {
    this.wrapper = el;

    this.init();
  }

  private init() {
    const copyBtn = this.wrapper.querySelector(":scope .copyToClipboard");
    if (!copyBtn) {
      throw new Error(`.copyToClipboard element not found in #${this.wrapper.id}`);
    }

    this.copyBtn = copyBtn;
    this.copyBtn.addEventListener("click", (e) => this.handleCopyBtnClick(e));

    this.removeTabIndex();

    this.log(`initialized`);
  }

  private async handleCopyBtnClick(e: Event) {
    e.preventDefault();

    try {
      const lines = Array.from(this.wrapper.querySelectorAll(":scope code .cl"));
      const code = lines
        .map((line) => {
          return line.textContent;
        })
        .join("");

      await this.writeToClipboard(code);
      this.statusSuccess();
    } catch (error) {
      this.log(`writing code to clipboard: ${error}`, "error");
      this.statusFailure();
    } finally {
      this.clearStatusAfterDelay();
    }
  }

  private async writeToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      throw new Error(`clipboard write operation failed: ${error}`);
    }
  }

  private statusSuccess() {
    this.clearStatus();
    this.copyBtn.classList.add(classSuccess);
  }

  private statusFailure() {
    this.clearStatus();
    this.copyBtn.classList.add(classFailure);
  }

  private clearStatus() {
    this.copyBtn.classList.remove(classSuccess, classFailure);
  }

  private clearStatusAfterDelay() {
    setTimeout(() => {
      this.clearStatus();
    }, clearStatusDelayMs);
  }

  /**
   * Removes tabindex attribute from the chroma wrapper.
   *
   * It's recommended that non-interactive elements should not be focusable by
   * keyboard, so the tabindex attribute on the .chroma wrapper is removed with
   * Javascript because Hugo does not support control of this attribute.
   *
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex#accessibility_concerns
   */
  private removeTabIndex() {
    const chroma = this.wrapper.querySelector(":scope .chroma");

    if (!chroma) {
      throw new Error(`.chroma element not found in code block #${this.wrapper.id}`);
    }

    chroma.removeAttribute("tabindex");
  }

  private log(message: string, kind: null | string = null) {
    message = `[${this.wrapper.id}] ${message}`;
    if (kind === "error") {
      console.error(message);
      return;
    }

    console.debug(message);
  }
}
