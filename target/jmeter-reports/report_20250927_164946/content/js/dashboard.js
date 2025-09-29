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

    var data = {"OkPercent": 99.09411172622043, "KoPercent": 0.9058882737795672};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9471848530144494, 1500, 3000, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1"], "isController": false}, {"data": [0.65, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-5"], "isController": false}, {"data": [0.0, 1500, 3000, "Test"], "isController": true}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-0"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-1"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/index.html-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-10"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-6"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-12"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-7"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-15"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-14"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=2-9"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-4"], "isController": false}, {"data": [0.9736842105263158, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-11"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/index.html-3"], "isController": false}, {"data": [0.975, 1500, 3000, "https://api.demoblaze.com/entries"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-10"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/index.html-6"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-7"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/index.html-9"], "isController": false}, {"data": [0.6, 1500, 3000, "https://www.demoblaze.com/cart.html"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-0"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/index.html-2"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-11"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/index.html-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-10"], "isController": false}, {"data": [0.9473684210526315, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-12"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-13"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-12"], "isController": false}, {"data": [0.475, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-14"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-2"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-1"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-4"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/cart.html-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-3"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-4"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-3"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-4"], "isController": false}, {"data": [0.9736842105263158, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-0"], "isController": false}, {"data": [0.975, 1500, 3000, "https://api.demoblaze.com/viewcart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-1"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-2"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-0"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-9"], "isController": false}, {"data": [0.9210526315789473, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-7"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-5"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-8"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-6"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=1-9"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-7"], "isController": false}, {"data": [0.9, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-8"], "isController": false}, {"data": [0.925, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-12"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-11"], "isController": false}, {"data": [0.8583333333333333, 1500, 3000, "https://www.demoblaze.com/index.html"], "isController": false}, {"data": [0.95, 1500, 3000, "https://www.demoblaze.com/prod.html?idp_=3-10"], "isController": false}, {"data": [0.9916666666666667, 1500, 3000, "https://api.demoblaze.com/view"], "isController": false}, {"data": [0.9916666666666667, 1500, 3000, "https://api.demoblaze.com/addtocart"], "isController": false}, {"data": [1.0, 1500, 3000, "https://www.demoblaze.com/cart.html-8"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-7"], "isController": false}, {"data": [0.975, 1500, 3000, "https://www.demoblaze.com/cart.html-9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1987, 18, 0.9058882737795672, 716.1238047307502, 152, 28790, 498.0, 1043.2000000000003, 1692.0, 8172.279999999946, 16.4740411560847, 203.41967551186013, 22.519605414794302], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 1, 5.0, 2370.9500000000003, 1009, 10084, 1374.5, 5772.000000000002, 9872.999999999996, 10084.0, 0.4151530877010898, 7.48293169434354, 4.595246010638298], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 2, 10.0, 3683.1500000000005, 1099, 23390, 1508.0, 10581.1, 22752.29999999999, 23390.0, 0.3836856846871043, 5.144348249913671, 4.427522973180371], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-12", 20, 0, 0.0, 524.6500000000001, 158, 630, 532.0, 626.5, 629.85, 630.0, 0.3911062440111856, 0.11536488379255724, 0.3436502373526018], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-11", 20, 0, 0.0, 523.6, 173, 661, 529.5, 637.2, 659.85, 661.0, 0.3943373161402263, 0.06354068082337631, 0.361219143105012], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-10", 20, 0, 0.0, 593.9000000000001, 274, 1513, 537.0, 845.9000000000005, 1480.7999999999995, 1513.0, 0.3917650976474506, 0.06312621202327084, 0.3565674521556874], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-2", 20, 0, 0.0, 287.94999999999993, 168, 625, 277.0, 520.2, 619.8, 625.0, 0.39134348217430437, 0.06305827593628928, 0.3592410871521935], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-3", 20, 0, 0.0, 365.9, 164, 686, 307.0, 641.6, 683.9, 686.0, 0.3916040100250626, 0.06310025552161654, 0.35718568883145363], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 1, 5.0, 1490.6000000000001, 176, 22861, 286.5, 937.7000000000007, 21766.399999999983, 22861.0, 0.3906021131574322, 0.10167479810753276, 0.32903650665000095], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-5", 20, 0, 0.0, 349.00000000000006, 168, 645, 283.5, 636.8000000000001, 644.65, 645.0, 0.39406537544578646, 0.06349686225444802, 0.3494251571335685], "isController": false}, {"data": ["Test", 20, 8, 40.0, 28185.9, 15922, 52897, 25761.5, 44753.80000000001, 52516.899999999994, 52897.0, 0.31312625250501, 195.54260498536135, 23.33203394092873], "isController": true}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-0", 20, 0, 0.0, 341.54999999999995, 176, 939, 301.0, 516.3000000000003, 918.4499999999997, 939.0, 0.3930431364842291, 4.340286307359733, 0.3385391077920802], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-1", 20, 0, 0.0, 911.0000000000001, 164, 9788, 292.5, 2013.0000000000032, 9406.949999999993, 9788.0, 0.39053346871826916, 0.06292775618995547, 0.3440050671717566], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-11", 20, 0, 0.0, 1430.1499999999996, 679, 6212, 1146.5, 2163.000000000001, 6012.199999999997, 6212.0, 1.1114816049794376, 191.34047286595532, 0.9747172668667333], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-10", 20, 0, 0.0, 975.4499999999999, 379, 2982, 907.0, 1368.3, 2901.3999999999987, 2982.0, 1.1450818733539447, 71.55827974708004, 1.0030648832016489], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-13", 20, 0, 0.0, 317.30000000000007, 186, 722, 301.5, 670.7000000000007, 721.0, 722.0, 1.1669292257424588, 13.26191133890542, 1.025621389812708], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-6", 20, 0, 0.0, 349.09999999999997, 176, 630, 274.0, 601.2000000000002, 628.85, 630.0, 0.39051059259982424, 0.06292407009665137, 0.34207812652543196], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-12", 20, 0, 0.0, 1072.4, 449, 2663, 1027.5, 1327.0, 2596.349999999999, 2663.0, 1.117006422786931, 105.63504651284556, 1.0068329377268919], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 1, 5.0, 1709.3, 174, 19926, 539.0, 4762.40000000001, 19190.649999999987, 19926.0, 0.3948277563912743, 0.10277474459579508, 0.34028831679992105], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-15", 20, 0, 0.0, 248.85000000000005, 158, 359, 277.5, 308.3, 356.49999999999994, 359.0, 1.1622501162250116, 4.537655995757787, 0.9874585948396096], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 1, 5.0, 1022.6499999999997, 183, 10078, 612.0, 814.3000000000004, 9615.649999999994, 10078.0, 0.3945162244797317, 0.10269365198737548, 0.34038582453890914], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-14", 20, 0, 0.0, 311.85, 184, 685, 310.0, 490.60000000000036, 676.0499999999998, 685.0, 1.1475786091347258, 17.349449789849665, 1.0153381053477162], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-9", 20, 0, 0.0, 548.05, 173, 802, 559.0, 644.9, 794.1999999999998, 802.0, 0.3910144870867466, 0.0630052640325324, 0.36466683121859667], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-4", 20, 0, 0.0, 609.8499999999999, 203, 1151, 643.5, 886.1000000000001, 1137.9999999999998, 1151.0, 1.1303266644060133, 3.346992183084662, 0.9669591386910817], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-11", 19, 0, 0.0, 646.8947368421052, 173, 1538, 616.0, 1166.0, 1538.0, 1538.0, 0.4085230815541078, 0.06582647310198027, 0.374213525876712], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-3", 20, 0, 0.0, 782.5999999999999, 212, 1599, 802.5, 1083.0, 1573.2499999999995, 1599.0, 1.1203854125819284, 25.80464242199317, 0.9869019942860344], "isController": false}, {"data": ["https://api.demoblaze.com/entries", 120, 0, 0.0, 514.1916666666664, 281, 4271, 326.5, 753.9000000000001, 1436.1999999999978, 3729.8299999999795, 1.0268258246694904, 2.9392220724767895, 0.4311866255936337], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-10", 19, 0, 0.0, 573.1578947368422, 181, 1083, 603.0, 644.0, 1083.0, 1083.0, 0.4085230815541078, 0.06582647310198027, 0.3718198359457309], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-6", 20, 0, 0.0, 904.1999999999999, 197, 5424, 639.0, 1468.6000000000013, 5229.099999999997, 5424.0, 0.9304922303898763, 3.873719119289104, 0.7860115032101982], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 1, 5.0, 1116.05, 168, 11078, 638.5, 835.8000000000001, 10565.949999999993, 11078.0, 0.7649353629618297, 0.8150968957966802, 0.6216593838445651], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-8", 20, 0, 0.0, 791.3499999999999, 461, 952, 846.5, 922.1, 950.65, 952.0, 1.13314447592068, 37.77885977337111, 0.9616235835694051], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-7", 20, 0, 0.0, 813.6999999999999, 428, 1450, 758.5, 1166.2, 1436.0499999999997, 1450.0, 1.1335940599671257, 30.64157881312702, 0.9642191662415689], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-9", 20, 0, 0.0, 1094.2, 340, 4870, 874.5, 2084.0000000000023, 4735.8499999999985, 4870.0, 1.0462439840970914, 35.65709843848085, 0.8888986974262398], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 1, 5.0, 2686.4000000000005, 1154, 10638, 1668.0, 7298.200000000002, 10474.399999999998, 10638.0, 0.5132021246567962, 15.177351427984913, 6.8752796550640225], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-0", 20, 0, 0.0, 677.2999999999998, 504, 1252, 643.5, 1068.2000000000005, 1243.85, 1252.0, 1.0877841836179702, 5.464256516507125, 0.9231293511367346], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-2", 20, 0, 0.0, 1023.9500000000002, 351, 4246, 835.5, 1455.6000000000008, 4108.149999999998, 4246.0, 0.9843488532335859, 27.44410744167733, 0.8728405847032188], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-11", 20, 0, 0.0, 557.25, 174, 1514, 609.0, 642.5, 1470.4499999999994, 1514.0, 0.5279552293965472, 0.08507091098674834, 0.48052175175545114], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-1", 20, 0, 0.0, 462.25000000000006, 195, 848, 537.5, 658.0, 838.4999999999999, 848.0, 1.1600255205614523, 6.412936006467143, 0.9855685575082652], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-10", 20, 0, 0.0, 552.8499999999999, 278, 647, 601.0, 636.0, 646.45, 647.0, 0.5279134221987595, 0.08506417447538604, 0.4923411310545071], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-12", 19, 0, 0.0, 775.0, 221, 5383, 542.0, 770.0, 5383.0, 5383.0, 0.4075329243704689, 1.6378190218673587, 0.3486316813950496], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-13", 20, 0, 0.0, 356.30000000000007, 169, 763, 289.5, 653.0, 757.4999999999999, 763.0, 0.522220481487284, 3.830747321988093, 0.4702024257141365], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-12", 20, 0, 0.0, 536.1500000000001, 198, 696, 595.5, 654.3000000000001, 694.05, 696.0, 0.5237384450205567, 0.08439144866053894, 0.47975259905203343], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 2, 10.0, 2685.9500000000003, 1087, 9274, 1747.0, 8532.100000000013, 9264.75, 9274.0, 0.36297640653357527, 6.413941980490018, 4.172633563974592], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-14", 20, 0, 0.0, 287.05, 169, 631, 275.0, 554.6000000000001, 627.4499999999999, 631.0, 0.5260389268805892, 1.8388245495791686, 0.45000986322987896], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-0", 20, 0, 0.0, 513.6, 179, 4099, 293.5, 631.7000000000002, 3925.9499999999975, 4099.0, 0.5318300271233314, 6.4487247297638675, 0.45444460325479974], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-2", 20, 0, 0.0, 300.75, 178, 667, 282.0, 615.2000000000002, 664.75, 667.0, 0.5323396326856535, 0.08577738221985627, 0.48867114719190846], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-1", 20, 0, 0.0, 614.9, 169, 6111, 285.0, 665.3000000000001, 5838.7999999999965, 6111.0, 0.5339455909442827, 0.08603615479082681, 0.4703309795231866], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-4", 20, 0, 0.0, 449.05, 171, 2248, 235.0, 1521.300000000002, 2216.45, 2248.0, 0.5323821439028935, 0.08578423217185295, 0.48559074453642825], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-3", 20, 0, 0.0, 432.55000000000007, 165, 2012, 290.0, 915.7000000000006, 1958.5999999999992, 2012.0, 0.5275096270506937, 2.479578577504352, 0.47341928443319087], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 1, 5.0, 788.6500000000001, 179, 10107, 283.0, 584.6, 9630.999999999993, 10107.0, 0.5337603416066187, 0.16296891680010675, 0.4489789748465439], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-5", 20, 0, 0.0, 275.3, 164, 650, 188.0, 639.6, 649.5, 650.0, 0.5339598462195644, 0.08603845178342588, 0.47347220739000423], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-3", 19, 0, 0.0, 296.4210526315789, 155, 620, 284.0, 518.0, 620.0, 620.0, 0.4087340002151232, 0.0658604590190384, 0.37281011347746584], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-1", 20, 0, 0.0, 858.5, 173, 8607, 532.5, 815.6000000000003, 8217.999999999995, 8607.0, 0.3753965125663982, 0.06048869587251534, 0.3306715374364172], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-4", 19, 0, 0.0, 271.2105263157895, 152, 636, 270.0, 482.0, 636.0, 636.0, 0.4088747336934301, 0.06588313580021089, 0.36255689276722114], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-2", 20, 0, 0.0, 427.84999999999997, 176, 823, 312.5, 705.1000000000001, 817.4499999999999, 823.0, 0.3729464635351595, 0.06009391258134895, 0.34235319894829097], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-5", 19, 0, 0.0, 282.3157894736843, 160, 631, 271.0, 620.0, 631.0, 631.0, 0.40872520758938174, 0.06585904223852343, 0.36242430516714713], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-3", 20, 0, 0.0, 379.25, 176, 653, 295.5, 642.3000000000001, 652.5, 653.0, 0.3729464635351595, 0.06009391258134895, 0.34016796576351466], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-6", 19, 0, 0.0, 341.5789473684211, 155, 1112, 284.0, 699.0, 1112.0, 1112.0, 0.40883954123899896, 0.06587746514104964, 0.35813385594861535], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-4", 20, 0, 0.0, 486.45000000000005, 176, 827, 531.5, 710.5, 821.3, 827.0, 0.37367811367288223, 0.06021180542580621, 0.33134738985837603], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-0", 19, 0, 0.0, 441.52631578947376, 175, 1567, 335.0, 916.0, 1567.0, 1567.0, 0.40326003905255114, 5.272703772338484, 0.34733921332456064], "isController": false}, {"data": ["https://api.demoblaze.com/viewcart", 40, 0, 0.0, 420.875, 259, 3296, 298.5, 718.3, 1138.3999999999983, 3296.0, 1.0113268608414239, 0.3842844546419903, 0.4627017913127023], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-1", 19, 0, 0.0, 315.15789473684214, 176, 529, 288.0, 517.0, 529.0, 529.0, 0.4088923321927389, 0.06588597149590032, 0.3601766441775884], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-2", 19, 0, 0.0, 334.1578947368422, 154, 1048, 279.0, 633.0, 1048.0, 1048.0, 0.4087340002151232, 0.0658604590190384, 0.37520503925997634], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-0", 20, 0, 0.0, 413.90000000000003, 188, 849, 414.5, 811.1000000000006, 848.4, 849.0, 0.3715193282930544, 5.616871563446214, 0.32000004643991603], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-9", 20, 0, 0.0, 574.2, 279, 860, 596.5, 645.7, 849.3499999999999, 860.0, 0.37297428342315797, 0.060098395278145575, 0.3478422272159335], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-7", 19, 0, 0.0, 842.1052631578948, 486, 4367, 608.0, 1874.0, 4367.0, 4367.0, 0.40464274305185816, 0.06520122324566074, 0.36710264481950805], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-5", 20, 0, 0.0, 605.95, 178, 2716, 610.0, 715.9000000000001, 2616.1499999999987, 2716.0, 0.37305080952025665, 0.06011072614340073, 0.33079114750429006], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-8", 19, 0, 0.0, 585.2631578947369, 306, 816, 591.0, 763.0, 816.0, 816.0, 0.4068174032202809, 0.06555163235483041, 0.3694728369090442], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-6", 20, 0, 0.0, 537.0, 170, 1094, 611.0, 729.2, 1075.8499999999997, 1094.0, 0.37298123904367614, 0.06009951605684234, 0.3267228236544702], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=1-9", 19, 0, 0.0, 549.0526315789473, 197, 760, 547.0, 639.0, 760.0, 760.0, 0.4068174032202809, 0.06555163235483041, 0.3794049024173518], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 20, 1, 5.0, 599.3000000000001, 290, 1010, 611.0, 741.4000000000001, 996.8499999999998, 1010.0, 0.37226617031177295, 0.11751468706375058, 0.32084327012563985], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 2, 10.0, 942.6499999999997, 269, 8113, 597.5, 739.6, 7744.4999999999945, 8113.0, 0.3732666430264459, 0.1755155162277673, 0.3051017384893899], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 1, 5.0, 592.95, 186, 1991, 616.0, 707.3000000000001, 1926.849999999999, 1991.0, 0.3730716857244119, 0.11776896719767203, 0.3118463958943461], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-11", 20, 0, 0.0, 702.45, 484, 2349, 625.0, 812.6000000000003, 2272.799999999999, 2349.0, 0.37307864497836146, 0.060115211349052386, 0.34174586815400687], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, 1.6666666666666667, 1251.6833333333327, 158, 28790, 320.5, 2891.0, 5003.4999999999845, 25180.729999999865, 0.9974896510448704, 87.21416986001894, 3.0131119884748383], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-10", 20, 0, 0.0, 740.9000000000001, 495, 2169, 621.0, 1855.9000000000024, 2159.0, 2169.0, 0.3729951510630362, 0.06010175773964939, 0.3394838679597165], "isController": false}, {"data": ["https://api.demoblaze.com/view", 120, 0, 0.0, 425.5083333333334, 263, 10440, 291.0, 615.6, 711.8499999999999, 8494.769999999926, 1.3974938277355942, 0.45705144815297905, 0.595026668840546], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 1, 0.8333333333333334, 461.56666666666666, 251, 18620, 292.0, 328.70000000000005, 405.09999999999934, 14895.64999999986, 2.263126131563066, 0.4939537992229934, 1.0934943669376131], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-8", 20, 0, 0.0, 537.9999999999999, 167, 834, 574.5, 643.8, 824.4999999999999, 834.0, 0.5289046384936795, 0.08522389194478236, 0.4798363370709261], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-7", 20, 0, 0.0, 642.7, 172, 2281, 606.0, 638.6, 2198.8999999999987, 2281.0, 0.5275235407380053, 0.08500135177907314, 0.4620982578535068], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-9", 20, 0, 0.0, 664.6999999999999, 169, 2358, 608.5, 1204.800000000001, 2303.0499999999993, 2358.0, 0.5275235407380053, 0.08500135177907314, 0.47909852820932136], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.demoblaze.com:443 failed to respond", 1, 5.555555555555555, 0.050327126321087066], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, 22.22222222222222, 0.20130850528434827], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 7, 38.888888888888886, 0.3522898842476095], "isController": false}, {"data": ["Assertion failed", 6, 33.333333333333336, 0.3019627579265224], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1987, 18, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 7, "Assertion failed", 6, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.demoblaze.com:443 failed to respond", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.demoblaze.com/prod.html?idp_=1", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2", 20, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-4", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-7", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=2-8", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/index.html-5", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html", 20, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3", 20, 2, "Assertion failed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/cart.html-6", 20, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-7", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-8", 20, 2, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.demoblaze.com/prod.html?idp_=3-12", 20, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.demoblaze.com/index.html", 120, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.demoblaze.com:443 failed to respond", 1, "Assertion failed", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://api.demoblaze.com/addtocart", 120, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: api.demoblaze.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
