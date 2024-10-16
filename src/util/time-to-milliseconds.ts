export function timeToMilliseconds(time: string) {
  const timeUnits: { [key: string]: number } = {
    d: 24 * 60 * 60 * 1000, // Days to milliseconds
    h: 60 * 60 * 1000, // Hours to milliseconds
    m: 60 * 1000, // Minutes to milliseconds
    s: 1000, // Seconds to milliseconds
  };

  const segments = time.split(" ");
  let totalMilliseconds = 0;

  for (const segment of segments) {
    const timeValue = parseInt(segment.slice(0, -1), 10);
    const timeUnit = segment.slice(-1);

    if (timeUnits[timeUnit]) {
      totalMilliseconds += timeValue * timeUnits[timeUnit];
    } else {
      throw new Error(`Invalid time format: ${segment}`);
    }
  }

  return totalMilliseconds;
}
