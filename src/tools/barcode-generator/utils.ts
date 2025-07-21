export function evaluateEscapes(input: string): string {
  return input
    .replace(/\\FNC1/g, String.fromCharCode(0x1D)) // optional alias
    .replace(/\\F/g, String.fromCharCode(0x1D))     // actual GS1 escape
    .replace(/\\F/g, '\u001d');
    .replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\u([0-9A-Fa-f]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\\\/g, '\\');
}
