// Get data from cymon
var Tid
function getCymon(term, start, end, size) {
    var JWToken;
    $.post("https://api.cymon.io/v2/auth/login", { username: "HTN-ThreatMonitor", password: "Ruthenium45" },
        function (JWToken, Message) {
            console.log("Token: " + JWToken + "\nMessage: " + Message);
        });

    $.ajax({
        url: "https://api.cymon.io/v2/ioc/search/term/" + term,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'bearer' + JWToken);
        },
        data: { startDate: start, endDate: end, from: 0, size: size },
        success: function (data) {
            data.hits.foreach(function (e) {
                console.log(e);
            });
            Tid++;
            descr = data.hits.Title;
            progVers = data.hits.description;
            city = data.hits.loc.city;
            storeThreats(Tid, descr, progVers, city);
        },
        error: function (err) { console.log("Error", err); }
    });
}

function storeThreats(Tid, descr, progVers, city){
    //potential logic to separate program from version.
    firebase.database().ref(`threads`).push()
        {
            ThreatId: Tid,
            description: descr,
            //program: prog,
            versionAffected: progVers,
            Loc: city,
        }
    );
}