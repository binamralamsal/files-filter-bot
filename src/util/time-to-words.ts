export function timeToWords(time: string) {
  const timeUnits: { [key: string]: { singular: string; plural: string } } = {
    d: { singular: "Day", plural: "Days" },
    h: { singular: "Hour", plural: "Hours" },
    m: { singular: "Minute", plural: "Minutes" },
    s: { singular: "Second", plural: "Seconds" },
  };

  const segments = time.split(" ");
  const parts = [];

  for (const segment of segments) {
    const timeValue = parseInt(segment.slice(0, -1), 10);
    const timeUnit = segment.slice(-1);

    if (timeUnits[timeUnit]) {
      const { singular, plural } = timeUnits[timeUnit];
      const word = timeValue === 1 ? singular : plural;
      parts.push(`${timeValue} ${word}`);
    } else {
      throw new Error(`Invalid time format: ${segment}`);
    }
  }

  return parts.join(", ");
}
