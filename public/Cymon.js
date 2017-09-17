// Get data from cymon
Tid = 0;
var searches = ["Apache", "MySQL", "Python", "Ubuntu"];
function getCymon(term, start, end, size) {
    var JWToken;
   /* $.post("https://api.cymon.io/v2/auth/login", { username: "HTN-ThreatMonitor", password: "Ruthenium45" },
        function (JWToken, Message) {
            console.log("Token: " + JWToken + "\nMessage: " + Message);
        });*/

    $.get("https://api.cymon.io/v2/ioc/search/term/" + term, { startDate: start, endDate: end, from: 0, size: size },
        function (data) {
            console.log(data);
            for (i = 0; i < size; i++) {
                if (typeof data.hits[i] != 'undefined') {
                    Tid++;
                    Title = data.hits[i].Title;
                    time = data.hits[i].timestamp;
                    lat = 0;
                    long = 0;
                    city = "";
                    //progVers = data.hits[i].description;
                    if (typeof data.hits[i].location != 'undefined') {
                        city = data.hits[i].location.city;
                        lat = data.hits[i].location.lat;
                        long = data.hits[i].location.long;
                    }
                    if (typeof Title === 'undefined') { Title = "n/a" };
                    if (typeof city === 'undefined') city = "n/a";
                    if (typeof lat === 'undefined') { lat = "n/a" };
                    if (typeof long === 'undefined') { long = "n/a" };
                    // if (typeof progVers === 'undefined') progVers = "n/a";
                    storeThreats(Tid, time, Title, city, lat, long);
                }
            }
        });
}

function storeThreats(Tid, time, Title, city, lat, long) {
    //console.log(Tid);
    firebase.database().ref(`cymon`).push({
        ThreatId: Tid,
        timestamp: time,
        description: descr,
        Loc: city,
        lat: lat,
        long: long,
    }
        //versionAffected: progVers,  not useful. RIP
    );
}

function multiSearch(searches) {
   /* var today = new Date();
    dayNum = today.getDate();
    Month = today.getMonth();
    Year = today.getFullYear();
    dateEnd = Year.toString() + "-"+("0" + Month.toString()).slice(-2) + "-"+("0" + (dayNum).toString()).slice(-2); //today's date string'
    today.setDate(today.getDate() - 500);
    dayNum = today.getDate();
    Month = today.getMonth();
    Year = today.getFullYear();
    dateStart = Year.toString() + "-"+("0" + Month.toString()).slice(-2) + "-"+("0" + (dayNum).toString()).slice(-2); //10 days back
    */
    searches.forEach(function (query) {
        getCymon(query, "2017-03-25", "2017-09-16", 10);
    });
}
    