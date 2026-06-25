function createClockApp() {
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
            numberOfAngleStepsForFixedHourMarks: 1,
            numberOfAngleStepsForFixedMinuteMarks: 1,
            validateAngleStepCount(value, paramName) {
                if (!Number.isInteger(value) || value < 1) {
                    throw new Error(`${paramName} must be an integer greater than or equal to 1`);
                }
                return value;
            },
            // Signed alignment step between fixed hour marks. The placement helper below
            // wraps non-12 hour marks backward from 12 so the larger gap lands between 12 and 1.
            get angleStepForFixedHourMarks () {
                // Each hour the next minute mark aligns.
                const angleStepCount = this.validateAngleStepCount(this.numberOfAngleStepsForFixedHourMarks, "numberOfAngleStepsForFixedHourMarks");
                const hourVernierConstant = 360 / this.numberOfMarksForMinutesOnRotatingDial;
                const hourAngleOnRotatingDial = 360 / this.numberOfMarksForHoursOnRotatingDial;
                const angle = angleStepCount * hourAngleOnRotatingDial + (this.areFixedHoursShorter ? -hourVernierConstant : hourVernierConstant);
                if (this.isRotatingClockwise) {
                    return this.areFixedHoursShorter ? -angle : angle;
                } else {
                    return this.areFixedHoursShorter ? angle : -angle;
                }
            },
            get angleStepForFixedMinuteMarks() {
                const angleStepCount = this.validateAngleStepCount(this.numberOfAngleStepsForFixedMinuteMarks, "numberOfAngleStepsForFixedMinuteMarks");
                const hourVernierConstant = 360 / this.numberOfMarksForMinutesOnRotatingDial;
                const minuteVernierConstant = hourVernierConstant / 60;
                const minuteAngleOnRotatingDial = hourVernierConstant;
                const angle = angleStepCount * minuteAngleOnRotatingDial + (this.areFixedMinutesShorter ? -minuteVernierConstant : minuteVernierConstant);
                if (this.isRotatingClockwise) {
                    return this.areFixedMinutesShorter ? -angle : angle;
                } else {
                    return this.areFixedMinutesShorter ? angle : -angle;
                }
            },
            
            get angleDeltaOfRotatingDialPerMinute() {
                const hourVernierConstant = 360 / this.numberOfMarksForMinutesOnRotatingDial;
                const minuteVernierConstant = hourVernierConstant / 60;

                return this.isRotatingClockwise ? minuteVernierConstant : -minuteVernierConstant;
            }
        },

        visuals: {
            viewPortSize: 400,
            radiusOfOuterDial: 198,
            minuteLabelEvery: 5,
            minuteLabel59: false,
            minuteMarkerThicknessFactor: 10,
            highlightMatchingMarkers: true,
            get fixedMinuteMarkerLength() {
                return this.radiusOfOuterDial - this.radiusOfRotatingDial;
            },
            get radiusOfRotatingDial() {
                return this.radiusOfInnerFixedDial + (this.radiusOfOuterDial - this.radiusOfInnerFixedDial) / this.phi;
            },
            get rotatingMinuteMarkerLength() {
                return this.radiusOfRotatingDial - this.radiusOfInnerFixedDial;
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
            currentDate: new Date(),
            
            // Positive, between 0 and equivalent of 24h.
            // This enables displaying time other than current.
            offsetSeconds: 0,

            get date() {
                // Clone to avoid mutating currentDate
                const date = new Date(this.currentDate);
                date.setSeconds(date.getSeconds() + this.offsetSeconds);
                return date;
            },

            get hours() {
                return this.date.getHours()
            },
            get minutes() {
                return this.date.getMinutes()
            },
            get seconds() {
                return this.date.getSeconds()
            }
        },
        selectedTimeOption: "current",
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
        formatTime(time) {
            const date = new Date();
            date.setHours(time.hours, time.minutes, time.seconds, 0);
            return date.toTimeString().slice(0, 8);
        },
        get timeInputValue() {
            return this.formatTime(this.time);
        },
        set timeInputValue(value) {
            if (!value) {
                return;
            }
            const [hours, minutes, seconds = "0"] = value.split(":");
            this.selectedTimeOption = null;
            this.setOffsetForTime(Number(hours) || 0, Number(minutes) || 0, Number(seconds) || 0);
        },
        // methods
        getSecondsInDay() {
            return 24 * 60 * 60;
        },
        secondsWithinHMS(hours, minutes, seconds) {
            return hours * 60 * 60 + minutes * 60 + seconds;
        },
        setOffsetForTime(hours, minutes, seconds) {
            const targetSeconds = this.secondsWithinHMS(hours, minutes, seconds);
            const date = new Date();
            const currentTimeSeconds = this.secondsWithinHMS(date.getHours(), date.getMinutes(), date.getSeconds());
            if (targetSeconds >= currentTimeSeconds) {
                this.time.offsetSeconds = targetSeconds - currentTimeSeconds;
            } else {
                this.time.offsetSeconds = targetSeconds - currentTimeSeconds + this.getSecondsInDay();
            }
        },
        markerPath(innerRadius, outerRadius, angularSizeDegrees, closePath) {
            // Marker is shaped like a trapeze. It overshoots its radial endpoints and is clipped to its ring.
            // The angular size is how much the dial rotates within one minute or hour. Then take a half of it for easier calculation of offsets.
            const angularSizePi = angularSizeDegrees * Math.PI / 180;
            const markerHalfAngularSize = angularSizePi / 2;
            const markerOvershoot = 4;
            const radialDirection = Math.sign(outerRadius - innerRadius) || 1;
            const adjustedInnerRadius = innerRadius - radialDirection * markerOvershoot;
            const adjustedOuterRadius = outerRadius + radialDirection * markerOvershoot;
            const innerHorizontalOffset = adjustedInnerRadius * Math.sin(markerHalfAngularSize);
            const innerVerticalOffset = adjustedInnerRadius * Math.cos(markerHalfAngularSize);
            const outerHorizontalOffset = adjustedOuterRadius * Math.sin(markerHalfAngularSize);
            const outerVerticalOffset = adjustedOuterRadius * Math.cos(markerHalfAngularSize);
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
        fixedHourMarkerAngle(hourIndex) {
            if (hourIndex === 0) {
                return 0;
            }
            return (hourIndex - this.params.numberOfHours) * this.params.angleStepForFixedHourMarks;
        },
        updateClock() {
            this.time.currentDate = new Date();
        },
        useCurrentTime() {
            // Calling updateClock prevents a hiccup mid-animation
            this.updateClock();
            this.selectedTimeOption = "current";
            this.time.offsetSeconds = 0;
        },
        setMidnight() {
            this.updateClock();
            this.selectedTimeOption = "midnight";
            this.setOffsetForTime(0, 0, 0);
        },
        setRandomTime() {
            this.updateClock();
            this.selectedTimeOption = "random";
            this.time.offsetSeconds = Math.floor(Math.random() * this.getSecondsInDay());
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
        get totalMinutes() {
            return this.time.hours * 60 + this.time.minutes + this.time.seconds / 60;
        },
        setupUpdate() {
            this.setParams("chaoticHours");
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
        }
    });
}
