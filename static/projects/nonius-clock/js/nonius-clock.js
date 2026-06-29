// Angle naming conventions:
// - AngleDegrees: signed angular position in SVG's clockwise-positive degrees.
// - SpanDegrees: unsigned angular size of one object or interval.
// - SpacingDegrees: unsigned angular distance between repeated objects.
// - StepDegrees: signed angular increment used to place repeated objects.
// - DegreesPerSecond/Minute: signed angular velocity.
// - Direction: sign only, not an angle.

// Rotation model:
// - The clock has one physical moving part: the rotating ring.
// - Its angle is civil seconds multiplied by the angular velocity below.
// - Whole-day offsets do not disturb the minute/hour readings because they
//   rotate the ring by 24 rotating-minute-marker steps. With 12h and 24h
//   dials, the hour-marker set also lands on itself after each day.
// - The weekday scale is therefore just a fixed scale read by marker zero;
//   it must never choose a separate ring angle.
// - Civil time jumps, such as daylight saving transitions, can still jump
//   the ring because the displayed civil time jumps too.

const SECONDS_PER_DAY = 24 * 60 * 60;
const DAYS_FROM_CIVIL_ZERO_TO_MONDAY = 4;
const PHI = 1.61803398875; // golden ratio
const MARKER_OVERSHOOT = 4;

const WEEKDAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
];

const PARAM_PRESETS = {
    chaoticHours: {
        numberOfMarksForHoursOnRotatingDial: 5,
        isRotatingClockwise: false,
        areFixedHoursShorter: false,
        areFixedMinutesShorter: true,
        minuteLabelEvery: 5,
        minuteLabel59: true
    },
    chaoticMinutes: {
        numberOfMarksForHoursOnRotatingDial: 1,
        isRotatingClockwise: true,
        areFixedHoursShorter: false,
        areFixedMinutesShorter: false,
        minuteLabelEvery: 1,
        minuteLabel59: false
    },
    chaoticHoursMinuteGap: {
        numberOfMarksForHoursOnRotatingDial: 6,
        isRotatingClockwise: true,
        areFixedHoursShorter: true,
        areFixedMinutesShorter: false,
        minuteLabelEvery: 5,
        minuteLabel59: true
    },
    oneWeekRotation: {
        numberOfMarksForHoursOnRotatingDial: 14,
        isRotatingClockwise: true,
        areFixedHoursShorter: false,
        areFixedMinutesShorter: false,
        minuteLabelEvery: 5,
        minuteLabel59: true
    }
};

function startOfMinute(date) {
    const dateAtMinuteStart = new Date(date);
    dateAtMinuteStart.setSeconds(0, 0);
    return dateAtMinuteStart;
}

function startOfHour(date) {
    const dateAtHourStart = new Date(date);
    dateAtHourStart.setMinutes(0, 0, 0);
    return dateAtHourStart;
}

function startOfDay(date) {
    const dateAtDayStart = new Date(date);
    dateAtDayStart.setHours(0, 0, 0, 0);
    return dateAtDayStart;
}

function formatDateTimeInputValue(date) {
    const pad = value => String(value).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
        + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function fixedMarkerStepDegrees(spacingMultiple, baseSpacingDegrees, alignmentSpacingDegrees, isShorter, isRotatingClockwise) {
    const fixedMarkerSpacingDegrees = spacingMultiple * baseSpacingDegrees
        + (isShorter ? -alignmentSpacingDegrees : alignmentSpacingDegrees);
    const direction = isRotatingClockwise ? 1 : -1;
    return direction * (isShorter ? -fixedMarkerSpacingDegrees : fixedMarkerSpacingDegrees);
}

function calculateDeltaSeconds(date1, date2) {
    return (date1.getTime() - date2.getTime()) / 1000;
}

function civilSecondsWithinDay(date) {
    return date.getHours() * 60 * 60
        + date.getMinutes() * 60
        + date.getSeconds()
        + date.getMilliseconds() / 1000;
}

function localCivilDayUtcMs(date) {
    // Date.UTC gives a stable serial number for the local calendar day.
    // It deliberately ignores timezone offsets, so every civil date is
    // exactly one nominal 24h day after the previous civil date.
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function civilSeconds(date) {
    // localCivilDayUtcMs() has day zero on 1970-01-01, which was Thursday.
    // Subtract four nominal days so the weekly phase starts on Monday,
    // matching the weekday scale's Monday-at-12-o'clock layout.
    return localCivilDayUtcMs(date) / 1000
        - DAYS_FROM_CIVIL_ZERO_TO_MONDAY * SECONDS_PER_DAY
        + civilSecondsWithinDay(date);
}

function normalizedDegrees(angleDegrees) {
    return ((angleDegrees % 360) + 360) % 360;
}

function rotationTransform(angleDegrees) {
    // Keep the logical angle unbounded and civil-time based, but do not
    // pass huge values such as rotate(-2970144.3) to the browser. When
    // CSS transitions are applied to SVG's transform presentation
    // attribute, Chromium has produced visibly imprecise matrices for
    // those large rotate() values. Computing the small equivalent matrix
    // here preserves marker alignment.
    //
    // This does not reintroduce the old week-boundary discontinuity:
    // rotatingDialAngleDegrees still advances continuously from
    // civilSeconds(). Only the final drawing transform is reduced modulo
    // one turn, and a rotation matrix has no 359deg -> 0deg jump for CSS
    // to animate across.
    const angleRadians = (angleDegrees % 360) * Math.PI / 180;
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);
    return `matrix(${cos} ${sin} ${-sin} ${cos} 0 0)`;
}

function rotatingMarkerIndexAlignedWithFixedAngle(
    fixedMarkerAngleDegrees,
    rotatingMarkerSpacingDegrees,
    markerCount,
    rotatingDialAngleDegrees,
    rotatingMarkerPhaseDegrees
) {
    const markerIndex = Math.round(
        (fixedMarkerAngleDegrees - rotatingDialAngleDegrees - rotatingMarkerPhaseDegrees) / rotatingMarkerSpacingDegrees
    );
    return ((markerIndex % markerCount) + markerCount) % markerCount;
}

function createClockApp() {
    const initialDate = new Date();

    return PetiteVue.createApp({
        // Reactive state.
        params: {
            numberOfMarksForHoursOnRotatingDial: 5,
            isRotatingClockwise: true,
            areFixedMinutesShorter: true,
            areFixedHoursShorter: true,
            numberOfHours: 12,
            spacingMultipleForFixedHourMarks: 1,
            spacingMultipleForFixedMinuteMarks: 1,
            alignmentMode: "startExact",

            get numberOfMarksForMinutesOnRotatingDial() {
                return this.numberOfMarksForHoursOnRotatingDial * this.numberOfHours;
            },
            get rotatingMinuteMarkerSpacingDegrees() {
                return 360 / this.numberOfMarksForMinutesOnRotatingDial;
            },
            get rotatingHourMarkerSpacingDegrees() {
                return 360 / this.numberOfMarksForHoursOnRotatingDial;
            },
            // Signed step between fixed hour marks. The placement helper below
            // wraps non-12 hour marks backward from 12 so the larger gap lands between 12 and 1.
            get fixedHourMarkerStepDegrees() {
                // Each hour the next minute mark aligns.
                return fixedMarkerStepDegrees(this.spacingMultipleForFixedHourMarks,
                    this.rotatingHourMarkerSpacingDegrees, this.rotatingMinuteMarkerSpacingDegrees,
                    this.areFixedHoursShorter, this.isRotatingClockwise);
            },
            get fixedMinuteMarkerStepDegrees() {
                return fixedMarkerStepDegrees(this.spacingMultipleForFixedMinuteMarks,
                    this.rotatingMinuteMarkerSpacingDegrees, Math.abs(this.rotatingDialDegreesPerMinute),
                    this.areFixedMinutesShorter, this.isRotatingClockwise);
            },
            get rotatingDialDegreesPerMinute() {
                const rotatingDialDegreesPerMinuteMagnitude = this.rotatingMinuteMarkerSpacingDegrees / 60;
                return this.isRotatingClockwise ? rotatingDialDegreesPerMinuteMagnitude : -rotatingDialDegreesPerMinuteMagnitude;
            },
            get rotatingDialDegreesPerHour() {
                return this.rotatingDialDegreesPerMinute * 60;
            },
            get rotatingDialDegreesPerSecond() {
                return this.rotatingDialDegreesPerMinute / 60;
            }
        },

        visuals: {
            viewPortSize: 400,
            radiusOfOuterDial: 198,
            minuteLabelEvery: 5,
            minuteLabel59: false,
            minuteMarkerThicknessFactor: 10,
            highlightAlignedMarkers: true,
            showWeekdayRing: false,

            get radiusOfInnerFixedDial() {
                return this.radiusOfOuterDial * (1 - 1 / PHI);
            },
            get radiusOfRotatingDial() {
                return this.radiusOfInnerFixedDial + (this.radiusOfOuterDial - this.radiusOfInnerFixedDial) / PHI;
            },
            get fixedMinuteMarkerLength() {
                return this.radiusOfOuterDial - this.radiusOfRotatingDial;
            },
            get rotatingMinuteMarkerLength() {
                return this.radiusOfRotatingDial - this.radiusOfInnerFixedDial;
            },
            get weekdayTextRadius() {
                return (this.radiusOfRotatingDial + this.radiusOfOuterDial) / 2;
            }
        },

        time: {
            date: initialDate,
            dateAtMinuteStart: startOfMinute(initialDate),
            dateAtHourStart: startOfHour(initialDate),

            get hours() {
                return this.dateAtHourStart.getHours();
            },
            get minutes() {
                return this.dateAtMinuteStart.getMinutes();
            }
        },

        // This enables displaying time other than current.
        // The value is +- period of full rotation.
        offsetSeconds: 0,
        selectedTimeOption: "current",
        manualTransitionTargetDate: null,

        // Computed properties.
        get centerCoordX() {
            return this.visuals.viewPortSize / 2;
        },
        get centerCoordY() {
            return this.visuals.viewPortSize / 2;
        },
        get timeInputValue() {
            return formatDateTimeInputValue(this.time.date);
        },
        set timeInputValue(value) {
            if (!value) {
                return;
            }
            const date = new Date(value);
            if (Number.isNaN(date.getTime())) {
                return;
            }
            this.runManualTimeChange(() => {
                const previousDate = this.time.date;
                date.setMilliseconds(previousDate.getMilliseconds());
                // The input edit preserves displayed seconds; keep milliseconds aligned too.
                // Recomputing the offset from wall-clock now would subtract time passed between edits,
                // so a minute edit could add 59s or 61s instead of exactly 60s.
                this.offsetSeconds += calculateDeltaSeconds(date, previousDate);
                this.selectedTimeOption = null;
                this.setDisplayedDate(date);
            });
        },
        get alignedRotatingMinuteMarkerIndex() {
            return rotatingMarkerIndexAlignedWithFixedAngle(
                this.time.minutes * this.params.fixedMinuteMarkerStepDegrees,
                this.params.rotatingMinuteMarkerSpacingDegrees,
                this.params.numberOfMarksForMinutesOnRotatingDial,
                this.rotatingDialAngleDegreesForDate(this.time.dateAtMinuteStart),
                this.rotatingMinuteMarkerPhaseDegrees
            );
        },
        get alignedRotatingHourMarkerIndex() {
            return rotatingMarkerIndexAlignedWithFixedAngle(
                this.fixedHourMarkerAngleDegrees(this.time.hours % this.params.numberOfHours),
                this.params.rotatingHourMarkerSpacingDegrees,
                this.params.numberOfMarksForHoursOnRotatingDial,
                this.rotatingDialAngleDegreesForDate(this.time.dateAtHourStart),
                this.rotatingHourMarkerPhaseDegrees
            );
        },
        get isCurrentBestAlignment() {
            return this.params.alignmentMode === "currentBest";
        },
        get rotatingMinuteMarkerPhaseDegrees() {
            return this.isCurrentBestAlignment ? -this.params.rotatingDialDegreesPerMinute / 2 : 0;
        },
        get rotatingHourMarkerPhaseDegrees() {
            return this.isCurrentBestAlignment ? -this.params.rotatingDialDegreesPerHour / 2 : 0;
        },
        get selectedParamPreset() {
            return Object.keys(PARAM_PRESETS).find(option => this.paramPresetMatches(option)) || null;
        },
        get rotatingDialAngleDegrees() {
            const date = this.manualTransitionTargetDate || this.time.date;
            return this.rotatingDialAngleDegreesForDate(date);
        },
        // One weekday spans exactly the angle swept by the rotating ring over 24h.
        // For the Week Rotation preset this is 360 / 7 degrees.
        get weekdayDaySpanDegrees() {
            return this.rotationSpanDegreesForSeconds(SECONDS_PER_DAY);
        },
        // Match the fixed weekday scale to the ring rotation direction so day boundaries
        // progress under the weekday pointer as the single rotating ring turns.
        get weekdayScaleDirection() {
            return Math.sign(this.params.rotatingDialDegreesPerSecond) || 1;
        },

        // Pure helpers exposed for test access.
        civilSeconds,
        rotationDegreesForSeconds(seconds) {
            return seconds * this.params.rotatingDialDegreesPerSecond;
        },
        rotationSpanDegreesForSeconds(seconds) {
            return Math.abs(this.rotationDegreesForSeconds(seconds));
        },
        rotatingDialAngleDegreesForDate(date) {
            return this.rotationDegreesForSeconds(civilSeconds(date));
        },

        // State-changing actions.
        setDisplayedDate(date) {
            const displayedDate = new Date(date);
            const dateAtMinuteStart = startOfMinute(displayedDate);
            const dateAtHourStart = startOfHour(displayedDate);

            this.time.date = displayedDate;
            // Keep minute/hour-cadence dependents from invalidating on every second tick.
            // A new Date object with the same timestamp is still a reactive assignment.
            if (this.time.dateAtMinuteStart.getTime() !== dateAtMinuteStart.getTime()) {
                this.time.dateAtMinuteStart = dateAtMinuteStart;
            }
            if (this.time.dateAtHourStart.getTime() !== dateAtHourStart.getTime()) {
                this.time.dateAtHourStart = dateAtHourStart;
            }
        },
        updateClock() {
            this.setDisplayedDate(new Date(Date.now() + this.offsetSeconds * 1000));
        },
        setNumberInputValue(event, target, key) {
            const input = event.target;
            if (input.validity.valid) {
                target[key] = input.valueAsNumber;
            }
        },
        useCurrentTime() {
            this.runManualTimeChange(() => {
                this.selectedTimeOption = "current";
                this.offsetSeconds = 0;
                this.updateClock();
            });
        },
        setMidnight() {
            this.runManualTimeChange(() => {
                this.selectedTimeOption = "midnight";
                const now = new Date();
                const midnight = startOfDay(now);
                this.offsetSeconds = calculateDeltaSeconds(midnight, now);
                this.setDisplayedDate(midnight);
            });
        },
        setRandomTime() {
            this.runManualTimeChange(() => {
                this.selectedTimeOption = "random";
                const rotationPeriodSeconds = 360 / this.params.rotatingDialDegreesPerSecond;
                this.offsetSeconds = Math.floor(Math.random() * rotationPeriodSeconds);
                this.updateClock();
            });
        },
        setParams(option) {
            const preset = PARAM_PRESETS[option];
            if (!preset) {
                throw new Error(`Unknown parameter preset: ${option}`);
            }
            this.params.numberOfMarksForHoursOnRotatingDial = preset.numberOfMarksForHoursOnRotatingDial;
            this.params.isRotatingClockwise = preset.isRotatingClockwise;
            this.params.areFixedHoursShorter = preset.areFixedHoursShorter;
            this.params.areFixedMinutesShorter = preset.areFixedMinutesShorter;
            this.visuals.minuteLabelEvery = preset.minuteLabelEvery;
            this.visuals.minuteLabel59 = preset.minuteLabel59;
        },
        isSelectedParamPreset(option) {
            return this.selectedParamPreset === option;
        },
        paramPresetMatches(option) {
            const preset = PARAM_PRESETS[option];
            return !!preset
                && this.params.numberOfMarksForHoursOnRotatingDial === preset.numberOfMarksForHoursOnRotatingDial
                && this.params.isRotatingClockwise === preset.isRotatingClockwise
                && this.params.areFixedHoursShorter === preset.areFixedHoursShorter
                && this.params.areFixedMinutesShorter === preset.areFixedMinutesShorter
                && this.visuals.minuteLabelEvery === preset.minuteLabelEvery
                && this.visuals.minuteLabel59 === preset.minuteLabel59;
        },
        runManualTimeChange(changeTime) {
            // CSS transform easing restarts on every target change. Latch the user-chosen
            // ring target during the transition so live clock ticks keep the digital time
            // accurate without retargeting the ring mid-animation.
            const previousAngle = this.rotatingDialAngleDegrees;
            changeTime();
            const targetDate = new Date(this.time.date);
            const targetAngle = this.rotatingDialAngleDegreesForDate(targetDate);
            if (this.manualTransitionTargetDate || Math.abs(targetAngle - previousAngle) > 1e-9) {
                this.manualTransitionTargetDate = targetDate;
            }
        },
        finishRotatingDialTransition(event) {
            if ((event.currentTarget && event.target && event.currentTarget !== event.target)
                || event.propertyName !== "transform"
                || !this.manualTransitionTargetDate) {
                return;
            }
            this.manualTransitionTargetDate = null;
        },

        // SVG rendering helpers.
        markerPath(innerRadius, outerRadius, markerSpanDegrees, closePath) {
            // Marker is shaped like a trapeze. It overshoots its radial endpoints and is clipped to its ring.
            const markerSpanRadians = markerSpanDegrees * Math.PI / 180;
            const halfMarkerSpanRadians = markerSpanRadians / 2;
            const radialDirection = Math.sign(outerRadius - innerRadius) || 1;
            const adjustedInnerRadius = innerRadius - radialDirection * MARKER_OVERSHOOT;
            const adjustedOuterRadius = outerRadius + radialDirection * MARKER_OVERSHOOT;
            const innerHorizontalOffset = adjustedInnerRadius * Math.sin(halfMarkerSpanRadians);
            const innerVerticalOffset = adjustedInnerRadius * Math.cos(halfMarkerSpanRadians);
            const outerHorizontalOffset = adjustedOuterRadius * Math.sin(halfMarkerSpanRadians);
            const outerVerticalOffset = adjustedOuterRadius * Math.cos(halfMarkerSpanRadians);
            return `M${this.centerCoordX - innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                L${this.centerCoordX - outerHorizontalOffset},${this.centerCoordY - outerVerticalOffset}
                l${2 * outerHorizontalOffset},0
                L${this.centerCoordX + innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                ${closePath ? "z" : ""}`;
        },
        ringClipPath(innerRadius, outerRadius) {
            const RING_CLIP_BLEED = 0.1;  // A tiny overlap prevents blank pixels from antialising
            const inner = Math.max(0, Math.min(innerRadius, outerRadius) - RING_CLIP_BLEED);
            const outer = Math.max(innerRadius, outerRadius) + RING_CLIP_BLEED;
            if (inner === 0) {
                return this.circlePath(outer, 1);
            }
            return `${this.circlePath(outer, 1)} ${this.circlePath(inner, 0)}`;
        },
        circlePath(radius, sweepFlag) {
            return `M${this.centerCoordX},${this.centerCoordY - radius}
                A${radius},${radius} 0 1 ${sweepFlag} ${this.centerCoordX},${this.centerCoordY + radius}
                A${radius},${radius} 0 1 ${sweepFlag} ${this.centerCoordX},${this.centerCoordY - radius}`;
        },
        pointOnCircle(radius, angleDegrees) {
            const pointAngleRadians = angleDegrees * Math.PI / 180;
            return {
                x: this.centerCoordX + radius * Math.sin(pointAngleRadians),
                y: this.centerCoordY - radius * Math.cos(pointAngleRadians)
            };
        },
        weekdayTextCenterAngleDegrees(dayIndex) {
            return this.weekdayBoundaryAngleDegrees(dayIndex)
                + this.weekdayScaleDirection * this.weekdayDaySpanDegrees / 2;
        },
        weekdayTextPathHref(dayIndex) {
            return this.isLowerHalfAngle(this.weekdayTextCenterAngleDegrees(dayIndex))
                ? "#weekdayTextPathCounterclockwise"
                : "#weekdayTextPathClockwise";
        },
        weekdayTextStartOffset(dayIndex) {
            const textCenterAngleDegrees = normalizedDegrees(this.weekdayTextCenterAngleDegrees(dayIndex));
            const pathAngleDegrees = this.isLowerHalfAngle(textCenterAngleDegrees)
                ? 360 - textCenterAngleDegrees
                : textCenterAngleDegrees;
            return `${pathAngleDegrees / 360 * 100}%`;
        },
        weekdayTextLength() {
            return this.visuals.weekdayTextRadius * this.weekdayDaySpanDegrees * Math.PI / 180;
        },
        isLowerHalfAngle(angleDegrees) {
            const normalizedAngleDegrees = normalizedDegrees(angleDegrees);
            return normalizedAngleDegrees > 90 && normalizedAngleDegrees < 270;
        },
        weekdayBoundaryAngleDegrees(dayIndex) {
            return this.weekdayScaleDirection * dayIndex * this.weekdayDaySpanDegrees;
        },
        fixedHourMarkerAngleDegrees(hourIndex) {
            if (hourIndex === 0) {
                return 0;
            }
            return (hourIndex - this.params.numberOfHours) * this.params.fixedHourMarkerStepDegrees;
        },
        rotatingMinuteMarkerAngleDegrees(markerIndex) {
            return markerIndex * this.params.rotatingMinuteMarkerSpacingDegrees + this.rotatingMinuteMarkerPhaseDegrees;
        },
        rotatingHourMarkerAngleDegrees(markerIndex) {
            return markerIndex * this.params.rotatingHourMarkerSpacingDegrees + this.rotatingHourMarkerPhaseDegrees;
        },

        // Lifecycle.
        setupUpdate() {
            this.setParams("chaoticHours");
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
        }
    });
}
