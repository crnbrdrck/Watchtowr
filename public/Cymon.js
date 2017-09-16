// Get data from cymon
Tid = 0;
var searches = ["Apache", "MySQL", "Python", "Ubuntu"];
function getCymon(term, start, end, size) {
    /*var JWToken;
    $.post("https://api.cymon.io/v2/auth/login", { username: "HTN-ThreatMonitor", password: "Ruthenium45" },
        function (JWToken, Message) {
            console.log("Token: " + JWToken + "\nMessage: " + Message);
        });*/
    
        $.get("https://api.cymon.io/v2/ioc/search/term/" + term, { startDate: start, endDate: end, from: 0, size: size },
            function (data) {
                console.log(data);
                for (i = 0; i < size; i++) {
                    Tid++;
                    descr = data.hits[i].description;
                    time = data.hits[i].timestamp;
                    progVers = data.hits[i].title;
                    city = data.hits[i].location.city;
                    if (typeof descr === 'undefined') descr="n/a";
                    storeThreats(Tid, time, descr, progVers, city);
                }
            });
}

function storeThreats(Tid,time, descr, progVers, city){
    //potential logic to separate program from version.
    console.log(Tid);
    firebase.database().ref(`threats`).push(
        {
            ThreatId: Tid,
            timestamp: time,
        description: descr,
            //program: prog,
        versionAffected: progVers,
        Loc: city,
        }
    );
}

function multiSearch(searches) {
    var today = new Date();
    dayNum = today.getDate();
    Month = today.getMonth();
    Year = today.getFullYear();
    dateEnd = Year.toString() + "-"+("0" + Month.toString()).slice(-2) + "-"+("0" + (dayNum).toString()).slice(-2); //today's date string'
    today.setDate(today.getDate() - 10);
    dayNum = today.getDate();
    Month = today.getMonth();
    Year = today.getFullYear();
    dateStart = Year.toString() + "-"+("0" + Month.toString()).slice(-2) + "-"+("0" + (dayNum).toString()).slice(-2); //10 days back
    searches.forEach(function (a) {
       console.log(a, dateStart, "    ", dateEnd, 10);
    });
}
    
