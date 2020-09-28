function dropDown(){
    var seldropDown = d3.select("#selDataset")
    d3.json("./samples.json").then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            seldropDown.append("option")
            .text(sample)
            .property("value", sample);
        });
        var firstSample = sampleNames[0];
        metaData(firstSample);
        createCharts(firstSample);
    });
}
dropDown()

function metaData(id){
    d3.json("./samples.json").then((data) => {
        console.log(data);
        var resultArray = data.metadata.filter(object => object.id == id);
        var result = resultArray[0];
        var display = d3.select("#sample-metadata");
        display.html("");
        Object.entries(result).forEach(([key,value]) => {
            display.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
});
}
function optionChanged (samples) {
    metaData(samples);
    createCharts(samples);
    
}
function createCharts(id){
    d3.json("./samples.json").then((data) => {
        console.log(data);
        var result = data.samples.find(object => object.id == id);
        console.log(result);
        var otuId = result.otu_ids;
        var sampleValue = result.sample_values;
        var otuLabels = result.otu_labels;
        var bubbleData = [{
            x:otuId,
            y:sampleValue,
            text: otuLabels,
            mode: "markers",
            marker: {
                size: sampleValue,
                color: otuId,
                colorscale: "Earth"
            }
        }];
        Plotly.newPlot("bubble", bubbleData);
        var barData = [{
            x:sampleValue.slice(0, 10).reverse(),
            y:otuId.slice(0, 10).map(otuId => `otu${otuId}`).reverse(),
            text:otuLabels.slice(0, 10).reverse(),
            type:"bar",
            orientation:"h"
        }];
        Plotly.newPlot("bar", barData);
        
    });
};
