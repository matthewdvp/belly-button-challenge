// Initialize the dashboard
function init() {
    var dropdown = d3.select("#selDataset");

    // Use D3 fetch to read the JSON file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        // Verify the data
        console.log(data);

        // Populate dropdown with sample IDs
        data.names.forEach(function(name) {
            dropdown.append("option").text(name).property("value");
        });

        // Use the first sample to build the initial plots and metadata display
        buildMetadata(data.names[0]);
        buildCharts(data.names[0]);
    });
}

// Function to update the displayed metadata
function buildMetadata(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var metadata = data.metadata;
        var sampleArray = metadata.filter(sampleObject => sampleObject.id == sample);
        var sampleData = sampleArray[0];
        var PANEL = d3.select("#sample-metadata");

        // Clear any existing metadata
        PANEL.html("");

        // Append key-value pair to the panel
        Object.entries(sampleData).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}: ${value}`);
        });
    });
}

// Function to update the charts
function buildCharts(sample) {
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
        var samples = data.samples;
        var sampleArray = samples.filter(sampleObject => sampleObject.id == sample);
        var sampleData = sampleArray[0];

        var otu_ids = sampleData.otu_ids;
        var otu_labels = sampleData.otu_labels;
        var sample_values = sampleData.sample_values;

        // Build a Bar Chart
        var barData = [{
            x: sample_values.slice(0, 10).reverse(),
            y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 OTUs"
        };

        Plotly.newPlot("bar", barData, barLayout);

        // Build a Bubble Chart
        var bubbleData = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        }];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: { title: "OTU ID" },
            margin: { t: 30}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });
}

// Event listener for when the dropdown selection changes
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

// Initialize the dashboard
init();
