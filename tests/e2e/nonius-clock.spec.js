const { test, expect } = require("@playwright/test");

const CLOCK_PATH = "/projects/nonius-clock/";

async function installClockHook(page, { suppressTransitionEnd = false } = {}) {
    await page.addInitScript(({ suppressTransitionEnd }) => {
        window.__noniusSuppressTransitionEnd = suppressTransitionEnd;

        document.addEventListener("transitionend", event => {
            if (!window.__noniusSuppressTransitionEnd || event.target?.id !== "rotatingDial") {
                return;
            }
            event.stopImmediatePropagation();
            event.preventDefault();
        }, true);

        let petiteVueValue;
        Object.defineProperty(window, "PetiteVue", {
            configurable: true,
            get() {
                return petiteVueValue;
            },
            set(value) {
                if (value && typeof value.createApp === "function" && !value.__noniusClockWrapped) {
                    const originalCreateApp = value.createApp;
                    value.createApp = function(...args) {
                        window.__noniusClockApp = args[0];
                        return originalCreateApp.apply(this, args);
                    };
                    Object.defineProperty(value, "__noniusClockWrapped", { value: true });
                }
                petiteVueValue = value;
            },
        });
    }, { suppressTransitionEnd });
}

async function gotoClock(page, options = {}) {
    await installClockHook(page, options);
    await page.goto(CLOCK_PATH);
    await page.waitForSelector("#timeInput");
    await page.waitForFunction(() => window.__noniusClockApp && document.querySelector("#rotatingDial")?.getAttribute("transform"));
}

function pad(value) {
    return String(value).padStart(2, "0");
}

async function setDateTimeInput(page, value) {
    await page.locator("#timeInput").evaluate((input, nextValue) => {
        input.value = nextValue;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }, value);
}

async function incrementInputMinutes(page, minutes) {
    await page.locator("#timeInput").evaluate((input, minutesToAdd) => {
        const date = new Date(input.value);
        date.setMinutes(date.getMinutes() + minutesToAdd);
        input.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
            + `T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }, minutes);
}

async function appValue(page, callback) {
    return page.evaluate(callback);
}

async function expectCivilDelta(page, startArgs, endArgs, expectedSeconds) {
    const result = await page.evaluate(({ startArgs, endArgs }) => {
        const app = window.__noniusClockApp;
        const start = new Date(...startArgs);
        const end = new Date(...endArgs);
        return {
            civilDelta: app.civilSeconds(end) - app.civilSeconds(start),
            angleDelta: app.rotatingDialAngleDegreesForDate(end) - app.rotatingDialAngleDegreesForDate(start),
            degreesPerSecond: app.params.rotatingDialDegreesPerSecond,
        };
    }, { startArgs, endArgs });

    expect(result.civilDelta).toBeCloseTo(expectedSeconds, 9);
    expect(result.angleDelta).toBeCloseTo(expectedSeconds * result.degreesPerSecond, 9);
}

async function readAlignmentMetrics(page, timeInputValue, alignmentMode) {
    return page.evaluate(({ timeInputValue, alignmentMode }) => {
        const app = window.__noniusClockApp;
        app.params.alignmentMode = alignmentMode;
        app.manualTransitionTargetDate = null;
        app.setDisplayedDate(new Date(timeInputValue));

        const dialAngle = app.rotatingDialAngleDegreesForDate(app.time.date);
        const angleError = (fixedAngle, rotatingMarkerAngle) => {
            let difference = (fixedAngle - rotatingMarkerAngle) % 360;
            if (difference > 180) {
                difference -= 360;
            } else if (difference < -180) {
                difference += 360;
            }
            return Math.abs(difference);
        };
        const bestMinuteErrorForFixedAngle = fixedAngle => {
            let bestError = Infinity;
            for (let i = 0; i < app.params.numberOfMarksForMinutesOnRotatingDial; i++) {
                bestError = Math.min(bestError, angleError(
                    fixedAngle,
                    app.rotatingMinuteMarkerAngleDegrees(i) + dialAngle
                ));
            }
            return bestError;
        };
        const bestHourErrorForFixedAngle = fixedAngle => {
            let bestError = Infinity;
            for (let i = 0; i < app.params.numberOfMarksForHoursOnRotatingDial; i++) {
                bestError = Math.min(bestError, angleError(
                    fixedAngle,
                    app.rotatingHourMarkerAngleDegrees(i) + dialAngle
                ));
            }
            return bestError;
        };
        const currentMinute = app.time.minutes;
        const previousMinute = (currentMinute + 59) % 60;
        const nextMinute = (currentMinute + 1) % 60;
        const currentHour = app.time.hours % app.params.numberOfHours;
        const previousHour = (currentHour + app.params.numberOfHours - 1) % app.params.numberOfHours;
        const nextHour = (currentHour + 1) % app.params.numberOfHours;
        const currentMinuteFixedAngle = currentMinute * app.params.fixedMinuteMarkerStepDegrees;
        const currentHourFixedAngle = app.fixedHourMarkerAngleDegrees(currentHour);

        return {
            minuteCurrentHighlightedError: angleError(
                currentMinuteFixedAngle,
                app.rotatingMinuteMarkerAngleDegrees(app.alignedRotatingMinuteMarkerIndex) + dialAngle
            ),
            minuteCurrentBestError: bestMinuteErrorForFixedAngle(currentMinuteFixedAngle),
            minutePreviousBestError: bestMinuteErrorForFixedAngle(previousMinute * app.params.fixedMinuteMarkerStepDegrees),
            minuteNextBestError: bestMinuteErrorForFixedAngle(nextMinute * app.params.fixedMinuteMarkerStepDegrees),
            minuteHalfSweepDegrees: Math.abs(app.params.rotatingDialDegreesPerMinute) / 2,
            hourCurrentHighlightedError: angleError(
                currentHourFixedAngle,
                app.rotatingHourMarkerAngleDegrees(app.alignedRotatingHourMarkerIndex) + dialAngle
            ),
            hourCurrentBestError: bestHourErrorForFixedAngle(currentHourFixedAngle),
            hourPreviousBestError: bestHourErrorForFixedAngle(app.fixedHourMarkerAngleDegrees(previousHour)),
            hourNextBestError: bestHourErrorForFixedAngle(app.fixedHourMarkerAngleDegrees(nextHour)),
            hourHalfSweepDegrees: Math.abs(app.params.rotatingDialDegreesPerHour) / 2,
        };
    }, { timeInputValue, alignmentMode });
}

async function startMutationCapture(page) {
    await page.evaluate(() => {
        window.__noniusMutations = [];
        window.__noniusMutationObserver?.disconnect();
        window.__noniusMutationObserver = new MutationObserver(records => {
            window.__noniusMutations.push(...records.map(record => {
                const target = record.target;
                return {
                    attributeName: record.attributeName,
                    target: target.id || target.className?.baseVal || target.tagName,
                    type: record.type,
                };
            }));
        });
        window.__noniusMutationObserver.observe(document.querySelector("#clockAndControls"), {
            subtree: true,
            attributes: true,
            childList: true,
            characterData: true,
        });
    });
}

async function readAndClearMutations(page) {
    return page.evaluate(async () => {
        await new Promise(resolve => queueMicrotask(resolve));
        const mutations = window.__noniusMutations;
        window.__noniusMutations = [];
        return mutations;
    });
}

test("mounts clock and controls, and the clock angle changes after 1s", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-06-27T12:00:00") });
    await gotoClock(page);

    await expect(page.locator("#clock")).toBeVisible();
    await expect(page.locator("#controls")).toBeVisible();

    const initialAngle = await appValue(page, () => window.__noniusClockApp.rotatingDialAngleDegrees);
    await page.clock.runFor(1000);
    await expect.poll(() => appValue(page, () => window.__noniusClockApp.rotatingDialAngleDegrees)).not.toBe(initialAngle);
});

test("clock ticks keep DOM mutations bounded", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-06-27T12:00:10") });
    await gotoClock(page);
    await startMutationCapture(page);

    for (let i = 0; i < 3; i++) {
        await page.clock.runFor(1000);
        const mutations = await readAndClearMutations(page);
        expect(mutations).toHaveLength(1);
        expect(mutations).toEqual([
            { type: "attributes", attributeName: "transform", target: "rotatingDial" },
        ]);
    }

    await page.clock.pauseAt(new Date("2026-06-27T12:00:59"));
    await readAndClearMutations(page);
    await page.clock.runFor(1000);
    const minuteBoundaryMutations = await readAndClearMutations(page);
    expect(minuteBoundaryMutations.length).toBeLessThanOrEqual(3);
    expect(minuteBoundaryMutations).toEqual(expect.arrayContaining([
        { type: "attributes", attributeName: "transform", target: "rotatingDial" },
        { type: "attributes", attributeName: "transform", target: "fixedMinuteMarker isMarkerHighlighted" },
        { type: "attributes", attributeName: "transform", target: "rotatingMinuteMarker isMarkerHighlighted" },
    ]));

    await page.clock.pauseAt(new Date("2026-06-27T12:59:59"));
    await readAndClearMutations(page);
    await page.clock.runFor(1000);
    const hourBoundaryMutations = await readAndClearMutations(page);
    expect(hourBoundaryMutations.length).toBeLessThanOrEqual(5);
    expect(hourBoundaryMutations).toEqual(expect.arrayContaining([
        { type: "attributes", attributeName: "transform", target: "rotatingDial" },
        { type: "attributes", attributeName: "transform", target: "fixedMinuteMarker isMarkerHighlighted" },
        { type: "attributes", attributeName: "transform", target: "rotatingMinuteMarker isMarkerHighlighted" },
        { type: "attributes", attributeName: "transform", target: "fixedHourMarker isMarkerHighlighted" },
        { type: "attributes", attributeName: "transform", target: "rotatingHourMarker isMarkerHighlighted" },
    ]));
});

test("repeated minute edits change offset by exactly one minute", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-06-27T12:00:10") });
    await gotoClock(page);

    for (let i = 0; i < 5; i++) {
        await page.clock.runFor(1100);
        const beforeOffset = await appValue(page, () => window.__noniusClockApp.offsetSeconds);
        await incrementInputMinutes(page, 1);
        await expect.poll(async () => {
            const afterOffset = await appValue(page, () => window.__noniusClockApp.offsetSeconds);
            return afterOffset - beforeOffset;
        }).toBeCloseTo(60, 9);
    }
});

test("manual time transition target stays latched through the next clock tick", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-06-27T12:00:00") });
    await gotoClock(page, { suppressTransitionEnd: true });

    await page.clock.runFor(650);
    await setDateTimeInput(page, "2026-06-27T18:00:00");
    await expect.poll(() => appValue(page, () => !!window.__noniusClockApp.manualTransitionTargetDate)).toBe(true);

    const latchedTransform = await page.locator("#rotatingDial").getAttribute("transform");
    await page.clock.runFor(350);
    await expect.poll(() => appValue(page, () => window.__noniusClockApp.time.date.getSeconds())).toBe(1);
    await expect(page.locator("#rotatingDial")).toHaveAttribute("transform", latchedTransform);

    await page.evaluate(() => {
        window.__noniusSuppressTransitionEnd = false;
        const event = new TransitionEvent("transitionend", {
            bubbles: true,
            propertyName: "transform",
        });
        document.querySelector("#rotatingDial").dispatchEvent(event);
    });
    await expect.poll(() => appValue(page, () => window.__noniusClockApp.manualTransitionTargetDate)).toBe(null);
});

test("civil-time angle deltas stay continuous across calendar boundaries", async ({ page }) => {
    await gotoClock(page);

    await expectCivilDelta(page, [2025, 11, 31, 23, 59, 59], [2026, 0, 1, 0, 0, 0], 1);
    await expectCivilDelta(page, [2026, 0, 31, 23, 59, 59], [2026, 1, 1, 0, 0, 0], 1);
    await expectCivilDelta(page, [2024, 1, 28, 0, 0, 0], [2024, 2, 1, 0, 0, 0], 2 * 24 * 60 * 60);
    await expectCivilDelta(page, [2026, 5, 28, 0, 0, 0], [2026, 5, 29, 0, 0, 0], 24 * 60 * 60);
});

test.describe("DST civil-time behavior", () => {
    test.use({ timezoneId: "America/New_York" });

    test("uses displayed civil time on daylight-saving transition days", async ({ page }) => {
        await gotoClock(page);

        await expectCivilDelta(page, [2026, 2, 8, 0, 0, 0], [2026, 2, 8, 3, 0, 0], 3 * 60 * 60);
        await expectCivilDelta(page, [2026, 10, 1, 0, 0, 0], [2026, 10, 1, 3, 0, 0], 3 * 60 * 60);
    });
});

test("week rotation preset advances one seventh of a turn per civil day", async ({ page }) => {
    await gotoClock(page);

    await page.locator(".advanced-parameters > summary").click();
    await page.locator("#showWeekdayRing").check();
    await page.getByRole("button", { name: "Week rotation" }).click();

    await expect(page.locator("#weekdayScale")).toBeVisible();
    await expect(page.locator(".weekdayName")).toHaveCount(7);

    const result = await page.evaluate(() => {
        const app = window.__noniusClockApp;
        const monday = new Date(2026, 5, 22, 0, 0, 0);
        const tuesday = new Date(2026, 5, 23, 0, 0, 0);
        return {
            mondayBoundaryAngleDegrees: app.weekdayBoundaryAngleDegrees(0),
            weekdayDaySpanDegrees: app.weekdayDaySpanDegrees,
            angleDelta: app.rotationSpanDegreesForSeconds(app.civilSeconds(tuesday) - app.civilSeconds(monday)),
        };
    });

    expect(result.mondayBoundaryAngleDegrees).toBeCloseTo(0, 9);
    expect(result.weekdayDaySpanDegrees).toBeCloseTo(360 / 7, 9);
    expect(result.angleDelta).toBeCloseTo(360 / 7, 9);
});

test("week rotation keeps lower weekday labels upright", async ({ page }) => {
    await gotoClock(page);

    await page.locator(".advanced-parameters > summary").click();
    await page.locator("#showWeekdayRing").check();
    await page.getByRole("button", { name: "Week rotation" }).click();

    const result = await page.evaluate(() => {
        const arcSweepFlagPattern = / A[^ ]+,[^ ]+ 0 \d ([01]) /g;
        return {
            textGuides: Array.from(document.querySelectorAll(".weekdayTextGuide"), path => ({
                id: path.id,
                sweepFlags: Array.from(path.getAttribute("d").matchAll(arcSweepFlagPattern), match => match[1]),
            })),
            labels: Array.from(document.querySelectorAll(".weekdayName"), (text, index) => {
                const textPath = text.querySelector("textPath");
                const startOffset = textPath.startOffset?.baseVal?.valueAsString
                    || textPath.getAttribute("startOffset")
                    || textPath.getAttribute("startoffset");
                return {
                    day: text.textContent.trim(),
                    isLowerHalf: window.__noniusClockApp.isLowerHalfAngle(
                        window.__noniusClockApp.weekdayTextCenterAngleDegrees(index)
                    ),
                    href: textPath.getAttribute("href"),
                    startOffsetPercent: Number.parseFloat(startOffset),
                };
            }),
        };
    });

    expect(result.textGuides).toEqual([
        { id: "weekdayTextPathClockwise", sweepFlags: ["1", "1"] },
        { id: "weekdayTextPathCounterclockwise", sweepFlags: ["0", "0"] },
    ]);
    expect(result.labels.map(({ day, isLowerHalf, href }) => ({ day, isLowerHalf, href }))).toEqual([
        { day: "Monday", isLowerHalf: false, href: "#weekdayTextPathClockwise" },
        { day: "Tuesday", isLowerHalf: false, href: "#weekdayTextPathClockwise" },
        { day: "Wednesday", isLowerHalf: true, href: "#weekdayTextPathCounterclockwise" },
        { day: "Thursday", isLowerHalf: true, href: "#weekdayTextPathCounterclockwise" },
        { day: "Friday", isLowerHalf: true, href: "#weekdayTextPathCounterclockwise" },
        { day: "Saturday", isLowerHalf: false, href: "#weekdayTextPathClockwise" },
        { day: "Sunday", isLowerHalf: false, href: "#weekdayTextPathClockwise" },
    ]);
    [
        100 / 14,
        300 / 14,
        900 / 14,
        50,
        500 / 14,
        1100 / 14,
        1300 / 14,
    ].forEach((expectedStartOffsetPercent, index) => {
        expect(result.labels[index].startOffsetPercent).toBeCloseTo(expectedStartOffsetPercent, 4);
    });
});

test("current-best alignment mode makes the current interval most aligned at midpoint", async ({ page }) => {
    await gotoClock(page);

    const startExactMinuteStart = await readAlignmentMetrics(page, "2026-06-27T12:17:00", "startExact");
    expect(startExactMinuteStart.minuteCurrentHighlightedError).toBeCloseTo(0, 9);

    const currentBestMinuteStart = await readAlignmentMetrics(page, "2026-06-27T12:17:00", "currentBest");
    expect(currentBestMinuteStart.minuteCurrentHighlightedError).toBeCloseTo(currentBestMinuteStart.minuteHalfSweepDegrees, 9);

    const currentBestMinuteMidpoint = await readAlignmentMetrics(page, "2026-06-27T12:17:30", "currentBest");
    expect(currentBestMinuteMidpoint.minuteCurrentHighlightedError).toBeCloseTo(0, 9);

    const currentBestMinuteSecondHalf = await readAlignmentMetrics(page, "2026-06-27T12:17:45", "currentBest");
    expect(currentBestMinuteSecondHalf.minuteCurrentBestError).toBeLessThan(currentBestMinuteSecondHalf.minutePreviousBestError);
    expect(currentBestMinuteSecondHalf.minuteCurrentBestError).toBeLessThan(currentBestMinuteSecondHalf.minuteNextBestError);

    const startExactHourStart = await readAlignmentMetrics(page, "2026-06-27T12:00:00", "startExact");
    expect(startExactHourStart.hourCurrentHighlightedError).toBeCloseTo(0, 9);

    const currentBestHourStart = await readAlignmentMetrics(page, "2026-06-27T12:00:00", "currentBest");
    expect(currentBestHourStart.hourCurrentHighlightedError).toBeCloseTo(currentBestHourStart.hourHalfSweepDegrees, 9);

    const currentBestHourMidpoint = await readAlignmentMetrics(page, "2026-06-27T12:30:00", "currentBest");
    expect(currentBestHourMidpoint.hourCurrentHighlightedError).toBeCloseTo(0, 9);

    const currentBestHourSecondHalf = await readAlignmentMetrics(page, "2026-06-27T12:45:00", "currentBest");
    expect(currentBestHourSecondHalf.hourCurrentBestError).toBeLessThan(currentBestHourSecondHalf.hourPreviousBestError);
    expect(currentBestHourSecondHalf.hourCurrentBestError).toBeLessThan(currentBestHourSecondHalf.hourNextBestError);
});

test("alignment mode is independent from presets and keeps weekday pointer at ring zero", async ({ page }) => {
    await gotoClock(page);

    await page.locator(".advanced-parameters > summary").click();
    await page.getByLabel("current best").check();
    await page.getByRole("button", { name: "Week rotation" }).click();
    await page.locator("#showWeekdayRing").check();

    await expect.poll(() => appValue(page, () => window.__noniusClockApp.params.alignmentMode)).toBe("currentBest");
    await expect(page.locator(".isWeekdayPointer")).toHaveCount(1);
    await expect(page.locator(".isWeekdayPointer")).toHaveAttribute("transform", "rotate(0 200 200)");

    const result = await page.evaluate(() => {
        const app = window.__noniusClockApp;
        const monday = new Date(2026, 5, 22, 0, 0, 0);
        const tuesday = new Date(2026, 5, 23, 0, 0, 0);
        return {
            mondayBoundaryAngleDegrees: app.weekdayBoundaryAngleDegrees(0),
            weekdayDaySpanDegrees: app.weekdayDaySpanDegrees,
            angleDelta: app.rotationSpanDegreesForSeconds(app.civilSeconds(tuesday) - app.civilSeconds(monday)),
        };
    });

    expect(result.mondayBoundaryAngleDegrees).toBeCloseTo(0, 9);
    expect(result.weekdayDaySpanDegrees).toBeCloseTo(360 / 7, 9);
    expect(result.angleDelta).toBeCloseTo(360 / 7, 9);
});

test("distant dates keep the rotating dial transform bounded", async ({ page }) => {
    await gotoClock(page);

    await setDateTimeInput(page, "2050-12-31T23:59:59");
    const transform = await page.locator("#rotatingDial").getAttribute("transform");

    expect(transform).toMatch(/^matrix\(/);
    expect(transform).not.toContain("rotate(");

    const values = transform.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi).map(Number);
    expect(values.every(Number.isFinite)).toBe(true);
    expect(Math.max(...values.map(Math.abs))).toBeLessThanOrEqual(1.000001);
});

test("alignment highlights can be disabled", async ({ page }) => {
    await gotoClock(page);
    await setDateTimeInput(page, `2026-06-27T05:17:${pad(23)}`);

    await expect(page.locator(".fixedMinuteMarker.isMarkerHighlighted")).toHaveCount(1);
    await expect(page.locator(".rotatingMinuteMarker.isMarkerHighlighted")).toHaveCount(1);
    await expect(page.locator(".fixedHourMarker.isMarkerHighlighted")).toHaveCount(1);
    await expect(page.locator(".rotatingHourMarker.isMarkerHighlighted")).toHaveCount(1);

    await page.locator(".advanced-parameters > summary").click();
    await page.locator("#highlightAlignedMarkers").uncheck();
    await expect(page.locator(".isMarkerHighlighted")).toHaveCount(0);
});

test("invalid numeric controls keep the previous clock state", async ({ page }) => {
    const consoleErrors = [];
    page.on("console", message => {
        if (message.type() === "error") {
            consoleErrors.push(message.text());
        }
    });

    await gotoClock(page);
    await page.locator(".advanced-parameters > summary").click();

    const cases = [
        {
            selector: "#numberOfMarksForHoursOnRotatingDial",
            invalidValue: "61",
            validValue: "8",
            readState: () => window.__noniusClockApp.params.numberOfMarksForHoursOnRotatingDial,
        },
        {
            selector: "#spacingMultipleForFixedHourMarks",
            invalidValue: "1.5",
            validValue: "3",
            readState: () => window.__noniusClockApp.params.spacingMultipleForFixedHourMarks,
        },
        {
            selector: "#spacingMultipleForFixedMinuteMarks",
            invalidValue: "0",
            validValue: "2",
            readState: () => window.__noniusClockApp.params.spacingMultipleForFixedMinuteMarks,
        },
        {
            selector: "#minuteLabelEvery",
            invalidValue: "61",
            validValue: "10",
            readState: () => window.__noniusClockApp.visuals.minuteLabelEvery,
        },
        {
            selector: "#minuteMarkerThicknessFactor",
            invalidValue: "10.2",
            validValue: "2.5",
            readState: () => window.__noniusClockApp.visuals.minuteMarkerThicknessFactor,
        },
    ];

    for (const testCase of cases) {
        const input = page.locator(testCase.selector);
        await input.fill(testCase.validValue);
        await expect.poll(() => appValue(page, testCase.readState)).toBe(Number(testCase.validValue));

        const previousValue = await appValue(page, testCase.readState);
        await input.fill(testCase.invalidValue);

        await expect(input).toHaveJSProperty("validity.valid", false);
        await expect.poll(() => appValue(page, testCase.readState)).toBe(previousValue);

        const invalidStyle = await input.evaluate(element => {
            const style = getComputedStyle(element);
            return {
                backgroundColor: style.backgroundColor,
                borderColor: style.borderColor,
            };
        });
        expect(invalidStyle.backgroundColor).toBe("rgb(255, 244, 242)");
        expect(invalidStyle.borderColor).toBe("rgb(184, 74, 66)");

        const transform = await page.locator("#rotatingDial").getAttribute("transform");
        expect(transform).not.toContain("NaN");

        await input.fill("");
        await expect(input).toHaveJSProperty("validity.valid", false);
        await expect.poll(() => appValue(page, testCase.readState)).toBe(previousValue);
    }

    expect(consoleErrors).toEqual([]);
});
