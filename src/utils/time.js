function getTimeDiffString(num, str) {
    if(num===1)
        return num + ' ' + str + ' ago'; 
    else
        return num + ' ' + str + 's ago';
}

export function timeDifference(current, previous) {

    var secPerMinute = 60;
    var secPerHour = secPerMinute * 60;
    var secPerDay = secPerHour * 24;
    var secPerMonth = secPerDay * 30;
    var secPerYear = secPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < secPerMinute) 
        return getTimeDiffString(Math.round(elapsed), "second")
    else if (elapsed < secPerHour)
        return getTimeDiffString(Math.round(elapsed/secPerMinute), "minute")
    else if (elapsed < secPerDay )
        return getTimeDiffString(Math.round(elapsed/secPerHour), "hour")
    else if (elapsed < secPerMonth)
        return getTimeDiffString(Math.round(elapsed/secPerDay), "day")
    else if (elapsed < secPerYear)
        return getTimeDiffString(Math.round(elapsed/secPerMonth), "month")
    else 
        return getTimeDiffString(Math.round(elapsed/secPerYear), "year")
}

export function getDateStringFromObj(date, offset){
    date.setDate(date.getDate()-offset);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return yyyy + "-" + mm + '-' + dd;
  }