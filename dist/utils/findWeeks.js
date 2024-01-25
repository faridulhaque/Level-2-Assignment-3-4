"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findWeeks = void 0;
const findWeeks = (sd, ed) => {
    const duration = ed.getTime() - sd.getTime();
    const durationDays = duration / (1000 * 3600 * 24);
    return Math.round(durationDays / 7);
};
exports.findWeeks = findWeeks;
