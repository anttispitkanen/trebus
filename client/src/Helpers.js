/* eslint-disable */

// a file full of static helper functions that can be referenced from outside

export default class Helpers {

    static parseMinsToArrival(routeDataObject) {
        var dateNow = new Date();

        //current time as minutes (from 0:00)
        var timeNow = 60 * dateNow.getHours() + dateNow.getMinutes();

        var arrival;
        arrival = '' + routeDataObject.legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
        arrival = parseInt(arrival.substr(8, 4)); //arrival time as int hhmm
        var arrHours = Math.floor(arrival/100);
        var arrMinutes = arrival % 100;

        //arrival time as minutes from 0:00
        var arrAsMinutes = arrHours * 60 + arrMinutes;

        var duration = arrAsMinutes - timeNow; //duration in minutes

        if (duration < 0) {
            //stupid hack to counter problems with date change at midnight
            duration += 1440;

            if (duration === 1439) {
                //equally stupid hack to counter problems with less than one minute turning to 23h59min
                duration = 0;
            }
        }

        //wow such clever much hack
        let durationTimeObject = {
            hoursNum: '',
            hoursText: '',
            minsNum: '',
            minsText: ''
        }

        if (duration <= 60) {
            //return duration + ' minutes';
            durationTimeObject.minsNum = duration;
            durationTimeObject.minsText = 'min';
        } else {
            let hours = Math.floor(duration / 60);
            let mins = duration%60;
            if (mins < 10) {
                mins = '0' + mins;
            }
            //return hours + 'h ' + mins + ' minutes';
            durationTimeObject.hoursNum = hours;
            durationTimeObject.hoursText = 'h';
            durationTimeObject.minsNum = mins;
            durationTimeObject.minsText = 'min';
        }

        return durationTimeObject;
    }

    static parseStartingPoint(routeDataObject) {
        var startingPoint;
        if (routeDataObject.legs[0].locs.slice(-1).pop().name) {
            startingPoint = routeDataObject.legs[0].locs.slice(-1).pop().name;
        } else {
            return 'Just walk :DD';
        }

        var startingPointQueryString = startingPoint.split(' ').join('+');
        var linkToLissu = `http://lissu.tampere.fi/?mobile=1&key=${startingPointQueryString}`;

        return({
            'departStop': startingPoint,
            'infoLink': linkToLissu
        })
    }

    static parseArrival(routeDataObject) {
        var arrival;
        arrival = routeDataObject.legs.slice(-1).pop().locs.slice(-1).pop().arrTime;
        arrival = arrival.substr(8, 2) + '.' + arrival.substr(10, 2);
        return arrival;
    }

    static parseDeparture(routeDataObject) {
        var departure;

        if (routeDataObject.legs[0].type === 'walk') {
            if (routeDataObject.legs.length > 1) {
                departure = routeDataObject.legs[1].locs[0].depTime;
            } else {
                return 'Just walk :DD';
            }

        } else {
            departure = routeDataObject.legs[0].locs[0].depTime;
        }

        return departure.substr(8, 2) + '.' + departure.substr(10, 2);
    }

    static parseLineNum(routeDataObject) {
        var lineNum;

        if (routeDataObject.legs[0].type === 'walk') {
            if (routeDataObject.legs.length > 1) {
                lineNum = routeDataObject.legs[1].code;
            } else {
                lineNum = 'Just walk :DD';
            }
        } else if (routeDataObject.legs[0].code === '1') {
            lineNum = routeDataObject.legs[0].code;
        } else {
            lineNum = 'Just walk :DD';
        }

        return lineNum;
    }

    static secondsToMinutes(seconds) {
        return seconds/60;
    }

}
