// Get data from cymon

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
            data.hits.foreach(function (e) { console.log(e); }
            );
        },
        error: function (e) { console.log("Error", e); }
    });
}
