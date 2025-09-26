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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [0.0, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [0.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [0.0, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [0.0, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [0.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [0.0, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.0, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 600, 600, 100.0, 0.755, 0, 32, 0.0, 1.0, 1.0, 6.990000000000009, 7.786848013704852, 17.815355177605024, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://api.demoblaze.com/addtocart", 120, 120, 100.0, 0.35, 0, 2, 0.0, 1.0, 1.0, 1.789999999999992, 3.2631750693424704, 7.434558043726546, 0.0], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 20, 100.0, 1.2000000000000002, 0, 7, 1.0, 5.500000000000011, 6.949999999999999, 7.0, 0.5992150283129101, 1.386679543547952, 0.0], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 20, 100.0, 1.7999999999999996, 0, 25, 1.0, 1.9000000000000021, 23.849999999999984, 25.0, 0.5752416014726185, 1.3208929097877358, 0.0], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 20, 100.0, 0.5499999999999999, 0, 1, 1.0, 1.0, 1.0, 1.0, 0.5439364682205118, 1.2392615042563029, 0.0], "isController": false}, {"data": ["Test", 20, 20, 100.0, 22.650000000000002, 7, 56, 15.0, 45.900000000000006, 55.49999999999999, 56.0, 1.0539629005059021, 72.34014347069983, 0.0], "isController": true}, {"data": ["https://api.demoblaze.com/viewcart", 40, 40, 100.0, 0.9500000000000002, 0, 5, 1.0, 1.0, 4.949999999999996, 5.0, 1.1984659635666348, 2.7519657650707097, 0.0], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 120, 100.0, 0.541666666666667, 0, 4, 0.0, 1.0, 1.0, 4.0, 1.5581177937052042, 3.568505651423081, 0.0], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 20, 100.0, 1.75, 0, 25, 1.0, 1.0, 23.799999999999983, 25.0, 0.5796429399489915, 1.3309994402822862, 0.0], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 120, 100.0, 1.2833333333333323, 0, 32, 1.0, 1.0, 1.0, 32.0, 1.5574504536074445, 3.5669772644680653, 0.0], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 120, 100.0, 0.4000000000000001, 0, 3, 0.0, 1.0, 1.0, 3.0, 2.343704224526865, 5.353708606765493, 0.0], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 192, 32.0, 32.0], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 392, 65.33333333333333, 65.33333333333333], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com: Name or service not known", 8, 1.3333333333333333, 1.3333333333333333], "isController": false}, {"data": ["Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 8, 1.3333333333333333, 1.3333333333333333], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 600, 600, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 392, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 192, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com: Name or service not known", 8, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 8, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://api.demoblaze.com/addtocart", 120, 120, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 120, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 20, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 18, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 20, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 19, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 20, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 40, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 38, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com: Name or service not known", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 120, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 116, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com: Name or service not known", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 20, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 19, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 120, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com", 116, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: www.demoblaze.com: Name or service not known", 4, "", "", "", "", "", ""], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 120, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com", 118, "Non HTTP response code: java.net.UnknownHostException/Non HTTP response message: api.demoblaze.com: Name or service not known", 2, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
