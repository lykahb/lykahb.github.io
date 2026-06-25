# Nonius Clock Behavior and Test Plan

This note tracks development notes for the Nonius clock.

## Desired Behavior

- Time controls can represent full local date and time, not only time-of-day.
- Changing time through the datetime input, Current, Midnight, or Random controls should not produce animation glitches from live clock updates retargeting the ring mid-transition.
- The visible datetime in the input should remain accurate while an animation is in progress.
- The rotating ring is the only moving time indicator. Weekday display, when enabled, is a fixed scale read by the rotating ring's first marker.
- The rotating ring angle is derived from local civil seconds, including the local calendar date and time-of-day.
- The ring moves continuously as civil time progresses. It must not reset or wrap at midnight, week boundaries, month boundaries, year boundaries, or across distant dates.
- The ring should only jump when civil time itself jumps, such as daylight saving time or timezone changes.
- Weekday scale layout starts with Monday at the 12 o'clock boundary. In the Week rotation preset, each civil day advances by one seventh of a full rotation.
- Presets should keep their intended marker layout, rotation direction, minute labels, selected-state highlighting, and debug output.

## Test Plan

- Build and syntax:
  - Run `zola build`.
  - Run `node --check static/projects/nonius-clock/js/nonius-clock.js`.
  - Run `node --check docs/projects/nonius-clock/js/nonius-clock.js`.
  - Confirm `static/projects/nonius-clock/js/nonius-clock.js` and `docs/projects/nonius-clock/js/nonius-clock.js` match after build.

- Manual time changes:
  - Change seconds, minutes, hours, date, month, and year through the datetime input.
  - Change to dates far in the past and future, such as 1930 and 2050.
  - During each change, confirm the displayed datetime updates immediately and the ring animates to the chosen target without flicker or repeated retargeting.
  - Click Current, Midnight, and Random repeatedly, including while a previous ring animation is still running.

- Continuity boundaries:
  - Compare target angle deltas across ordinary adjacent days.
  - Verify Sunday to Monday changes by the same one-day angle as Monday to Tuesday.
  - Verify December 31 23:59:59 to January 1 00:00:00 changes by one second of rotation, not a reset.
  - Verify month-end and leap-day boundaries do not reset the angle.
  - Verify distant-date deltas are proportional to the civil-time delta.

- Weekday scale:
  - Enable the weekday scale and select Week rotation.
  - Confirm Monday starts at the 12 o'clock boundary.
  - Confirm the first rotating marker points to the correct weekday for Monday through Sunday.
  - Confirm each day advances by `360 / 7` degrees in Week rotation.

- Civil-time jumps:
  - Test a daylight saving transition in a timezone that observes DST.
  - Confirm the ring follows the displayed local civil time: it may jump at the missing or repeated civil hour, but it should not jump at unrelated day, week, or year boundaries.
