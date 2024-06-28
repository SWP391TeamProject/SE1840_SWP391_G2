function isJavaWhitespace(char: string): boolean {
  const code = char.charCodeAt(0);
  return (
    (code === 0x09) ||  // '\t' U+0009 HORIZONTAL TABULATION
    (code === 0x0A) ||  // '\n' U+000A LINE FEED
    (code === 0x0B) ||  // '\u000B' U+000B VERTICAL TABULATION
    (code === 0x0C) ||  // '\f' U+000C FORM FEED
    (code === 0x0D) ||  // '\r' U+000D CARRIAGE RETURN
    (code === 0x1C) ||  // '\u001C' U+001C FILE SEPARATOR
    (code === 0x1D) ||  // '\u001D' U+001D GROUP SEPARATOR
    (code === 0x1E) ||  // '\u001E' U+001E RECORD SEPARATOR
    (code === 0x1F) ||  // '\u001F' U+001F UNIT SEPARATOR
    (code === 0x0020 && char !== '\u00A0' && char !== '\u2007' && char !== '\u202F') || // SPACE_SEPARATOR (excluding non-breaking spaces)
    (char === '\u2028') || // LINE_SEPARATOR
    (char === '\u2029')    // PARAGRAPH_SEPARATOR
  );
}

export function containsWhitespace(value: string): boolean {
  for (let i = 0; i < value.length; i++) {
    if (isJavaWhitespace(value[i])) {
      return true;
    }
  }
  return false;
}
