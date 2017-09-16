// Get data from cymon
Tid = 0;
function getCymon(term, start, end, size) {
    /*var JWToken;
    $.post("https://api.cymon.io/v2/auth/login", { username: "HTN-ThreatMonitor", password: "Ruthenium45" },
        function (JWToken, Message) {
            console.log("Token: " + JWToken + "\nMessage: " + Message);
        });*/

    $.ajax({
        url: "https://api.cymon.io/v2/ioc/search/term/" + term,
        type: 'GET',
        beforeSend: function (xhr) {
           // xhr.setRequestHeader('Authorization', 'bearer' + JWToken);
        },
        dataType: 'json',
        data: { startDate: start, endDate: end, from: 0, size: size },
        success: function (data) {
            for (var i in data){
                console.log(data[i]);
            };
            Tid++;
            descr = data[0].description;
            time = data[0].timestamp;
            progVers = data[0].title;
            city = data.hits.location.city;
            storeThreats(Tid, time,descr, progVers, city);
        },
        error: function (err) { console.log("Error", err); }
    });
}

function storeThreats(Tid,time, descr, progVers, city){
    //potential logic to separate program from version.
    firebase.database().ref(`threads`).push(
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