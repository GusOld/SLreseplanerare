import $ from 'jquery';
import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

$(function () {
    var idList = [0];
    var searchTerm = $("#term");
    var searchSubmit = $("#sub");
    var stopsList = $("#stops");
    var departureTable = $("table #tabel");
    var transportFilter = $("td #tFilter");
    var sessionReset = $(".close");
    

    searchSubmit.attr("disabled", "disabled");
    sessionReset.hide();
    
    
    searchTerm.on("change", function () {
        if (this.val == "") {
            searchSubmit.attr("disabled", "disabled");
            sessionReset.hide();
        } else {
            searchSubmit.removeAttr("disabled", "disabled");
            sessionReset.show();
        }
    });

    sessionReset.click(function(e){
        e.preventDefault();
        searchTerm.val("");
        stopsList.empty();
        departureTable.empty();
        searchSubmit.attr("disabled", "disabled");
        sessionReset.hide();
    });

    searchSubmit.click(function(e){
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "/api/search/" + searchTerm.val(),
            success: function (data) {
                stopsList.empty();
                $.each(data.StopLocation, function (i, item) {
                    stopsList.append("<li><a href='#' id='i" + i + "'>" + this.name + "</a></li>");
                    idList[i] = this.id;
                });
            }

        });
    });

    stopsList.on("click","a", function (e) {
        e.preventDefault();
        var findID = $(this).attr("id");
        var itemID = findID.substring(1, findID.length);
        $.ajax({
            type: "GET",
            url: "/api/departures/" + idList[itemID],
            success: function (obj) {
                departureTable.empty();
                $.each(obj.Departure, function (i, departure){
                    if (departure.transportCategory == "ULT") {
                        departureTable.append("<tr class='t-bana'><td>" + departure.time + "</td><td>" + departure.direction + "</td><td>Tunnelbana</td></tr>");
                    }
                    else if (departure.transportCategory == "BLT") {
                        departureTable.append("<tr class='buss'><td>" + departure.time + "</td><td>" + departure.direction + "</td><td>Buss</td></tr>");
                    }
                    else if (departure.transportCategory == "JLT") {
                        departureTable.append("<tr class='pendel'><td>" + departure.time + "</td><td>" + departure.direction + "</td><td>Pendeltåg</td></tr>");
                    }
                    else if (departure.transportCategory == "JAX") {
                        departureTable.append("<tr class='ftransfer'><td>" + departure.time + "</td><td>" + departure.direction + "</td><td>Flygtransfer Tåg</td></tr>");
                    }
                    else {
                        departureTable.append("<tr class='ftransfer'><td>" + departure.time + "</td><td>" + departure.direction + "</td><td>Flygtransfer Buss</td></tr>");
                    } 
                });
                
            }

        });
    });

    transportFilter.on("change", function () {
        var subway = $("table #tabel .t-bana");
        var bus = $("table #tabel .buss");
        var train = $("table #tabel .pendel");
        var flightTransfer = $("table #tabel .ftransfer");
        switch (transportFilter.val()) {
            case "T-bana":
                subway.show();
                bus.hide();
                train.hide();
                flightTransfer.hide();
                break;
            case "Buss":
                subway.hide();
                bus.show();
                train.hide();
                flightTransfer.hide();
                break;
            case "Tåg":
                subway.hide();
                bus.hide();
                train.show();
                flightTransfer.hide();
                break;
            case "Transfer":
                subway.hide();
                bus.hide();
                train.hide();
                flightTransfer.show();
                break;
            default:
                subway.show();
                bus.show();
                train.show();
                flightTransfer.show();
                break;
        }
    });
        
});