/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.7, "KoPercent": 0.3};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9722772277227723, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.875, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.8, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-5"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [0.725, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [0.575, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-0"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-7"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-8"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-12"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-11"], "isController": false}, {"data": [0.9125, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2000, 6, 0.3, 524.6095000000003, 162, 3152, 497.5, 873.9000000000001, 1174.9499999999998, 2456.6600000000003, 18.779166392803823, 206.55404093916957, 25.801070823278653], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 0, 0.0, 1363.6000000000001, 1079, 2035, 1233.5, 1884.7000000000003, 2027.9499999999998, 2035.0, 0.7436326454731362, 10.951443112102622, 8.66433700501952], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 0, 0.0, 1406.0, 1073, 2287, 1318.0, 1887.3000000000006, 2268.45, 2287.0, 0.6523369972928015, 10.069178300009785, 7.6165440816725924], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-12", 20, 0, 0.0, 597.95, 263, 879, 604.5, 764.9000000000003, 873.9499999999999, 879.0, 0.680387821058003, 0.10963280319782276, 0.5986615495832625], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 0, 0.0, 593.05, 180, 878, 567.0, 778.8000000000001, 873.0999999999999, 878.0, 0.6755615605472048, 0.10885513426786016, 0.6188249451106232], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 0, 0.0, 568.0500000000001, 175, 979, 607.0, 723.0000000000001, 966.5499999999998, 979.0, 0.6804572672836146, 0.10964399326347306, 0.6193224346761024], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 0, 0.0, 252.45000000000002, 166, 629, 196.5, 506.50000000000045, 623.9999999999999, 629.0, 0.6803646754660497, 0.10962907368349435, 0.6245535106817254], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 0, 0.0, 324.95, 166, 782, 274.5, 685.6000000000001, 777.4, 782.0, 0.6803646754660497, 0.10962907368349435, 0.6205669989114165], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 0, 0.0, 337.75, 166, 877, 288.0, 644.0, 865.4499999999998, 877.0, 0.6778282383244086, 0.10922037043313225, 0.6010430082017216], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-5", 20, 0, 0.0, 318.55, 162, 877, 271.0, 644.0, 865.4499999999998, 877.0, 0.6803646754660497, 0.10962907368349435, 0.6032921145734114], "isController": false}, {"data": ["Test", 20, 1, 5.0, 17107.0, 14707, 19820, 16933.0, 19343.0, 19796.25, 19820.0, 0.5475701574264202, 307.053361353525, 41.25181810403833], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-0", 20, 0, 0.0, 346.25, 190, 774, 311.5, 570.7000000000003, 764.4999999999999, 774.0, 0.6752422431547318, 9.117089115095041, 0.5816051352172592], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 0, 0.0, 339.80000000000007, 171, 877, 268.0, 697.4000000000002, 868.3999999999999, 877.0, 0.6803646754660497, 0.10962907368349435, 0.5993056028031024], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 20, 0, 0.0, 1118.8, 721, 1268, 1173.0, 1256.3, 1267.45, 1268.0, 1.0398793739926169, 162.62535420891177, 0.911925466645869], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 20, 0, 0.0, 741.3499999999999, 255, 912, 802.5, 909.4, 911.9, 912.0, 1.0687186063909373, 37.56086686437961, 0.9361724511061238], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 20, 0, 0.0, 297.59999999999997, 196, 696, 290.0, 595.0000000000006, 692.3, 696.0, 1.0932546190007653, 9.88098257967093, 0.9608683174811413], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-6", 20, 0, 0.0, 331.55, 166, 978, 271.0, 745.7000000000003, 966.9499999999998, 978.0, 0.6778282383244086, 0.10922037043313225, 0.5937616501728462], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 20, 0, 0.0, 895.8000000000001, 418, 1444, 989.0, 1174.8000000000002, 1431.0499999999997, 1444.0, 1.0473397570171763, 74.53203141364683, 0.9440376911395056], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 0, 0.0, 576.4, 273, 781, 568.5, 720.8000000000002, 778.4499999999999, 781.0, 0.6723819129265423, 0.10834278870398385, 0.6100027315515213], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 0, 0.0, 282.95000000000005, 170, 708, 276.0, 612.5000000000007, 704.9499999999999, 708.0, 1.07671601615074, 3.0628049293405115, 0.9147880215343204], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 0, 0.0, 592.5000000000002, 498, 780, 573.0, 766.7000000000003, 779.95, 780.0, 0.6778741865509761, 0.10922777420010846, 0.6156474545824294], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 20, 0, 0.0, 344.0, 182, 778, 317.5, 727.4000000000005, 776.85, 778.0, 1.0662685930585913, 22.720528086181158, 0.9433977981553553], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-9", 20, 0, 0.0, 599.2, 276, 1055, 577.0, 824.6000000000003, 1044.0499999999997, 1055.0, 0.6786102062975027, 0.10934637113192182, 0.6328835420059717], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 20, 0, 0.0, 527.0500000000001, 188, 758, 566.0, 697.2, 755.0, 758.0, 1.0839520893176522, 1.362826286515636, 0.9272871389084603], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 20, 0, 0.0, 565.4000000000002, 201, 648, 582.0, 637.6, 647.5, 648.0, 0.7635336336565626, 0.1230303218294266, 0.6994087386424372], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 0, 0.0, 731.5500000000001, 325, 869, 797.0, 866.0, 868.85, 869.0, 1.0588733587462937, 12.830360215480727, 0.9327185249894112], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 0, 0.0, 416.35000000000014, 282, 987, 315.0, 681.0, 699.75, 935.549999999998, 1.1611592239585853, 3.323591489670521, 0.48759615849823407], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 20, 0, 0.0, 573.0, 505, 667, 551.0, 633.3000000000001, 665.35, 667.0, 0.767489159215626, 0.12366768678767412, 0.6985350550673471], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 20, 0, 0.0, 592.9, 291, 718, 636.0, 704.1, 717.35, 718.0, 1.06332075070445, 4.426695664309639, 0.8982152825774895], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 0, 0.0, 636.0500000000001, 192, 950, 649.5, 761.3000000000002, 940.8499999999999, 950.0, 1.062642792625259, 1.0827748924074172, 0.9090577015036395], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 20, 0, 0.0, 752.9000000000002, 428, 961, 801.5, 928.7, 959.4499999999999, 961.0, 1.0607265977194378, 35.36445902943516, 0.9001673959162025], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 0, 0.0, 810.0500000000001, 446, 1138, 838.5, 1036.8000000000004, 1133.6999999999998, 1138.0, 1.0582570506376, 28.60497744589661, 0.9001385655325678], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 20, 0, 0.0, 761.5000000000001, 341, 974, 848.5, 956.1, 973.15, 974.0, 1.057138326550029, 36.028389119403776, 0.8981546329087161], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 0, 0.0, 1631.8999999999999, 1277, 2091, 1535.0, 2015.7, 2087.3, 2091.0, 0.6429627724554748, 23.240812413601876, 8.642951721532823], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 20, 0, 0.0, 666.3500000000001, 507, 1195, 636.5, 816.9000000000001, 1176.3499999999997, 1195.0, 1.0260619741432382, 8.054436194977427, 0.8707498589164785], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 20, 0, 0.0, 826.3, 387, 982, 848.5, 941.8, 980.0, 982.0, 1.0511931041732365, 29.2001221190739, 0.9321126353411122], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 0, 0.0, 562.05, 170, 800, 606.5, 665.3000000000001, 793.3499999999999, 800.0, 0.6753334458889076, 0.10881837751139625, 0.6146589566098262], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 20, 0, 0.0, 459.34999999999997, 194, 750, 536.5, 713.5, 748.1999999999999, 750.0, 1.0685473099321472, 6.059518919965807, 0.9078478121493829], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 0, 0.0, 517.8, 188, 673, 537.5, 657.8000000000001, 672.3, 673.0, 0.6767044493317544, 0.10903929115208932, 0.631106200304517], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 20, 0, 0.0, 600.95, 281, 916, 617.5, 711.8000000000001, 905.9499999999998, 916.0, 0.7604562737642585, 2.6432910527566538, 0.6505465779467681], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 20, 0, 0.0, 418.70000000000005, 175, 1000, 396.0, 685.0000000000001, 984.4499999999998, 1000.0, 0.6766357669666418, 6.678771662916977, 0.609236501116449], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 0, 0.0, 548.9000000000001, 263, 656, 574.0, 651.4, 655.8, 656.0, 0.6844861220438755, 0.11029317396214791, 0.626999982887847], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 1, 5.0, 1779.45, 1043, 2536, 1752.0, 2485.8, 2533.65, 2536.0, 0.4327224734416582, 9.801396442750816, 4.953996192042234], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 20, 0, 0.0, 350.65000000000003, 192, 807, 288.5, 612.5, 797.2999999999998, 807.0, 0.6780580417683754, 4.529745558719827, 0.5800574654190399], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 20, 0, 0.0, 394.79999999999995, 187, 789, 338.0, 701.4000000000001, 784.8499999999999, 789.0, 0.6693888479817927, 8.11947754200415, 0.571987541000067], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 20, 0, 0.0, 317.0, 173, 695, 271.5, 639.8, 692.25, 695.0, 0.6699269779594024, 0.10794721812822403, 0.6149720305486702], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 20, 0, 0.0, 302.0999999999999, 174, 643, 280.0, 600.7000000000002, 641.15, 643.0, 0.6729701537736802, 0.10843757360611056, 0.5927920690467378], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 20, 0, 0.0, 343.29999999999995, 174, 842, 273.0, 693.7, 834.8, 842.0, 0.6722915055968268, 0.1083282211166762, 0.6132033849877307], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 20, 0, 0.0, 302.5, 181, 695, 300.5, 482.50000000000034, 685.1499999999999, 695.0, 0.6776674685731711, 3.8581382568698537, 0.6081800816589299], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 0, 0.0, 323.0, 173, 818, 279.5, 565.9, 805.3999999999999, 818.0, 0.671614224789281, 0.10821908895530408, 0.5955329258873703], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 0, 0.0, 291.80000000000007, 174, 698, 210.5, 670.0000000000003, 697.35, 698.0, 0.6722689075630253, 0.10832457983193278, 0.5961134453781513], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 20, 0, 0.0, 310.9, 169, 627, 218.0, 621.0, 626.8, 627.0, 0.7743234348987572, 0.1247689128498974, 0.7062676642533586], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 20, 0, 0.0, 442.75, 166, 649, 519.0, 644.3000000000001, 648.8, 649.0, 0.4533913674283641, 0.0730562261969532, 0.3993740365433442], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 20, 0, 0.0, 304.74999999999994, 171, 633, 276.5, 609.5000000000002, 632.25, 633.0, 0.771366862079605, 0.12429251195618636, 0.6839854597346497], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-2", 20, 0, 0.0, 445.85, 164, 940, 297.5, 856.6000000000004, 936.6999999999999, 940.0, 0.4474172837296705, 0.07209360528847229, 0.4107150846737209], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 20, 0, 0.0, 295.70000000000005, 165, 633, 217.0, 628.8000000000001, 632.85, 633.0, 0.7741735697143299, 0.12474476465123481, 0.6864742200201285], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-3", 20, 0, 0.0, 463.3, 164, 928, 541.0, 829.5000000000003, 923.8499999999999, 928.0, 0.44974139869574997, 0.07246809646953002, 0.4102133460760063], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 20, 0, 0.0, 326.05000000000007, 169, 634, 275.5, 626.5, 633.65, 634.0, 0.7743234348987572, 0.1247689128498974, 0.6782891807658059], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-4", 20, 0, 0.0, 512.9000000000001, 176, 940, 556.0, 829.5000000000003, 935.2499999999999, 940.0, 0.4501159048454977, 0.07252844169873743, 0.3991262124997187], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 20, 0, 0.0, 350.50000000000006, 200, 887, 288.0, 625.4000000000003, 874.5499999999998, 887.0, 0.7707723138584861, 7.305815055591953, 0.6638878718976414], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 0, 0.0, 285.42499999999995, 263, 325, 284.5, 300.7, 314.84999999999997, 325.0, 1.4896469536719799, 0.328806106155966, 0.6815425759719946], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 20, 0, 0.0, 308.6, 171, 623, 277.0, 621.6, 622.95, 623.0, 0.771366862079605, 0.12429251195618636, 0.6794657320271521], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 20, 0, 0.0, 288.6499999999999, 169, 634, 275.0, 611.7000000000003, 633.4, 634.0, 0.7743534148985597, 0.12477374361158433, 0.7108322363326622], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-0", 20, 0, 0.0, 494.6, 258, 1175, 463.0, 937.3000000000002, 1163.5499999999997, 1175.0, 0.4525808422529474, 9.0263801594216, 0.38982060826865195], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 1, 5.0, 616.8000000000001, 270, 1104, 620.5, 1003.3000000000006, 1100.35, 1104.0, 0.4412770557994837, 0.13929961746795225, 0.3909654383535953], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 20, 0, 0.0, 565.8, 278, 841, 567.5, 720.6000000000001, 835.3499999999999, 841.0, 0.764525993883792, 0.1231902236238532, 0.6935982893730887], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-5", 20, 0, 0.0, 552.25, 179, 927, 601.5, 869.1000000000001, 924.3499999999999, 927.0, 0.4474172837296705, 0.07209360528847229, 0.3967332945571687], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 20, 0, 0.0, 496.9, 168, 643, 538.5, 638.0, 642.75, 643.0, 0.764525993883792, 0.1231902236238532, 0.6943448967889908], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-6", 20, 0, 0.0, 552.85, 169, 927, 612.5, 871.1, 924.3499999999999, 927.0, 0.4474172837296705, 0.07209360528847229, 0.39192705420460394], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 20, 0, 0.0, 548.5499999999998, 166, 993, 545.5, 646.9, 975.6999999999998, 993.0, 0.7621079907022825, 0.12280060397058264, 0.7107550108600389], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 20, 0, 0.0, 572.7, 260, 874, 573.5, 802.7000000000004, 871.4, 874.0, 0.44634886627387965, 0.07192144817889663, 0.40493954762542406], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 1, 5.0, 611.4, 295, 1103, 594.0, 1030.1000000000008, 1101.25, 1103.0, 0.4412770557994837, 0.13929961746795225, 0.38073074101449594], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 1, 5.0, 656.35, 200, 1134, 625.5, 1072.8000000000004, 1131.85, 1134.0, 0.43910685665356664, 0.138614542395767, 0.36704444721935586], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 20, 1, 5.0, 645.65, 200, 1152, 606.0, 1067.2000000000005, 1148.95, 1152.0, 0.4388274530454625, 0.13852634198920485, 0.3818741634851676], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 0, 0.0, 728.4083333333336, 165, 3152, 286.0, 2567.1, 2770.7999999999997, 3102.019999999998, 1.129815840018077, 84.92460097493692, 3.4291676081798665], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 20, 1, 5.0, 635.2499999999999, 296, 1144, 606.0, 1075.6000000000006, 1141.8, 1144.0, 0.43890449438202245, 0.1385506619228406, 0.37949808527914325], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 0, 0.0, 290.55000000000007, 259, 600, 285.0, 307.70000000000005, 315.95, 559.0499999999985, 1.7301786409446775, 0.5657436343844169, 0.736677624464726], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 0, 0.0, 290.55833333333334, 260, 453, 286.5, 309.8, 330.5999999999999, 441.65999999999957, 3.8757186228279825, 0.7873815079775208, 1.884870970867515], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 20, 0, 0.0, 581.2499999999998, 520, 673, 575.5, 651.1, 671.9499999999999, 673.0, 0.6723593088146306, 0.10833914643985747, 0.6099822245007732], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 0, 0.0, 567.1999999999999, 274, 1028, 560.5, 714.2000000000002, 1012.5999999999998, 1028.0, 0.6782419967444384, 0.1092870404910472, 0.5941240928513294], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 20, 0, 0.0, 571.5500000000001, 185, 896, 596.5, 687.1, 885.6499999999999, 896.0, 0.6744907594765951, 0.1086825930797248, 0.612574615540267], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, 83.33333333333333, 0.25], "isController": false}, {"data": ["Assertion failed", 1, 16.666666666666668, 0.05], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2000, 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 5, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
