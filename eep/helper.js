class Helper {
    static conversion(rawValue, scaleMin, scaleMax, rangeMin, rangeMax) {
        return (((scaleMax - scaleMin) / (rangeMax - rangeMin)) * (rawValue - rangeMin) + scaleMin).toFixed(2);
    }
}

module.exports = Helper;