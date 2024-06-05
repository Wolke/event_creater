function myFunction() {
const nowUtc = new Date(Date.UTC(
    new Date().getUTCFullYear(),
    new Date().getUTCMonth(),
    new Date().getUTCDate(),
    new Date().getUTCHours(),
    new Date().getUTCMinutes(),
    new Date().getUTCSeconds(),
    new Date().getUTCMilliseconds()
));
console.log(nowUtc.getTime()); // Outputs the current date and time in UTC in ISO format
console.log(nowUtc.getTimezoneOffset())
}