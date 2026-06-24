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
            // signed angle. If negative, the marks extend counter-clockwise from the top.
            get angleStepForFixedHourMarks () {
                // Each hour the next minute mark aligns.
                const hourVernierConstant = 360 / this.numberOfMarksForMinutesOnRotatingDial;
                const hourAngleOnRotatingDial = 360 / this.numberOfMarksForHoursOnRotatingDial;
                const angle = hourAngleOnRotatingDial + (this.areFixedHoursShorter ? -hourVernierConstant : hourVernierConstant);
                if (this.isRotatingClockwise) {
                    return this.areFixedHoursShorter ? -angle : angle;
                } else {
                    return this.areFixedHoursShorter ? angle : -angle;
                }
            },
            get angleStepForFixedMinuteMarks() {
                const hourVernierConstant = 360 / this.numberOfMarksForMinutesOnRotatingDial;
                const minuteVernierConstant = hourVernierConstant / 60;
                const minuteAngleOnRotatingDial = hourVernierConstant;
                const angle = minuteAngleOnRotatingDial + (this.areFixedMinutesShorter ? -minuteVernierConstant : minuteVernierConstant);
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
            radiusOfOuterDial: 180,
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
        updateClock() {
            this.time.currentDate = new Date();
        },
        useCurrentTime() {
            // Calling updateClock prevents a hiccup mid-animation
            this.updateClock();
            this.time.offsetSeconds = 0;
        },
        setMidnight() {
            this.updateClock();
            this.setOffsetForTime(0, 0, 0);
        },
        setRandomTime() {
            this.updateClock();
            this.time.offsetSeconds = Math.floor(Math.random() * this.getSecondsInDay());
        },
        setParams(option) {
            if (option == "chaoticHours") {
                this.params.numberOfMarksForHoursOnRotatingDial = 5;
                this.params.isRotatingClockwise = false;
                this.params.areFixedHoursShorter = false;
                this.params.areFixedMinutesShorter = true;
                this.visuals.minuteLabelEvery = 5;
                this.visuals.minuteLabel59 = true;
            } else if (option == "chaoticMinutes") {
                this.params.numberOfMarksForHoursOnRotatingDial = 1;
                this.params.isRotatingClockwise = true;
                this.params.areFixedHoursShorter = false;
                this.params.areFixedMinutesShorter = false;
                this.visuals.minuteLabelEvery = 1;
                this.visuals.minuteLabel59 = false;
            } else if (option == "chaoticHoursMinuteGap") {
                this.params.numberOfMarksForHoursOnRotatingDial = 6;
                this.params.isRotatingClockwise = true;
                this.params.areFixedHoursShorter = true;
                this.params.areFixedMinutesShorter = false;
                this.visuals.minuteLabelEvery = 5;
                this.visuals.minuteLabel59 = true;
            } else if (option == "oneWeekRotation") {
                this.params.numberOfMarksForHoursOnRotatingDial = 14;
                this.params.isRotatingClockwise = true;
                this.params.areFixedHoursShorter = false;
                this.params.areFixedMinutesShorter = false;
                this.visuals.minuteLabelEvery = 5;
                this.visuals.minuteLabel59 = true;
            }
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
