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

    var data = {"OkPercent": 98.53090172239108, "KoPercent": 1.4690982776089159};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9350551654964895, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.475, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.575, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-12"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-10"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-2"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-5"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-0"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-1"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [0.8947368421052632, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [0.9958333333333333, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [0.35, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [0.45, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [0.85, 1500, 3000, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-1"], "isController": false}, {"data": [0.9210526315789473, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-4"], "isController": false}, {"data": [0.8947368421052632, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-0"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-5"], "isController": false}, {"data": [0.8947368421052632, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-7"], "isController": false}, {"data": [0.9736842105263158, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-8"], "isController": false}, {"data": [0.8947368421052632, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-12"], "isController": false}, {"data": [0.8947368421052632, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-11"], "isController": false}, {"data": [0.8375, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-10"], "isController": false}, {"data": [0.9916666666666667, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}, {"data": [0.9958333333333333, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [0.875, 1500, 3000, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1974, 29, 1.4690982776089159, 1024.60587639311, 155, 69773, 511.0, 1085.5, 2317.25, 21327.0, 11.242738352887573, 142.23348598217336, 15.28602858205661], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 4, 20.0, 6589.55, 1167, 28764, 2022.0, 27227.10000000001, 28709.25, 28764.0, 0.3267600111098404, 5.767250375774013, 3.5578070369810644], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 3, 15.0, 8210.2, 1193, 69773, 1694.0, 30280.900000000005, 67812.94999999998, 69773.0, 0.16587599110904686, 2.0914710841862125, 1.9140615280703646], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-12", 20, 0, 0.0, 550.6999999999999, 261, 742, 590.5, 686.8000000000001, 739.3, 742.0, 0.32638140931492543, 0.09448805546036099, 0.28677897756943765], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 1, 5.0, 1005.9, 267, 9958, 589.5, 728.1000000000001, 9496.949999999993, 9958.0, 0.3263388049472963, 0.084946883260451, 0.28398487215677315], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 0, 0.0, 620.7499999999999, 215, 1551, 602.5, 937.5000000000005, 1521.5499999999997, 1551.0, 0.32630685897017553, 0.05257874192390524, 0.29699022710957385], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 0, 0.0, 3951.25, 168, 69596, 419.0, 1717.400000000001, 66204.64999999995, 69596.0, 0.1662869780667476, 0.026794288458020853, 0.1526462493972097], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 1, 5.0, 1840.4, 162, 29832, 291.0, 636.8000000000001, 28372.34999999998, 29832.0, 0.3280893715448088, 0.08540256053248904, 0.2842907220426844], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 0, 0.0, 416.09999999999997, 168, 684, 341.0, 667.8000000000001, 683.35, 684.0, 0.32991867504660105, 0.053160724006532385, 0.2925450751389782], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-5", 20, 0, 0.0, 376.2, 174, 710, 305.0, 637.1, 706.4, 710.0, 0.3280893715448088, 0.05286596318837251, 0.2909229974244984], "isController": false}, {"data": ["Test", 20, 11, 55.0, 43552.049999999996, 16642, 114873, 34124.0, 82698.80000000002, 113306.44999999998, 114873.0, 0.15521081508959544, 98.6275908080275, 11.441545606272845], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-0", 20, 0, 0.0, 448.49999999999994, 176, 1047, 407.5, 747.8000000000001, 1032.1, 1047.0, 0.3298207424264912, 3.3803888328880753, 0.2840838816603176], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 1, 5.0, 1668.1000000000001, 170, 26613, 288.5, 646.1, 25314.74999999998, 26613.0, 0.26302984073543145, 0.06846738676565356, 0.22010768606073358], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 20, 0, 0.0, 1270.2499999999998, 650, 3355, 1176.0, 1523.5000000000002, 3264.1499999999987, 3355.0, 1.0826611811833486, 203.3161045004872, 0.9494431061549289], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 20, 0, 0.0, 842.9, 374, 1297, 837.0, 1078.3, 1286.1499999999999, 1297.0, 1.1919661481613923, 62.579037599082184, 1.044134409082782], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 20, 0, 0.0, 308.75, 187, 802, 294.0, 494.7000000000004, 787.4499999999998, 802.0, 1.202573507305634, 14.687251029703566, 1.0569493716553424], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-6", 20, 0, 0.0, 407.4999999999999, 160, 683, 346.0, 668.2, 682.4, 683.0, 0.3280893715448088, 0.05286596318837251, 0.28739859987860694], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 20, 0, 0.0, 736.35, 354, 1277, 752.5, 1063.2, 1266.3999999999999, 1277.0, 1.159285879897983, 91.49414741769071, 1.0449422530721078], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 0, 0.0, 594.8, 170, 810, 611.0, 786.1000000000001, 809.15, 810.0, 0.32747695380937564, 0.05276728259623729, 0.29709579110245116], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 0, 0.0, 274.95000000000005, 166, 620, 273.5, 572.4000000000005, 619.05, 620.0, 1.2110936175366356, 4.7557304597614145, 1.0289564914617901], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 0, 0.0, 791.95, 360, 4434, 608.0, 810.3000000000003, 4253.499999999997, 4434.0, 0.32630153524872335, 0.05257788409769468, 0.2963480740051882], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 20, 0, 0.0, 341.25000000000006, 197, 1083, 306.0, 663.8000000000005, 1063.1999999999998, 1083.0, 1.1579434923575729, 17.544031253618574, 1.024508597730431], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-9", 20, 0, 0.0, 583.5500000000002, 257, 1131, 603.0, 694.9000000000001, 1109.4499999999998, 1131.0, 0.32630685897017553, 0.05257874192390524, 0.3043193850747243], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 20, 0, 0.0, 589.45, 281, 716, 619.5, 681.9000000000001, 714.4, 716.0, 1.1417480162128217, 3.8842847305474684, 0.9767297482445625], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 19, 1, 5.2631578947368425, 1319.684210526316, 190, 10021, 620.0, 5274.0, 10021.0, 10021.0, 0.44669096038556483, 0.11860636828494182, 0.3876403256142001], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 1, 5.0, 1975.85, 208, 27255, 658.5, 944.4000000000001, 25939.54999999998, 27255.0, 0.5878894767783657, 11.65298560589359, 0.4919555592298647], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 0, 0.0, 419.83333333333326, 273, 2324, 323.5, 679.5, 708.55, 2079.139999999991, 0.699741095794556, 2.0029861086814544, 0.2938365929606046], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 19, 0, 0.0, 686.157894736842, 490, 1190, 645.0, 977.0, 1190.0, 1190.0, 0.4436971650086404, 0.07149417209611882, 0.40383374783989534], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 20, 0, 0.0, 584.8, 291, 698, 611.5, 676.5, 697.0, 698.0, 1.1442956860052638, 4.763801278750429, 0.9666169613228057], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 0, 0.0, 905.9, 188, 5035, 622.0, 1996.8000000000006, 4884.799999999997, 5035.0, 1.011020119300374, 1.0617685901324436, 0.8648961176827419], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 20, 0, 0.0, 686.65, 248, 874, 742.5, 859.3000000000001, 873.3, 874.0, 1.167269756040621, 38.91659128049492, 0.990583416014941], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 0, 0.0, 1095.6000000000001, 221, 8783, 775.5, 892.1, 8388.499999999995, 8783.0, 1.0850694444444444, 29.32972378200955, 0.922944810655382], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 20, 0, 0.0, 1121.2, 349, 6686, 839.0, 1793.000000000002, 6446.249999999996, 6686.0, 0.9861932938856016, 33.61050758136094, 0.8378790680473372], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 3, 15.0, 6936.55, 1275, 29370, 2793.5, 23481.900000000005, 29085.799999999996, 29370.0, 0.4731935834950078, 15.4304314860053, 6.294606813100365], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 20, 0, 0.0, 664.8999999999999, 506, 1595, 632.5, 711.3000000000001, 1550.8499999999995, 1595.0, 1.0723860589812333, 5.3756492962466496, 0.9100619973190349], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 20, 0, 0.0, 801.8, 339, 1220, 834.0, 1192.4, 1218.9, 1220.0, 1.135524896383353, 58.87058963904502, 1.0068912167149264], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 1, 5.0, 1943.55, 261, 28144, 596.5, 729.1000000000001, 26773.44999999998, 28144.0, 0.4873769373233259, 0.12686554945657472, 0.4214097073301491], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 20, 0, 0.0, 449.0, 174, 666, 523.5, 654.0, 665.4, 666.0, 1.1469205184080744, 6.412898554880147, 0.97443442481936], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 2, 10.0, 2737.7000000000003, 166, 23131, 617.5, 19146.000000000044, 23033.449999999997, 23131.0, 0.4876145894285157, 0.17528411168812172, 0.4092819722791106], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 19, 0, 0.0, 761.7368421052632, 214, 3978, 590.0, 1250.0, 3978.0, 3978.0, 0.44669096038556483, 1.7889449497472671, 0.3821301575173387], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 20, 0, 0.0, 388.24999999999994, 172, 794, 323.0, 669.7000000000002, 788.05, 794.0, 0.4846957322540775, 4.8035051074812785, 0.4364154932990815], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 0, 0.0, 591.25, 176, 1939, 549.0, 1022.9000000000008, 1895.0999999999995, 1939.0, 0.485601903559462, 0.07824640047588986, 0.44481893119021026], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 3, 15.0, 4643.250000000001, 1070, 21221, 1837.0, 11432.7, 20734.049999999996, 21221.0, 0.16360185851711273, 2.407527564356881, 1.7924868274941104], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 20, 0, 0.0, 310.1000000000001, 163, 692, 274.0, 669.6000000000004, 691.75, 692.0, 0.49044851516712035, 1.561149350768778, 0.41956337820937245], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 20, 0, 0.0, 1113.15, 182, 8661, 336.5, 3630.700000000001, 8412.599999999997, 8661.0, 0.49206544470414565, 5.97717758180588, 0.42046607823840565], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 20, 0, 0.0, 284.20000000000005, 169, 598, 273.0, 533.3000000000002, 595.1999999999999, 598.0, 0.49208965873582167, 0.07929179071426813, 0.4517229289176488], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 20, 0, 0.0, 704.1, 165, 5574, 284.0, 2195.3000000000025, 5410.849999999998, 5574.0, 0.49340076477118533, 0.07950305291723203, 0.43461668928086844], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 20, 0, 0.0, 319.40000000000003, 164, 684, 272.5, 596.8000000000002, 679.9499999999999, 684.0, 0.4927322000492732, 0.37255654871889626, 0.4488241792929293], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 20, 0, 0.0, 329.90000000000003, 179, 620, 286.5, 610.6, 619.6, 620.0, 0.4919323101141283, 2.313859347328808, 0.44149003222156635], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 0, 0.0, 429.54999999999995, 161, 1726, 288.0, 725.3000000000001, 1676.1999999999994, 1726.0, 0.4876145894285157, 0.0785707102106495, 0.43237699921981665], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 0, 0.0, 528.85, 169, 4542, 265.5, 620.3000000000001, 4345.999999999997, 4542.0, 0.49314528059966467, 0.07946188603412566, 0.43728116678173395], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 19, 0, 0.0, 318.7368421052631, 161, 735, 278.0, 614.0, 735.0, 735.0, 0.4523594114565973, 0.07288994422884625, 0.4126012600590448], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 19, 0, 0.0, 375.47368421052636, 160, 682, 290.0, 618.0, 682.0, 682.0, 0.15661707126076743, 0.025236149177760375, 0.13795761550509006], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 19, 0, 0.0, 713.3157894736842, 179, 4292, 312.0, 2791.0, 4292.0, 4292.0, 0.41558214309149366, 0.06696391954110982, 0.3685044784444104], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-2", 19, 0, 0.0, 469.15789473684214, 191, 1202, 301.0, 698.0, 1202.0, 1202.0, 0.15713907635305013, 0.02532026132641921, 0.144248761495964], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 19, 0, 0.0, 461.78947368421046, 165, 1392, 293.0, 1127.0, 1392.0, 1392.0, 0.44373861460133585, 0.07150085098556683, 0.3934713496660283], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-3", 19, 0, 0.0, 481.2105263157894, 155, 698, 611.0, 695.0, 698.0, 698.0, 0.15664160401002505, 0.025240102208646614, 0.14287427553258145], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 19, 0, 0.0, 431.5263157894737, 172, 1018, 309.0, 683.0, 1018.0, 1018.0, 0.45232710391620046, 0.07288473842399713, 0.3962279416140935], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-4", 19, 0, 0.0, 439.63157894736844, 165, 735, 558.0, 679.0, 735.0, 735.0, 0.15664160401002505, 0.025240102208646614, 0.1388970473057644], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 19, 0, 0.0, 791.1052631578948, 194, 4240, 350.0, 3489.0, 4240.0, 4240.0, 0.45486102798592326, 5.5595866076344835, 0.3917845963706878], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 0, 0.0, 299.2999999999999, 262, 376, 299.0, 335.79999999999995, 355.0, 376.0, 0.9627650612559271, 0.36583191927214964, 0.4404838195296893], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 19, 1, 5.2631578947368425, 1854.1052631578948, 176, 28410, 285.0, 749.0, 28410.0, 28410.0, 0.31219191587249423, 0.0828938855570161, 0.2605236403220506], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 19, 0, 0.0, 423.7368421052632, 173, 1141, 317.0, 702.0, 1141.0, 1141.0, 0.45099575114529183, 0.07267021380759098, 0.41400000593415465], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-0", 19, 0, 0.0, 406.6842105263157, 196, 892, 325.0, 841.0, 892.0, 892.0, 0.15710789177746906, 2.046851937698452, 0.13532144584739034], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 19, 0, 0.0, 753.7368421052631, 275, 3578, 595.0, 774.0, 3578.0, 3578.0, 0.15611391385798565, 0.02515507401031995, 0.14559451927185182], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 19, 0, 0.0, 655.7368421052632, 501, 953, 632.0, 819.0, 953.0, 953.0, 0.44562234678800106, 0.07180438205080095, 0.40428042984966106], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-5", 19, 0, 0.0, 468.7894736842105, 162, 705, 586.0, 693.0, 705.0, 705.0, 0.15667131183363156, 0.025244889113817587, 0.13892338978997798], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 19, 2, 10.526315789473685, 2204.0, 501, 27077, 637.0, 3422.0, 27077.0, 27077.0, 0.38317266970515873, 0.1626553802988747, 0.31136718277336345], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-6", 19, 0, 0.0, 643.4736842105262, 162, 4039, 580.0, 735.0, 4039.0, 4039.0, 0.15666743626109042, 0.025244264631913982, 0.13723700227167784], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 19, 0, 0.0, 614.6315789473683, 321, 1066, 610.0, 773.0, 1066.0, 1066.0, 0.4495126336708621, 0.07243123491766822, 0.4192232081598372], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 19, 0, 0.0, 791.3157894736844, 269, 4915, 594.0, 751.0, 4915.0, 4915.0, 0.1565718994643593, 0.02522887051915946, 0.14204618613514627], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 19, 0, 0.0, 666.7894736842106, 277, 2315, 595.0, 781.0, 2315.0, 2315.0, 0.15607928827844547, 0.025149494693304197, 0.14175169736226], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 19, 1, 5.2631578947368425, 1443.0526315789477, 200, 10941, 617.0, 6274.0, 10941.0, 10941.0, 0.1561601052025972, 0.04146397530204652, 0.13017087716774883], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 19, 2, 10.526315789473685, 1295.2105263157896, 264, 10017, 597.0, 5335.0, 10017.0, 10017.0, 0.1561601052025972, 0.07471702401988986, 0.127987717802252], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, 1.6666666666666667, 1623.6916666666668, 161, 27902, 314.5, 2982.000000000002, 7821.799999999985, 27787.129999999997, 0.6846501437765301, 61.24688631277386, 2.067974393014857], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 19, 0, 0.0, 1035.263157894737, 200, 9338, 617.0, 730.0, 9338.0, 9338.0, 0.15603058199407083, 0.02514164651271649, 0.14201220939304104], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 0, 0.0, 371.8916666666669, 258, 3037, 301.0, 624.8000000000002, 662.8, 2604.3999999999837, 0.8712572241744837, 0.2849453558359713, 0.37096498998054195], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 0, 0.0, 346.9, 261, 1852, 299.5, 357.0, 706.9, 1716.339999999995, 0.9679839314667377, 0.19668475586638595, 0.47075781042034703], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 20, 0, 0.0, 896.5, 192, 7071, 612.5, 690.0, 6751.949999999995, 7071.0, 0.4873650607987913, 0.07853050296074275, 0.44215052879109096], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 0, 0.0, 696.85, 497, 2479, 592.0, 870.7000000000003, 2399.249999999999, 2479.0, 0.487769187620418, 0.07859562105211813, 0.42727437626515136], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 20, 0, 0.0, 917.1500000000001, 193, 3877, 597.0, 2994.7000000000025, 3839.2499999999995, 3877.0, 0.4879238838741156, 0.07862054769455964, 0.4431339960966089], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, 6.896551724137931, 0.10131712259371833], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 14, 48.275862068965516, 0.7092198581560284], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, 3.4482758620689653, 0.05065856129685917], "isController": false}, {"data": ["Assertion failed", 12, 41.37931034482759, 0.60790273556231], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1974, 29, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 14, "Assertion failed", 12, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 4, "Assertion failed", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 19, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 3, "Assertion failed", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 3, "Assertion failed", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 19, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 19, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 19, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 19, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
