function createClockApp() {
    return PetiteVue.createApp({
        options: {
            syncTime: true,
        },
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
            get angleStepForHourMarksOnInnerDial () {
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
            get angleStepForMinuteMarksOnOuterDial() {
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
            minuteMarkerThicknessFactor: 1,
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
            hours: 0,
            minutes: 0,
            seconds: 0,
        },

        get centerCoordX() {
            return this.visuals.viewPortSize / 2
        },
        get centerCoordY() {
            return this.visuals.viewPortSize / 2
        },
        // methods
        markerPath(innerRadius, outerRadius, angularSizeDegrees, closePath) {
            // Marker is shaped like a trapeze. Drawing starts from the inner side of the rotating dial.
            // The angular size is how much the dial rotates within one minute or hour. Then take a half of it for easier calculation of offsets.
            const angularSizePi = angularSizeDegrees * Math.PI / 180;
            const markerHalfAngularSize = angularSizePi / 2;
            const innerHorizontalOffset = innerRadius * Math.sin(markerHalfAngularSize);
            const innerVerticalOffset = innerRadius * Math.cos(markerHalfAngularSize);
            const outerHorizontalOffset = outerRadius * Math.sin(markerHalfAngularSize);
            const outerVerticalOffset = outerRadius * Math.cos(markerHalfAngularSize);
            return `M${this.centerCoordX - innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                L${this.centerCoordX - outerHorizontalOffset},${this.centerCoordY - outerVerticalOffset}
                l${2 * outerHorizontalOffset},0
                L${this.centerCoordX + innerHorizontalOffset},${this.centerCoordY - innerVerticalOffset}
                ${closePath ? 'z' : ''}`;
        },
        updateClock() {
            if (!this.options.syncTime) {
                return;
            }
            const date = new Date();
            this.time.hours = date.getHours() % this.params.numberOfHours;
            this.time.minutes = date.getMinutes();
            this.time.seconds = date.getSeconds();
        },
        setRandomTime() {
            this.options.syncTime = false;
            this.time.hours = Math.floor(Math.random() * 12);
            this.time.minutes = Math.floor(Math.random() * 60);
            this.time.seconds = Math.floor(Math.random() * 60)
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
        get timeString() {
            return `${this.time.hours}:${String(this.time.minutes).padStart(2, '0')}:${String(this.time.seconds).padStart(2, '0')}`
        },
        setupUpdate() {
            this.setParams("chaoticHours");
            this.updateClock();
            setInterval(this.updateClock, 1000);
        }
    });
}