"use client";

const SHORT_WORDS_PATTERN = "(?:и|в|во|к|ко|с|со|у|о|об|а|но|на|не|по|от|до|из|за|для|под|при)";
const WIDOW_RE = new RegExp(`(^|[\\s([{"«])(${SHORT_WORDS_PATTERN})\\s+(?=[А-Яа-яЁё0-9«"])`, "gimu");
const A_NE_RE = /,\s*(а)\s+(не)\s+(?=[А-Яа-яЁё0-9«"])/gimu;
const NUMBER_WORD_RE = /(\d+)\s+(?=[А-Яа-яЁё%])/gmu;
const EM_DASH_RE = /—\s+(?=[А-Яа-яЁё0-9«"])/gmu;

function shouldSkipNode(node: Node): boolean {
  let current: Node | null = node.parentNode;

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const el = current as HTMLElement;
    const tag = el.tagName;
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "CODE" || tag === "PRE") {
      return true;
    }
    current = current.parentNode;
  }

  return false;
}

export function WidowFix() {
  // useEffect(() => {
  //   const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  //   const nodes: Text[] = [];

  //   while (walker.nextNode()) {
  //     const textNode = walker.currentNode as Text;
  //     if (textNode.nodeValue && !shouldSkipNode(textNode)) {
  //       nodes.push(textNode);
  //     }
  //   }

  //   nodes.forEach((node) => {
  //     const value = node.nodeValue;
  //     if (!value) return;
  //     const withANe = value.replace(A_NE_RE, (_, a: string, ne: string) => `, ${a}\u00A0${ne}\u00A0`);
  //     const withWidows = withANe.replace(WIDOW_RE, (_, prefix: string, word: string) => `${prefix}${word}\u00A0`);
  //     const withNumbers = withWidows.replace(NUMBER_WORD_RE, "$1\u00A0");
  //     const next = withNumbers.replace(EM_DASH_RE, "—\u00A0");
  //     if (next !== value) {
  //       node.nodeValue = next;
  //     }
  //   });
  // }, []);

  return null;
}
