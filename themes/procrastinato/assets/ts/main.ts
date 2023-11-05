import { CodeBlock } from "./lib/CodeBlock";
import { NavBar } from "./lib/NavBar";

declare global {
  interface Window {
    NavBar: NavBar;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.NavBar = new NavBar();

  document.querySelectorAll(".codeblock").forEach((el) => {
    new CodeBlock(el);
  });
});
