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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9712871287128713, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.775, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.8, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-5"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-6"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [0.7, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [0.5, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-11"], "isController": false}, {"data": [0.8958333333333334, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2000, 0, 0.0, 559.0155000000013, 154, 3893, 509.0, 906.7000000000003, 1295.8999999999996, 2439.91, 21.623959346956426, 233.4087215509785, 29.807909976754246], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 0, 0.0, 1523.7, 1001, 2454, 1391.0, 2101.8000000000006, 2437.6499999999996, 2454.0, 0.6830367815306855, 10.844809774256344, 7.958312344182234], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 0, 0.0, 1526.25, 1133, 2431, 1378.5, 2179.3000000000006, 2419.6, 2431.0, 0.5594718585655141, 9.981600806338816, 6.532271036141882], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-12", 20, 0, 0.0, 580.45, 217, 853, 608.0, 720.6, 846.3999999999999, 853.0, 0.5716735743890239, 0.09211537087323139, 0.5030057524653423], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 0, 0.0, 601.3999999999999, 301, 871, 625.0, 700.1, 862.4999999999999, 871.0, 0.5691681607330886, 0.09171166652437462, 0.5213669284840206], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 0, 0.0, 604.8500000000001, 331, 778, 603.0, 733.8, 775.8, 778.0, 0.5715102157451065, 0.09208904843549079, 0.5201635947992571], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 0, 0.0, 355.34999999999997, 176, 697, 288.5, 682.3000000000001, 696.3, 697.0, 0.5752746936662256, 0.09269562935051487, 0.528084191451418], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 0, 0.0, 340.5, 185, 783, 298.5, 664.2000000000002, 777.4999999999999, 783.0, 0.5769674590353103, 0.0929683893953381, 0.5262574284560351], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 0, 0.0, 296.2, 171, 677, 212.0, 600.3000000000001, 673.25, 677.0, 0.5769674590353103, 0.0929683893953381, 0.5116078640664666], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-5", 20, 0, 0.0, 349.80000000000007, 185, 773, 293.0, 754.9000000000001, 772.4, 773.0, 0.5769674590353103, 0.0929683893953381, 0.5116078640664666], "isController": false}, {"data": ["Test", 20, 0, 0.0, 18500.85, 16033, 21652, 18232.0, 20881.8, 21614.899999999998, 21652.0, 0.5493750858398572, 302.4615652039555, 41.512691422881474], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-0", 20, 0, 0.0, 420.45, 202, 874, 337.0, 818.2, 871.25, 874.0, 0.5747456750387954, 9.136435642853037, 0.49504461463302485], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 0, 0.0, 364.95000000000005, 171, 790, 288.5, 766.3000000000002, 789.2, 790.0, 0.5754071005236204, 0.09271696443984118, 0.5068527389377985], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 20, 0, 0.0, 1142.65, 635, 1443, 1208.0, 1338.2, 1437.8, 1443.0, 1.0962508221881166, 171.4741832931375, 0.9613605843016882], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 20, 0, 0.0, 784.0500000000001, 366, 1043, 852.0, 943.1, 1038.1, 1043.0, 1.1098779134295227, 38.96034570962819, 0.9722270394006659], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 20, 0, 0.0, 278.55, 193, 352, 311.0, 348.20000000000005, 351.85, 352.0, 1.1445576284765937, 10.274416633283735, 1.0059588531532562], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-6", 20, 0, 0.0, 363.1, 177, 770, 289.0, 714.2000000000003, 767.6999999999999, 770.0, 0.577100646352724, 0.09298985024238228, 0.5055266404085873], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 20, 0, 0.0, 999.15, 522, 1508, 1041.5, 1211.0000000000002, 1493.5499999999997, 1508.0, 1.1062558769843465, 78.63351039189114, 0.9971427484927263], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 0, 0.0, 613.5000000000001, 192, 806, 656.0, 779.6, 804.6999999999999, 806.0, 0.5715265474081271, 0.09415676615991313, 0.5185040649825684], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 0, 0.0, 322.0, 166, 672, 302.0, 638.3000000000002, 670.85, 672.0, 1.1337225780851425, 4.40856438835667, 0.9632213309903068], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 0, 0.0, 626.05, 241, 805, 656.0, 767.4, 803.15, 805.0, 0.5694922976166746, 0.0959905962584356, 0.5172146843588941], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 20, 0, 0.0, 364.2, 207, 868, 354.5, 806.700000000001, 867.2, 868.0, 1.1364927832708263, 17.21370370567678, 1.0055297476986023], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-9", 20, 0, 0.0, 551.1, 161, 805, 602.5, 797.1000000000001, 804.85, 805.0, 0.5711511551532114, 0.09203119199246079, 0.532665383956364], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 20, 0, 0.0, 607.0, 175, 798, 624.5, 792.8000000000001, 797.9, 798.0, 1.1010184420589044, 1.3729398912744288, 0.9418868703550785], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 20, 0, 0.0, 613.9999999999999, 201, 1082, 640.0, 968.3000000000004, 1077.25, 1082.0, 0.70212392487274, 0.11313520273828331, 0.643156485869756], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 0, 0.0, 663.1, 237, 1023, 673.0, 942.5000000000002, 1019.5999999999999, 1023.0, 1.1179429849077698, 13.560353636808273, 0.9847505589714924], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 0, 0.0, 436.76666666666677, 272, 1451, 337.5, 716.5, 799.6499999999999, 1330.0399999999954, 1.3545852711428183, 3.8774562440736897, 0.5688199869056757], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 20, 0, 0.0, 643.3000000000001, 193, 1149, 613.5, 940.8000000000001, 1138.6999999999998, 1149.0, 0.6992518005733864, 0.11267240927207887, 0.6364283966156212], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 20, 0, 0.0, 649.3000000000001, 520, 795, 656.5, 766.0, 793.6, 795.0, 1.101382234704554, 4.585148893110855, 0.9303668291205464], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 0, 0.0, 617.7499999999999, 296, 809, 631.0, 778.0, 807.5, 809.0, 1.09080992637033, 1.064924495500409, 0.9331538041996181], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 20, 0, 0.0, 813.6, 437, 1240, 881.0, 927.4, 1224.3999999999996, 1240.0, 1.0932546190007653, 36.44893817645129, 0.9277717421012354], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 0, 0.0, 804.8499999999999, 470, 999, 842.0, 901.5, 994.15, 999.0, 1.0915838882218099, 29.505810978604956, 0.9284859049230434], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 20, 0, 0.0, 775.8499999999998, 442, 985, 805.0, 929.1, 982.25, 985.0, 1.0949304719150335, 37.31638529234644, 0.9302631939121867], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 0, 0.0, 1654.05, 1018, 2303, 1640.0, 2144.2000000000003, 2295.5, 2303.0, 0.832674132978059, 25.378224335421958, 11.193124453557601], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 20, 0, 0.0, 719.5999999999999, 526, 1530, 667.5, 880.5, 1497.6499999999996, 1530.0, 1.0336985734959685, 7.400433830370065, 0.8772305277031218], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 20, 0, 0.0, 783.3999999999999, 285, 1020, 859.0, 1009.0000000000001, 1019.8, 1020.0, 1.0811395210551922, 30.218166353586682, 0.9586666846856587], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 0, 0.0, 582.15, 185, 885, 591.0, 701.6, 875.9499999999998, 885.0, 0.8960573476702509, 0.14438424059139784, 0.8155521953405018], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 20, 0, 0.0, 471.6, 206, 751, 449.5, 725.4000000000001, 749.8, 751.0, 1.088494611951671, 6.174336868673126, 0.9247952269511267], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 0, 0.0, 545.1, 178, 812, 569.5, 687.9, 805.8, 812.0, 0.8967403488319957, 0.14449429448953055, 0.8363154620454647], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 20, 0, 0.0, 548.0500000000001, 180, 1202, 599.5, 816.1000000000003, 1183.3999999999996, 1202.0, 0.6995452955578874, 2.100753650752011, 0.5984391395592865], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 20, 0, 0.0, 426.05, 172, 685, 378.0, 669.9, 684.25, 685.0, 0.8918219923303309, 7.920102155422279, 0.8029881610630518], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 0, 0.0, 615.6499999999999, 512, 802, 611.5, 767.8000000000001, 800.4499999999999, 802.0, 0.8855435023245517, 0.1426901151206553, 0.8111716847465131], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 0, 0.0, 1934.6, 1324, 3292, 1825.0, 2390.8, 3247.5999999999995, 3292.0, 0.5751258087706687, 11.665281272465853, 6.715043134435658], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 20, 0, 0.0, 370.20000000000005, 172, 693, 311.5, 660.0, 691.35, 693.0, 0.8969012063321224, 3.4177716769810305, 0.767270953854433], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 20, 0, 0.0, 345.75, 193, 730, 304.5, 701.1000000000001, 728.75, 730.0, 0.8622919720617401, 8.075987459041132, 0.7368217534707252], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 20, 0, 0.0, 335.59999999999997, 162, 617, 295.0, 612.1, 616.9, 617.0, 0.8830411938716941, 0.14228691112190384, 0.8106042209369066], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 20, 0, 0.0, 316.25, 164, 775, 293.0, 671.0000000000002, 770.4, 775.0, 0.8786960151135714, 0.1415867602477923, 0.7740076226879311], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 20, 0, 0.0, 327.50000000000006, 164, 1056, 196.5, 734.2, 1040.1, 1056.0, 0.8830801836806782, 0.14229319365948428, 0.8054657144118686], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 20, 0, 0.0, 346.09999999999997, 180, 1012, 296.0, 681.8000000000002, 995.7999999999997, 1012.0, 0.8821453775582216, 5.861614822247707, 0.791691017554693], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 0, 0.0, 312.4, 165, 901, 250.5, 626.3000000000002, 887.6499999999999, 901.0, 0.8830801836806782, 0.14229319365948428, 0.7830437566231014], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 0, 0.0, 315.4999999999999, 172, 744, 273.5, 643.1, 739.0999999999999, 744.0, 0.87900496637806, 0.14163654243396476, 0.7794301850305454], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 20, 0, 0.0, 290.20000000000005, 167, 707, 253.0, 642.4000000000005, 705.1999999999999, 707.0, 0.710277718587968, 0.11444904645216279, 0.6478509659776972], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 20, 0, 0.0, 408.75, 163, 803, 347.5, 729.2000000000002, 799.65, 803.0, 0.5975678986524844, 0.09628779616958977, 0.5263732857270907], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 20, 0, 0.0, 333.0, 188, 603, 297.0, 574.0, 601.65, 603.0, 0.7078142695356738, 0.1140521039779162, 0.6276321843148358], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-2", 20, 0, 0.0, 555.4499999999999, 173, 1450, 559.5, 845.5000000000001, 1420.0999999999995, 1450.0, 0.5975678986524844, 0.09628779616958977, 0.5485486569661477], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 20, 0, 0.0, 354.30000000000007, 163, 877, 275.0, 692.7, 867.8999999999999, 877.0, 0.7078142695356738, 0.1140521039779162, 0.6276321843148358], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-3", 20, 0, 0.0, 562.8499999999999, 170, 1158, 598.5, 1048.1000000000001, 1152.8999999999999, 1158.0, 0.6023733510029516, 0.0970621122221553, 0.5494303806999579], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 20, 0, 0.0, 381.45, 166, 847, 287.0, 703.4000000000001, 839.9999999999999, 847.0, 0.7075137965190321, 0.11400368791566436, 0.6197655033960662], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-4", 20, 0, 0.0, 562.4000000000001, 209, 1158, 566.0, 765.8, 1138.3999999999996, 1158.0, 0.5955748786516184, 0.09596665525148149, 0.5281074119293647], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 20, 0, 0.0, 397.05000000000007, 188, 767, 349.5, 722.1000000000001, 764.9499999999999, 767.0, 0.7049700387733521, 7.823928225237927, 0.6072105216778286], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 0, 0.0, 309.7250000000001, 262, 388, 302.0, 336.7, 372.1999999999998, 388.0, 1.7751741889672923, 0.4892130430923534, 0.8121768628234145], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 20, 0, 0.0, 318.34999999999997, 156, 799, 215.0, 656.2, 791.8999999999999, 799.0, 0.710277718587968, 0.11444904645216279, 0.6256547872718232], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 20, 0, 0.0, 337.0, 170, 727, 299.5, 690.6000000000004, 726.0, 727.0, 0.710277718587968, 0.11444904645216279, 0.6520127494850486], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-0", 20, 0, 0.0, 543.35, 202, 979, 497.5, 948.3000000000003, 978.25, 979.0, 0.5968367651447329, 10.949448392270964, 0.5140722918531782], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 0, 0.0, 624.0499999999998, 183, 1011, 654.5, 929.6000000000004, 1007.65, 1011.0, 0.5916459590580997, 0.09533357738729144, 0.551779190332505], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 20, 0, 0.0, 640.9, 504, 839, 651.0, 782.8, 836.1999999999999, 839.0, 0.7019514249613927, 0.11564375526463569, 0.636828978309701], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-5", 20, 0, 0.0, 600.7999999999998, 173, 1191, 629.0, 1044.2000000000005, 1184.8999999999999, 1191.0, 0.5975857535556351, 0.09629067318035137, 0.5298904924106609], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 20, 0, 0.0, 627.7, 165, 922, 613.5, 895.7000000000002, 921.0, 922.0, 0.7038288288288288, 0.11340991870777027, 0.6392195418074325], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-6", 20, 0, 0.0, 621.6999999999998, 168, 1450, 622.0, 937.5000000000001, 1424.7499999999995, 1450.0, 0.5955926146515784, 0.09596951310303753, 0.5217251712328768], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 20, 0, 0.0, 633.6, 169, 1001, 651.0, 889.1000000000003, 995.8999999999999, 1001.0, 0.7012376845131657, 0.11299240033659408, 0.6539863170996809], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 20, 0, 0.0, 655.3, 178, 986, 644.0, 927.6, 983.15, 986.0, 0.5961962678113635, 0.09606678143444822, 0.5408850906218328], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 0, 0.0, 678.4499999999999, 191, 1334, 668.0, 1030.5000000000002, 1319.2499999999998, 1334.0, 0.590911776871713, 0.09735040699048633, 0.5366679223541926], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 0, 0.0, 663.9999999999999, 190, 1215, 641.0, 972.3000000000001, 1202.9999999999998, 1215.0, 0.5914360066240834, 0.09529974716110716, 0.520394376922167], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 20, 0, 0.0, 617.9999999999999, 156, 986, 623.5, 929.6000000000003, 983.75, 986.0, 0.5907546891153448, 0.09518996455471866, 0.5411405257716734], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 0, 0.0, 772.7333333333332, 155, 3893, 309.5, 2651.8, 2882.0499999999997, 3757.1299999999947, 1.305085483099143, 96.8306411130476, 3.9611383608126336], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 20, 0, 0.0, 677.2, 179, 955, 650.0, 941.7, 954.45, 955.0, 0.5936832106388031, 0.09566184546426026, 0.5403444846829731], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 0, 0.0, 342.1583333333334, 265, 1420, 307.0, 386.6000000000001, 587.3499999999983, 1301.5599999999954, 2.0465941262748575, 0.6693402078998534, 0.8714014053279667], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 0, 0.0, 322.1416666666665, 259, 558, 309.0, 364.0, 389.0, 541.6199999999994, 3.2852410545623782, 0.6673145892079831, 1.5977051222383443], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 20, 0, 0.0, 670.4499999999999, 539, 1040, 641.0, 873.4000000000001, 1031.9499999999998, 1040.0, 0.8842123878155533, 0.1456705369379725, 0.8021809651178213], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 0, 0.0, 567.55, 154, 751, 561.5, 718.7, 749.4499999999999, 751.0, 0.8897984606486631, 0.14337572852248964, 0.7794425968768074], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 20, 0, 0.0, 568.9, 289, 729, 581.5, 702.3000000000001, 727.6999999999999, 729.0, 0.8856219279989374, 0.14270275207014127, 0.8043246025771599], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
