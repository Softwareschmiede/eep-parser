class Helper {
    static conversion(rawValue, scaleMin, scaleMax, rangeMin, rangeMax) {
        return (((scaleMax - scaleMin) / (rangeMax - rangeMin)) * (rawValue - rangeMin) + scaleMin).toFixed(2);
    }

    static conversion2(value, scaleMin, scaleMax, rangeMin, rangeMax) {
        return (((scaleMax - scaleMin) / (rangeMax - rangeMin)) * rangeMin - scaleMin + value) / ((scaleMax - scaleMin) / (rangeMax - rangeMin));
    }
}

module.exports = Helper;