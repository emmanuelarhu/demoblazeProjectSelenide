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

    var data = {"OkPercent": 99.0, "KoPercent": 1.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9346534653465347, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.425, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.55, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-11"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-10"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-4"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-5"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [0.825, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-1"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-7"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-9"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [0.425, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [0.475, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [0.875, 1500, 3000, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-2"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-4"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-0"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-9"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-5"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-6"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-11"], "isController": false}, {"data": [0.8041666666666667, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-10"], "isController": false}, {"data": [0.9875, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2000, 20, 1.0, 848.3515000000004, 154, 31323, 509.0, 1108.3000000000006, 2337.2499999999973, 10494.430000000004, 15.981078403170645, 184.94263729244574, 21.88714811662991], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 1, 5.0, 4012.4500000000003, 1237, 16148, 2305.5, 11386.100000000004, 15918.349999999997, 16148.0, 0.32160545442850713, 6.023286998697498, 3.7333870682446775], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 2, 10.0, 3587.0499999999997, 1042, 12284, 1830.5, 11159.500000000004, 12234.05, 12284.0, 0.3201946783644456, 4.800277943989945, 3.7088643645336363], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-12", 20, 0, 0.0, 1046.65, 169, 9842, 594.5, 2359.0000000000036, 9476.699999999993, 9842.0, 0.32327934568260436, 0.09390570446610416, 0.28405331179484694], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 0, 0.0, 515.7, 165, 805, 533.0, 629.5, 796.2499999999999, 805.0, 0.3227732679179511, 0.05200936445943547, 0.2956653567451544], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 1, 5.0, 879.75, 169, 4748, 577.5, 3143.900000000006, 4681.749999999999, 4748.0, 0.3228149463320152, 0.10076933358889517, 0.27912143894762326], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 1, 5.0, 836.1999999999999, 168, 10042, 285.0, 774.1000000000001, 9578.899999999994, 10042.0, 0.3248704579049104, 0.08456466851030651, 0.2833098817471533], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 0, 0.0, 367.8500000000001, 168, 819, 277.5, 628.5, 809.5499999999998, 819.0, 0.3249707526322631, 0.05236345135187833, 0.2964088700766931], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 0, 0.0, 629.0999999999999, 160, 4932, 293.5, 852.8000000000002, 4728.349999999997, 4932.0, 0.3248651809499058, 0.05234644028977974, 0.2880640471704243], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-5", 20, 0, 0.0, 445.75, 156, 1622, 290.5, 815.3000000000004, 1582.7499999999995, 1622.0, 0.3248704579049104, 0.052347290580381074, 0.2880687263453698], "isController": false}, {"data": ["Test", 20, 8, 40.0, 33356.350000000006, 16554, 56056, 35992.5, 52473.80000000002, 55927.0, 56056.0, 0.27012790556328425, 159.26489386083685, 20.291591466997122], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-0", 20, 0, 0.0, 1031.1, 175, 5094, 343.5, 3726.7000000000007, 5026.949999999999, 5094.0, 0.3248862897985705, 4.1191076287361925, 0.27983369883040937], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 0, 0.0, 383.49999999999994, 172, 721, 281.0, 681.3000000000001, 719.25, 721.0, 0.32491267971732596, 0.05235409389976444, 0.28620237998537895], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 20, 0, 0.0, 1652.7500000000002, 593, 13143, 1136.0, 1289.7, 12550.349999999991, 13143.0, 1.0127607859023697, 158.4216004468807, 0.8881437360745391], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 20, 0, 0.0, 943.5, 456, 2638, 874.0, 1101.5, 2561.199999999999, 2638.0, 1.076194575979337, 59.20094864870319, 0.9427212252475248], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 20, 0, 0.0, 313.2, 184, 827, 297.0, 603.7000000000006, 817.2999999999998, 827.0, 1.0280662074637605, 10.89398790094582, 0.9035738151536958], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-6", 20, 0, 0.0, 496.59999999999997, 161, 2083, 318.0, 1027.1000000000006, 2031.6999999999994, 2083.0, 0.32540431486121507, 0.05243331245322313, 0.2850465531547948], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 20, 0, 0.0, 753.8, 385, 1076, 885.0, 1065.6000000000001, 1075.75, 1076.0, 0.998502246630055, 71.17863244196205, 0.9000171617573639], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 0, 0.0, 595.5, 501, 801, 606.0, 727.1000000000001, 797.55, 801.0, 0.3227628499959655, 0.05200768579036553, 0.29281903090454287], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 1, 5.0, 1178.8500000000001, 170, 18601, 278.0, 466.3000000000003, 17694.949999999986, 18601.0, 0.7459346561241236, 2.8747622333283602, 0.6020654231314336], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 0, 0.0, 553.15, 166, 718, 551.5, 643.2, 714.3, 718.0, 0.32264829722361144, 0.05198922757997645, 0.2930301918144127], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 20, 0, 0.0, 382.3, 203, 1123, 314.0, 989.0000000000008, 1118.1, 1123.0, 1.0248001639680262, 15.540333892703424, 0.9067079575732733], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-9", 20, 0, 0.0, 596.3999999999999, 193, 828, 616.0, 740.7000000000002, 823.9, 828.0, 0.32484935111342117, 0.052343889583705554, 0.3029600881965988], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 20, 0, 0.0, 775.8499999999999, 181, 3205, 642.0, 1413.2000000000016, 3119.1499999999987, 3205.0, 1.0841871306987585, 3.6914242492004123, 0.9274882094649537], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 20, 0, 0.0, 610.8, 311, 851, 612.0, 759.1, 846.5, 851.0, 0.3349859305909152, 0.05397722514404395, 0.3068523465764438], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 0, 0.0, 977.55, 212, 7404, 692.0, 861.4000000000001, 7077.099999999995, 7404.0, 0.7937137868084769, 12.892151968906262, 0.6991502301769982], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 0, 0.0, 422.825, 282, 811, 324.0, 680.7, 705.3999999999999, 801.5499999999996, 0.9820690558224419, 2.8110767671105075, 0.4123922793004395], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 20, 0, 0.0, 601.8000000000001, 272, 813, 607.5, 784.6000000000003, 812.1, 813.0, 0.33618530534030355, 0.054170483770654386, 0.3059811568136357], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 20, 0, 0.0, 816.6999999999998, 300, 3031, 629.5, 2023.600000000002, 2985.3499999999995, 3031.0, 1.105460977227504, 4.60212904875083, 0.9338122512712802], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 0, 0.0, 691.55, 479, 1570, 643.0, 1197.6000000000013, 1554.1, 1570.0, 1.0905125408942202, 1.1402991241821157, 0.9328994002181025], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 20, 0, 0.0, 850.0500000000001, 471, 2479, 780.0, 1132.7000000000003, 2412.599999999999, 2479.0, 1.08084738434933, 36.03528291180285, 0.9172425556636402], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 1, 5.0, 2250.6, 400, 30362, 786.5, 910.6, 28889.549999999977, 30362.0, 0.42001806077661336, 10.830579972751329, 0.3393983831929773], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 20, 0, 0.0, 760.9999999999999, 385, 1361, 768.5, 910.9000000000001, 1338.6999999999998, 1361.0, 1.0820754206568197, 36.87827158740464, 0.9193414218471028], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 3, 15.0, 4172.799999999999, 1071, 20515, 2038.0, 10564.7, 20017.84999999999, 20515.0, 0.3309504898067249, 8.998282030836311, 4.4044371411255625], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 20, 0, 0.0, 753.2500000000001, 504, 3200, 612.0, 1080.3000000000009, 3096.0499999999984, 3200.0, 1.0503650018381387, 5.276955812457329, 0.8913742056614673], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 20, 0, 0.0, 816.1500000000001, 335, 1209, 825.0, 1195.3000000000002, 1208.5, 1209.0, 1.052299273913501, 54.50098406424287, 0.9330934967904873], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 0, 0.0, 648.6000000000001, 167, 1806, 605.5, 1414.9000000000015, 1790.1, 1806.0, 0.4035512510088781, 0.06502534806295399, 0.3672946933010492], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 20, 0, 0.0, 519.05, 183, 2257, 409.0, 687.9000000000001, 2178.699999999999, 2257.0, 1.083599718264073, 6.01434880736306, 0.9206364793845153], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 0, 0.0, 594.9499999999998, 274, 1147, 530.5, 837.8000000000001, 1131.6999999999998, 1147.0, 0.40246307401295933, 0.06485000704310379, 0.37534398015857046], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 20, 1, 5.0, 1495.75, 159, 10950, 600.0, 8141.200000000017, 10848.999999999998, 10950.0, 0.33530042918454933, 1.1591931781032054, 0.27249708707752146], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 20, 0, 0.0, 433.3499999999999, 175, 1236, 305.5, 896.9000000000003, 1219.9499999999998, 1236.0, 0.40297394773427897, 3.559176881636477, 0.36283396465918477], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 1, 5.0, 941.5, 159, 9983, 525.0, 800.3000000000004, 9524.849999999993, 9983.0, 0.3389141191622043, 0.08822027193621636, 0.2949280972514065], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 2, 10.0, 4511.95, 1233, 28439, 1811.5, 19294.800000000032, 28059.749999999993, 28439.0, 0.2859021642793836, 4.001108652650314, 3.3122072853232125], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 20, 0, 0.0, 314.65000000000003, 168, 1219, 280.0, 598.7000000000007, 1189.5499999999997, 1219.0, 0.4032827213518037, 1.2727626315709877, 0.3449957655314258], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 20, 0, 0.0, 767.8999999999999, 207, 3566, 299.5, 3068.4000000000024, 3546.1499999999996, 3566.0, 0.3989069948341544, 3.748673945888266, 0.3408629106248878], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 20, 0, 0.0, 606.9, 164, 5667, 279.5, 942.0000000000007, 5432.349999999997, 5667.0, 0.40160642570281124, 0.06471197289156627, 0.3686621485943775], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 20, 0, 0.0, 351.09999999999997, 171, 1210, 260.5, 1078.2000000000012, 1205.85, 1210.0, 0.4024225839554116, 0.06484348276625285, 0.3544777057888489], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 20, 0, 0.0, 390.49999999999994, 163, 1183, 282.5, 768.7, 1162.4999999999998, 1183.0, 0.40141297366730894, 0.06468080142100192, 0.36613253652858063], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 20, 0, 0.0, 326.25000000000006, 175, 1005, 285.0, 860.4000000000009, 999.8999999999999, 1005.0, 0.40134047719382737, 1.4984422972728915, 0.3601874009190697], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 0, 0.0, 371.1499999999999, 154, 1030, 271.5, 962.9000000000002, 1027.2, 1030.0, 0.40246307401295933, 0.06485000704310379, 0.35687155390992875], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 1, 5.0, 1297.4000000000003, 163, 20225, 277.0, 955.600000000001, 19263.849999999988, 20225.0, 0.4024306813151435, 0.10475380674272607, 0.3390006891625417], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 20, 0, 0.0, 463.40000000000003, 166, 1559, 282.5, 1185.500000000001, 1542.3999999999996, 1559.0, 0.33628140027575076, 0.054185967817869995, 0.30672541782963986], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 20, 1, 5.0, 1486.8000000000002, 173, 20568, 551.0, 744.0000000000001, 19576.949999999986, 20568.0, 0.29011154789016375, 0.07551682918957339, 0.24277010291707163], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 20, 0, 0.0, 377.65, 180, 1084, 278.5, 722.4000000000002, 1066.3999999999996, 1084.0, 0.3392130257801899, 0.054658348880597014, 0.3007865502035278], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-2", 20, 0, 0.0, 975.1500000000003, 173, 7813, 593.5, 3014.800000000005, 7585.2999999999965, 7813.0, 0.29049922291457875, 0.04680895681729052, 0.2666692085348672], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 20, 0, 0.0, 613.7500000000001, 167, 4483, 280.5, 1117.9000000000005, 4316.099999999998, 4483.0, 0.3368534519057484, 0.05427814410590673, 0.2986942718070504], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-3", 20, 0, 0.0, 542.6999999999999, 167, 2403, 540.5, 693.4000000000001, 2317.5999999999985, 2403.0, 0.29011154789016375, 0.046746489650270534, 0.26461346262637986], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 20, 0, 0.0, 563.4999999999999, 173, 3241, 292.5, 1057.6000000000006, 3133.1499999999983, 3241.0, 0.33628140027575076, 0.054185967817869995, 0.2945746250462387], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-4", 20, 0, 0.0, 598.9499999999998, 174, 3296, 504.5, 956.3000000000006, 3180.5499999999984, 3296.0, 0.2900778859123675, 0.0467410656011139, 0.2572175003988571], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 20, 0, 0.0, 654.9, 176, 3488, 442.5, 1064.7000000000005, 3368.0499999999984, 3488.0, 0.336287054629832, 4.539596092974963, 0.28965349822608577], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 0, 0.0, 291.5999999999999, 261, 421, 287.5, 310.8, 327.29999999999995, 421.0, 0.6916346785627832, 0.2627401269149635, 0.31643637393228896], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 20, 0, 0.0, 1080.95, 166, 12658, 282.5, 1871.0000000000018, 12123.149999999992, 12658.0, 0.33628140027575076, 0.054185967817869995, 0.29621662407102267], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 20, 0, 0.0, 356.79999999999995, 165, 882, 274.5, 773.9000000000003, 877.4499999999999, 882.0, 0.33628140027575076, 0.054185967817869995, 0.30869581665938056], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-0", 20, 0, 0.0, 479.15, 172, 2405, 368.0, 687.3000000000005, 2320.249999999999, 2405.0, 0.2897374978269688, 3.437081804666222, 0.24955905574549456], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 1, 5.0, 2010.6499999999996, 312, 27870, 619.5, 1473.2000000000016, 26553.89999999998, 27870.0, 0.28887540803651385, 0.07519505860559841, 0.25593966205188207], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 20, 0, 0.0, 883.3000000000001, 480, 6285, 600.0, 805.0000000000001, 6011.249999999996, 6285.0, 0.33585222502099077, 0.05411681360201512, 0.30469405961376994], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-5", 20, 0, 0.0, 467.75, 162, 680, 597.0, 679.6, 680.0, 680.0, 0.2900778859123675, 0.0467410656011139, 0.2572175003988571], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 20, 0, 0.0, 658.0, 245, 2022, 601.5, 754.0000000000001, 1958.749999999999, 2022.0, 0.32765399737876805, 0.05279581012450852, 0.29757638433813893], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-6", 20, 0, 0.0, 525.7499999999999, 275, 809, 607.0, 676.5000000000001, 802.55, 809.0, 0.2900778859123675, 0.0467410656011139, 0.2541014293587828], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 20, 0, 0.0, 756.95, 161, 4186, 584.0, 999.1000000000006, 4027.9499999999975, 4186.0, 0.33484011384563866, 0.05395372928176796, 0.3122776452368994], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 20, 0, 0.0, 614.5500000000001, 232, 858, 619.0, 785.6000000000003, 854.9499999999999, 858.0, 0.28863777402548674, 0.046509016322466123, 0.26185985553679414], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 0, 0.0, 592.2, 198, 1061, 618.0, 743.6, 1045.2999999999997, 1061.0, 0.2898130705694827, 0.04669839516012172, 0.2632091363570497], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 0, 0.0, 576.4, 270, 1285, 584.5, 827.0000000000001, 1262.2999999999997, 1285.0, 0.2901031316633063, 0.04674513351996635, 0.25525675940296777], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 20, 0, 0.0, 580.5999999999999, 188, 791, 613.5, 742.2, 788.65, 791.0, 0.2887169419101513, 0.046521772866381796, 0.2644692299919159], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, 1.6666666666666667, 1663.1083333333338, 159, 31323, 342.5, 3705.2000000000003, 6495.349999999999, 29030.219999999914, 0.9613920957546527, 79.08581313241574, 2.9043539420080275], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 20, 0, 0.0, 877.3499999999999, 271, 3691, 632.0, 2056.400000000001, 3611.749999999999, 3691.0, 0.28866693608914035, 0.04651371528780093, 0.2627320160498816], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 0, 0.0, 341.5083333333334, 256, 3055, 287.0, 347.6, 587.8499999999985, 2811.6099999999906, 1.3448241082135133, 0.4398695520615033, 0.572600889825285], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 0, 0.0, 320.7083333333335, 252, 1305, 297.0, 331.1, 423.89999999999907, 1286.7299999999993, 1.8985839727869631, 0.38571167233604936, 0.9233347836405348], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 20, 0, 0.0, 549.95, 201, 647, 546.0, 633.5, 646.35, 647.0, 0.4012841091492777, 0.06466003711878009, 0.36405560292937394], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 1, 5.0, 1052.8, 176, 10032, 583.5, 890.8000000000004, 9575.999999999993, 10032.0, 0.3988035892323031, 0.1038096647557328, 0.33187546734795614], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 20, 0, 0.0, 572.85, 277, 1130, 582.5, 637.3000000000001, 1105.4499999999996, 1130.0, 0.40159029757841047, 0.06470937412152122, 0.36472556323039235], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, 5.0, 0.05], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 9, 45.0, 0.45], "isController": false}, {"data": ["Assertion failed", 10, 50.0, 0.5], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2000, 20, "Assertion failed", 10, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 9, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
