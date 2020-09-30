const path = "/js/samples.json";

function pageInit() {
  var dataSelector = d3.select("#selDataset")
  d3.json(path).then(function(data) {
    data.names.forEach(name => {
      dataSelector.append("option").text(name)  
    });
    createTable(data.names[0]);
    buildPlots(data.names[0]);
  });
};

pageInit();

function optionChanged(id) {
  createTable(id);
  buildPlots(id);
};

function createTable(id) {
  d3.json(path).then(function(data) {
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(object => object.id == id)[0];
    var panelSelector = d3.select("#sample-metadata");
    panelSelector.html("");
    Object.entries(filteredMetadata).forEach(([key,value]) => {
      panelSelector.append("h6").text(`${key}: ${value}`);
    });
  });
};

function buildPlots(id) {
  d3.json(path).then(function(data) {
    var SampleData = data.samples;
    var filteredSampleData = SampleData.filter(object => object.id == id)[0];
    var metadata = data.metadata;
    var filteredMetadata = metadata.filter(object => object.id == id)[0];
    // Grab values from the data json object to build the plots
    var sampleValuesBar = filteredSampleData.sample_values.slice(0,10);
    var otuIDsBar = filteredSampleData.otu_ids.slice(0,10);
    var otuLabelsBar = filteredSampleData.otu_labels.slice(0,10);
    var bubbleValues = filteredSampleData.sample_values;
    var bubbleIDs = filteredSampleData.otu_ids;
    var bubbleLabels = filteredSampleData.otu_labels;

    var traceBar = {
      type: "bar",
      orientation: "h",
      x: sampleValuesBar.sort((a,b) => a - b),
      hovertext: otuLabelsBar
    };

    var dataBar = [traceBar];

    var layoutBar = {
      height: 600,
      width: 400,
      yaxis: {
        tick0: "",
        tickvals: [9,8,7,6,5,4,3,2,1,0],
        ticktext: [`OTU ${otuIDsBar[0]}`,`OTU ${otuIDsBar[1]}`,`OTU ${otuIDsBar[2]}`,`OTU ${otuIDsBar[3]}`,`OTU ${otuIDsBar[4]}`,
        `OTU ${otuIDsBar[5]}`,`OTU ${otuIDsBar[6]}`,`OTU ${otuIDsBar[7]}`,`OTU ${otuIDsBar[8]}`,`OTU ${otuIDsBar[9]}`]
      }
    };

    var traceBubble = {
      x: bubbleIDs,
      y: bubbleValues,
      text: bubbleLabels,
      mode: "markers",
      marker: {
        size: bubbleValues,
        color: bubbleIDs
      }
    };

    var dataBubble = [traceBubble];

    var layoutBubble = {
      xaxis: {
        title: {
          text: "OTU ID"
        }
      }
    };

    var dataGauge = [{
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        value: filteredMetadata.wfreq,
        title: {
          text: "Belly Button Washing Frequency <br> Scrubs per Week",
        },
        type: "indicator",
        mode: "gauge",
        gauge: {
          axis: {
            range: [null, 9],
            tick0: "",
            tickvals: [0,1,2,3,4,5,6,7,8,9]
          },
          steps: [
            {range: [0,1], color: "#ffffff"},
            {range: [1,2], color: "#ffe6e6"},
            {range: [2,3], color: "#ffcccc"},
            {range: [3,4], color: "#ffb3b3"},
            {range: [4,5], color: "#ff9999"},
            {range: [5,6], color: "#ff8080"},
            {range: [6,7], color: "#ff6666"},
            {range: [7,8], color: "#ff4d4d"},
            {range: [8,9], color: "#ff3333"}
          ]
        }
    }];
    
    var layoutGauge = { 
      width: 600, 
      height: 500
    };

    Plotly.newPlot("bar", dataBar, layoutBar);
    Plotly.newPlot("bubble", dataBubble, layoutBubble);
    Plotly.newPlot("gauge", dataGauge, layoutGauge);  

  });
};