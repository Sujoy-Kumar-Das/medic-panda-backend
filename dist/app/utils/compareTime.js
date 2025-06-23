"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareTime = void 0;
const compareTime = (lastAttemptTime, coolDownMinutes) => {
    if (!lastAttemptTime)
        return false;
    const now = new Date();
    const coolDownEndTime = new Date(lastAttemptTime.getTime() + coolDownMinutes * 60 * 1000);
    return now >= coolDownEndTime;
};
exports.compareTime = compareTime;
