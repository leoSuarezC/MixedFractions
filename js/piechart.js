
function PieChart(id, o) {
    this.includeLabels = false;
    if (o.includeLabels == undefined) {
        this.includeLabels = false;
    }
    else {
        this.includeLabels = o.includeLabels;
    }
    this.data = o.data ? o.data : [30, 70, 45, 65, 20, 130]; // in degrees
    this.labels = o.labels ? o.labels : ["First", "Second", "Third", "Fourth", "Fifth", "Sixth"];
    this.colors = o.colors ? o.colors : [
        	["#bbddb3", "#1d8e04"], // green
        	["#e2f5b4", "#9edd08"], // yellow green
        	["#fdfbb4", "#faf406"], // yellow
        	["#fbd4b7", "#f2700f"], // orange
        	["#f8bdb4", "#ea2507"], // red
        	["#e2bcbd", "#9e2126"]  // purple

    ];

    this.canvas = document.getElementById(id);
}

PieChart.prototype = {

    select: function (segment) {
        var self = this;
        var context = this.canvas.getContext("2d");
        this.drawSegment(this.canvas, context, segment, this.data[segment], true, this.includeLabels);
    },

    draw: function (slidesNumber, customRadius, segmentsToDraw) {
        var baseColors = [
        	["#bbddb3", "#1d8e04"], // green
        	["#e2f5b4", "#9edd08"], // yellow green
        	["#fdfbb4", "#faf406"], // yellow
        	["#fbd4b7", "#f2700f"], // orange
        	["#f8bdb4", "#ea2507"], // red
        	["#e2bcbd", "#9e2126"]  // purple
        ];
        var customX = customRadius;
        var customY = customRadius;
        var self = this;
        var context = this.canvas.getContext("2d");
        //CLEAN THE PREVIOUS DRAW
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        var slideDegrees = 360 / slidesNumber
        var chartSeparation = 10;
        var segments = 0;
        var k = 0;
        for (var i = 0; i < slidesNumber; i++) {
            this.data[i] = slideDegrees;
            console.log(this.colors[k][0]);
            this.colors[i] = new Array(2);
            this.colors[i][0] = baseColors[k][0];
            this.colors[i][1] = baseColors[k][1];

            k++;
            if (k >= 6) {
                k = 0;
            }
        }

        while (segments < segmentsToDraw) {

            for (var i = 0; i < this.data.length; i++) {

                this.drawSegmentInPositionRadius(this.canvas, context, i, this.data[i], false, this.includeLabels, customX, customY, customRadius);
                //VERIFY THE NUMBER OF SEGMENTS TO BREAK THE PROCESS
                segments++;
                if (segments >= segmentsToDraw) {
                    break;
                }
            }

            //EVALUATE IF THE ROW COULD CONTAIN ANOTHER CIRCLE
            //AND IF IT COULDN'T FOLLOW DRAWING IN THE NEXT ROW
            if (3 * parseInt(customRadius) + parseInt(customX) + chartSeparation > this.canvas.width) {
                customY = 2 * (customRadius) + parseInt(customY) + chartSeparation;
                customX = customRadius;
            }
            else {
                customX = parseInt(customX) + parseInt(customRadius) * 2 + chartSeparation;
            }
        }
    },

    drawSegment: function (canvas, context, i, size, isSelected, includeLabels) {
        var self = this;
        context.save();
        var centerX = Math.floor(canvas.width / 2);
        var centerY = Math.floor(canvas.height / 2);
        radius = Math.floor(canvas.width / 2);

        var startingAngle = self.degreesToRadians(self.sumTo(self.data, i) - 90);
        var arcSize = self.degreesToRadians(size);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
        context.closePath();

        isSelected ?
			context.fillStyle = self.colors[i][1] :
			context.fillStyle = self.colors[i][0];

        context.fill();
        context.restore();

        if (includeLabels && (self.labels.length > i)) {
            self.drawSegmentLabel(canvas, context, i, isSelected);
        }
    },

    //DRAWS SEGMENTS IN SPECIFIC POSITIONS WITH SPECIFIC RADIUS
    //IN ORDER TO CONTROL THE PROCESS OF REPRESENT THE MIXED
    //FRACTION
    drawSegmentInPositionRadius: function (canvas, context, i, size, isSelected, includeLabels, posX, posY, paramRadius) {
        var self = this;
        context.save();
        var centerX = posX;
        var centerY = posY;
        radius = paramRadius;

        var startingAngle = self.degreesToRadians(self.sumTo(self.data, i) - 90);
        var arcSize = self.degreesToRadians(size);
        var endingAngle = startingAngle + arcSize;

        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
        context.closePath();

        isSelected ?
			context.fillStyle = self.colors[i][1] :
			context.fillStyle = self.colors[i][0];

        context.fill();
        context.restore();

        if (includeLabels && (self.labels.length > i)) {
            self.drawSegmentLabel(canvas, context, i, isSelected);
        }
    },

    drawSegmentLabel: function (canvas, context, i, isSelected) {
        var self = this;
        context.save();
        var x = Math.floor(canvas.width / 2);
        var y = Math.floor(canvas.height / 2);
        var angle;
        var angleD = self.sumTo(self.data, i);
        var flip = (angleD < 90 || angleD > 270) ? false : true;

        context.translate(x, y);
        if (flip) {
            angleD = angleD - 180;
            context.textAlign = "left";
            angle = self.degreesToRadians(angleD);
            context.rotate(angle);
            context.translate(-(x + (canvas.width * 0.5)) + 15, -(canvas.height * 0.05) - 10);
        }
        else {
            context.textAlign = "right";
            angle = self.degreesToRadians(angleD);
            context.rotate(angle);
        }
        //context.textAlign = "right";
        var fontSize = Math.floor(canvas.height / 25);
        context.font = fontSize + "pt Helvetica";

        var dx = Math.floor(canvas.width * 0.5) - 10;
        var dy = Math.floor(canvas.height * 0.05);
        context.fillText(self.labels[i], dx, dy);

        context.restore();
    },

    drawLabel: function (i) {
        var self = this;
        var context = this.canvas.getContext("2d");
        var size = self.data[i];

        self.drawSegmentLabel(this.canvas, context, i, size, false);
    },

    // helper functions
    degreesToRadians: function (degrees) {
        return (degrees * Math.PI) / 180;
    },

    sumTo: function (a, i) {
        var sum = 0;
        for (var j = 0; j < i; j++) {
            sum += a[j];
        }
        return sum;
    }


}

