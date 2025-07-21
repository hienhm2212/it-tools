export function evaluateEscapes(input: string): string {
  return input
    .replace(/\\FNC1/g, '\u001D')    // full token
    .replace(/\\F/g, '\u001D')       // shorthand FNC1
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}
