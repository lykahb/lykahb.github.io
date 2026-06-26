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

function createClockApp() {
    const initialDate = new Date();

    return PetiteVue.createApp({
        params: {
            get numberOfMarksForMinutesOnRotatingDial() {
                return this.numberOfMarksForHoursOnRotatingDial * this.numberOfHours;
            },
            numberOfMarksForHoursOnRotatingDial: 5,
            isRotatingClockwise: true,
            areFixedMinutesShorter: true,
            areFixedHoursShorter: true,
            isGMT: false,
            numberOfHours: 12,
            spacingMultipleForFixedHourMarks: 1,
            spacingMultipleForFixedMinuteMarks: 1,
            validateSpacingMultiple(value, paramName) {
                if (!Number.isInteger(value) || value < 1) {
                    throw new Error(`${paramName} must be an integer greater than or equal to 1`);
                }
                return value;
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
                const spacingMultiple = this.validateSpacingMultiple(this.spacingMultipleForFixedHourMarks, "spacingMultipleForFixedHourMarks");
                const fixedMarkerSpacingDegrees = spacingMultiple * this.rotatingHourMarkerSpacingDegrees
                    + (this.areFixedHoursShorter ? -this.rotatingMinuteMarkerSpacingDegrees : this.rotatingMinuteMarkerSpacingDegrees);
                if (this.isRotatingClockwise) {
                    return this.areFixedHoursShorter ? -fixedMarkerSpacingDegrees : fixedMarkerSpacingDegrees;
                } else {
                    return this.areFixedHoursShorter ? fixedMarkerSpacingDegrees : -fixedMarkerSpacingDegrees;
                }
            },
            get fixedMinuteMarkerStepDegrees() {
                const spacingMultiple = this.validateSpacingMultiple(this.spacingMultipleForFixedMinuteMarks, "spacingMultipleForFixedMinuteMarks");
                const rotatingDialDegreesPerMinuteMagnitude = Math.abs(this.rotatingDialDegreesPerMinute);
                const fixedMarkerSpacingDegrees = spacingMultiple * this.rotatingMinuteMarkerSpacingDegrees
                    + (this.areFixedMinutesShorter ? -rotatingDialDegreesPerMinuteMagnitude : rotatingDialDegreesPerMinuteMagnitude);
                if (this.isRotatingClockwise) {
                    return this.areFixedMinutesShorter ? -fixedMarkerSpacingDegrees : fixedMarkerSpacingDegrees;
                } else {
                    return this.areFixedMinutesShorter ? fixedMarkerSpacingDegrees : -fixedMarkerSpacingDegrees;
                }
            },
            
            get rotatingDialDegreesPerHour() {
                return this.rotatingDialDegreesPerMinute * 60;
            },
            get rotatingDialDegreesPerMinute() {
                const rotatingDialDegreesPerMinuteMagnitude = this.rotatingMinuteMarkerSpacingDegrees / 60;
                return this.isRotatingClockwise ? rotatingDialDegreesPerMinuteMagnitude : -rotatingDialDegreesPerMinuteMagnitude;
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
            get fixedMinuteMarkerLength() {
                return this.radiusOfOuterDial - this.radiusOfRotatingDial;
            },
            get radiusOfRotatingDial() {
                return this.radiusOfInnerFixedDial + (this.radiusOfOuterDial - this.radiusOfInnerFixedDial) / this.phi;
            },
            get rotatingMinuteMarkerLength() {
                return this.radiusOfRotatingDial - this.radiusOfInnerFixedDial;
            },
            get weekdayTextRadius() {
                return this.radiusOfRotatingDial + (this.radiusOfOuterDial - this.radiusOfRotatingDial) * 0.7;
            },
            rotatingHourHandLength: 60,
            
            get radiusOfInnerFixedDial() {
                return this.radiusOfOuterDial * (1 - 1 / this.phi);
            },
            fixedHourMarkerLength: 10,
            phi: 1.61803398875 // golden ratio
        },

        // Time
        time: {
            date: initialDate,
            dateAtMinuteStart: startOfMinute(initialDate),
            dateAtHourStart: startOfHour(initialDate),

            get hours() {
                return this.dateAtHourStart.getHours()
            },
            get minutes() {
                return this.dateAtMinuteStart.getMinutes()
            }
        },
        // This enables displaying time other than current.
        // The value is +- period of full rotation.
        offsetSeconds: 0,
        selectedTimeOption: "current",
        manualTransitionTargetDate: null,
        weekdays: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        paramPresets: {
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
        },

        get centerCoordX() {
            return this.visuals.viewPortSize / 2
        },
        get centerCoordY() {
            return this.visuals.viewPortSize / 2
        },
        formatDateTimeInputValue(date) {
            const pad = value => String(value).padStart(2, "0");
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
                + `T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        },
        get timeInputValue() {
            return this.formatDateTimeInputValue(this.time.date);
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
                this.offsetSeconds += this.calculateDeltaSeconds(date, previousDate);
                this.selectedTimeOption = null;
                this.setDisplayedDate(date);
            });
        },
        // methods
        getSecondsInDay() {
            return 24 * 60 * 60;
        },
        civilSecondsWithinDay(date) {
            return date.getHours() * 60 * 60
                + date.getMinutes() * 60
                + date.getSeconds()
                + date.getMilliseconds() / 1000;
        },
        localCivilDayUtcMs(date) {
            // Date.UTC gives a stable serial number for the local calendar day.
            // It deliberately ignores timezone offsets, so every civil date is
            // exactly one nominal 24h day after the previous civil date.
            return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
        },
        civilSeconds(date) {
            // localCivilDayUtcMs() has day zero on 1970-01-01, which was Thursday.
            // Subtract four nominal days so the weekly phase starts on Monday,
            // matching the weekday scale's Monday-at-12-o'clock layout.
            const daysFromCivilZeroToMonday = 4;
            return this.localCivilDayUtcMs(date) / 1000
                - daysFromCivilZeroToMonday * this.getSecondsInDay()
                + this.civilSecondsWithinDay(date)
        },
        rotationDegreesForSeconds(seconds) {
            return seconds * this.params.rotatingDialDegreesPerSecond;
        },
        rotationSpanDegreesForSeconds(seconds) {
            return Math.abs(this.rotationDegreesForSeconds(seconds));
        },
        rotationTransform(angleDegrees) {
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
        },
        rotatingMarkerIndexAlignedWithFixedAngle(fixedMarkerAngleDegrees, rotatingMarkerSpacingDegrees, markerCount, rotatingDialAngleDegrees) {
            const markerIndex = Math.round((fixedMarkerAngleDegrees - rotatingDialAngleDegrees) / rotatingMarkerSpacingDegrees);
            return ((markerIndex % markerCount) + markerCount) % markerCount;
        },
        get alignedRotatingMinuteMarkerIndex() {
            return this.rotatingMarkerIndexAlignedWithFixedAngle(
                this.time.minutes * this.params.fixedMinuteMarkerStepDegrees,
                this.params.rotatingMinuteMarkerSpacingDegrees,
                this.params.numberOfMarksForMinutesOnRotatingDial,
                this.rotatingDialAngleDegreesForDate(this.time.dateAtMinuteStart)
            );
        },
        get alignedRotatingHourMarkerIndex() {
            return this.rotatingMarkerIndexAlignedWithFixedAngle(
                this.fixedHourMarkerAngleDegrees(this.time.hours % this.params.numberOfHours),
                this.params.rotatingHourMarkerSpacingDegrees,
                this.params.numberOfMarksForHoursOnRotatingDial,
                this.rotatingDialAngleDegreesForDate(this.time.dateAtHourStart)
            );
        },
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
        calculateDeltaSeconds(date1, date2) {
            return (date1.getTime() - date2.getTime()) / 1000;
        },
        rotatingDialAngleDegreesForDate(date) {
            return this.rotationDegreesForSeconds(this.civilSeconds(date));
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
        markerPath(innerRadius, outerRadius, markerSpanDegrees, closePath) {
            // Marker is shaped like a trapeze. It overshoots its radial endpoints and is clipped to its ring.
            // The angular size is how much the dial rotates within one minute or hour. Then take a half of it for easier calculation of offsets.
            const markerSpanRadians = markerSpanDegrees * Math.PI / 180;
            const halfMarkerSpanRadians = markerSpanRadians / 2;
            const markerOvershoot = 4;
            const radialDirection = Math.sign(outerRadius - innerRadius) || 1;
            const adjustedInnerRadius = innerRadius - radialDirection * markerOvershoot;
            const adjustedOuterRadius = outerRadius + radialDirection * markerOvershoot;
            const innerHorizontalOffset = adjustedInnerRadius * Math.sin(halfMarkerSpanRadians);
            const innerVerticalOffset = adjustedInnerRadius * Math.cos(halfMarkerSpanRadians);
            const outerHorizontalOffset = adjustedOuterRadius * Math.sin(halfMarkerSpanRadians);
            const outerVerticalOffset = adjustedOuterRadius * Math.cos(halfMarkerSpanRadians);
            return `M${this.centerCoordX - innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                L${this.centerCoordX - outerHorizontalOffset},${this.centerCoordY - outerVerticalOffset}
                l${2 * outerHorizontalOffset},0
                L${this.centerCoordX + innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                ${closePath ? 'z' : ''}`;
        },
        ringClipPath(innerRadius, outerRadius) {
            const inner = Math.max(0, Math.min(innerRadius, outerRadius));
            const outer = Math.max(innerRadius, outerRadius);
            const circlePath = (radius, sweepFlag) => `M${this.centerCoordX},${this.centerCoordY - radius}
                A${radius},${radius} 0 1 ${sweepFlag} ${this.centerCoordX},${this.centerCoordY + radius}
                A${radius},${radius} 0 1 ${sweepFlag} ${this.centerCoordX},${this.centerCoordY - radius}`;
            if (inner === 0) {
                return circlePath(outer, 1);
            }
            return `${circlePath(outer, 1)} ${circlePath(inner, 0)}`;
        },
        pointOnCircle(radius, angleDegrees) {
            const pointAngleRadians = angleDegrees * Math.PI / 180;
            return {
                x: this.centerCoordX + radius * Math.sin(pointAngleRadians),
                y: this.centerCoordY - radius * Math.cos(pointAngleRadians)
            };
        },
        arcPath(radius, startAngleDegrees, endAngleDegrees) {
            const start = this.pointOnCircle(radius, startAngleDegrees);
            const end = this.pointOnCircle(radius, endAngleDegrees);
            const arcSpanDegrees = endAngleDegrees - startAngleDegrees;
            const largeArcFlag = Math.abs(arcSpanDegrees) > 180 ? 1 : 0;
            const sweepFlag = arcSpanDegrees >= 0 ? 1 : 0;
            return `M${start.x},${start.y} A${radius},${radius} 0 ${largeArcFlag} ${sweepFlag} ${end.x},${end.y}`;
        },
        radialLinePath(innerRadius, outerRadius, angleDegrees) {
            const inner = this.pointOnCircle(innerRadius, angleDegrees);
            const outer = this.pointOnCircle(outerRadius, angleDegrees);
            return `M${inner.x},${inner.y} L${outer.x},${outer.y}`;
        },
        weekdaySeparatorPath(dayIndex) {
            return this.radialLinePath(
                this.visuals.radiusOfRotatingDial,
                this.visuals.radiusOfOuterDial,
                this.weekdayBoundaryAngleDegrees(dayIndex)
            );
        },
        weekdayTextPath(dayIndex) {
            const daySpanDegrees = this.weekdayDaySpanDegrees;
            const textSpanDegrees = Math.min(Math.max(daySpanDegrees * 0.84, 24), 150);
            const textCenterAngleDegrees = this.weekdayBoundaryAngleDegrees(dayIndex) + this.weekdayScaleDirection * daySpanDegrees / 2;
            return this.arcPath(this.visuals.weekdayTextRadius, textCenterAngleDegrees - textSpanDegrees / 2, textCenterAngleDegrees + textSpanDegrees / 2);
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
        updateClock() {
            this.setDisplayedDate(new Date(Date.now() + this.offsetSeconds * 1000));
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
                this.offsetSeconds = this.calculateDeltaSeconds(midnight, now);
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
            const preset = this.paramPresets[option];
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
        get selectedParamPreset() {
            return Object.keys(this.paramPresets).find(option => this.paramPresetMatches(option)) || null;
        },
        isSelectedParamPreset(option) {
            return this.selectedParamPreset === option;
        },
        paramPresetMatches(option) {
            const preset = this.paramPresets[option];
            return !!preset
                && this.params.numberOfMarksForHoursOnRotatingDial === preset.numberOfMarksForHoursOnRotatingDial
                && this.params.isRotatingClockwise === preset.isRotatingClockwise
                && this.params.areFixedHoursShorter === preset.areFixedHoursShorter
                && this.params.areFixedMinutesShorter === preset.areFixedMinutesShorter
                && this.visuals.minuteLabelEvery === preset.minuteLabelEvery
                && this.visuals.minuteLabel59 === preset.minuteLabel59;
        },
        get rotatingDialAngleDegrees() {
            const date = this.manualTransitionTargetDate || this.time.date;
            return this.rotatingDialAngleDegreesForDate(date);
        },
        finishRotatingDialTransition(event) {
            if ((event.currentTarget && event.target && event.currentTarget !== event.target)
                || event.propertyName !== "transform"
                || !this.manualTransitionTargetDate) {
                return;
            }
            this.manualTransitionTargetDate = null;
        },
        // One weekday spans exactly the angle swept by the rotating ring over 24h.
        // For the Week Rotation preset this is 360 / 7 degrees.
        get weekdayDaySpanDegrees() {
            return this.rotationSpanDegreesForSeconds(this.getSecondsInDay());
        },
        // Match the fixed weekday scale to the ring rotation direction so day boundaries
        // progress under the weekday pointer as the single rotating ring turns.
        get weekdayScaleDirection() {
            return Math.sign(this.params.rotatingDialDegreesPerSecond) || 1;
        },
        setupUpdate() {
            this.setParams("chaoticHours");
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
        }
    });
}
