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
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/cart.html 10 uses 10 threads - 3"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=3 10 uses 10 threads - 6"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=1 10 uses 10 threads - 2"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/index.html 10 uses 10 threads - 1"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=4 10 uses 10 threads - 5"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=2 10 uses 10 threads - 7"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=5 10 uses 10 threads - 4"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=6 10 uses 10 threads - 8"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=8 10 uses 10 threads - 10"], "isController": false}, {"data": [1.0, 500, 1500, "https:\/\/www.demoblaze.com\/\/prod.html?idp_=7 10 uses 10 threads - 9"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 100, 0, 0.0, 127.80999999999996, 57, 494, 76.0, 287.0000000000004, 397.69999999999993, 493.2899999999996, 50.45408678102926, 1014.2596848196266, 6.735423498990919], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["https:\/\/www.demoblaze.com\/\/cart.html 10 uses 10 threads - 3", 10, 0, 0.0, 141.0, 72, 403, 77.5, 392.1, 403.0, 403.0, 6.234413965087282, 149.78423082917706, 0.7975666302992518], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=3 10 uses 10 threads - 6", 10, 0, 0.0, 123.1, 70, 223, 84.0, 219.5, 223.0, 223.0, 6.920415224913495, 149.08899221453288, 0.9326340830449826], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=1 10 uses 10 threads - 2", 10, 0, 0.0, 125.79999999999998, 57, 494, 61.5, 462.3000000000001, 494.0, 494.0, 6.020469596628537, 40.95389166917519, 0.8113523479831427], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/index.html 10 uses 10 threads - 1", 10, 0, 0.0, 138.5, 67, 398, 71.0, 379.1000000000001, 398.0, 398.0, 5.64652738565782, 109.77091861942407, 0.7278726708074534], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=4 10 uses 10 threads - 5", 10, 0, 0.0, 107.80000000000001, 70, 390, 75.0, 360.1000000000001, 390.0, 390.0, 6.949270326615705, 149.63326311674774, 0.9365227588603197], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=2 10 uses 10 threads - 7", 10, 0, 0.0, 131.8, 71, 385, 76.5, 368.4000000000001, 385.0, 385.0, 7.251631617113851, 156.18059961928935, 0.9772706671501088], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=5 10 uses 10 threads - 4", 10, 0, 0.0, 153.1, 70, 392, 80.5, 391.0, 392.0, 392.0, 6.51890482398957, 140.40282248207302, 0.8785242829204694], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=6 10 uses 10 threads - 8", 10, 0, 0.0, 163.79999999999998, 69, 423, 79.0, 421.0, 423.0, 423.0, 7.610350076103501, 163.9064283675799, 1.0256135844748857], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=8 10 uses 10 threads - 10", 10, 0, 0.0, 94.9, 71, 185, 73.0, 184.9, 185.0, 185.0, 7.24112961622013, 155.9176434648805, 0.975855358435916], "isController": false}, {"data": ["https:\/\/www.demoblaze.com\/\/prod.html?idp_=7 10 uses 10 threads - 9", 10, 0, 0.0, 98.3, 70, 203, 75.5, 201.3, 203.0, 203.0, 7.604562737642586, 163.78549786121673, 1.024833650190114], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 100, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
