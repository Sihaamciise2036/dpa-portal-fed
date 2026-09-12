import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ComplaintClassChart() {
    const [state, setState] = React.useState({
        series: [76, 45, 65],
        options: {
            chart: {
                type: "radialBar",
                offsetY: 0,
                sparkline: {
                    enabled: false,
                },
                height: "100%", // Ensure the chart takes full height of the container
                width: "100%", // Ensure the chart takes full width of the container
            },
            labels: ["Private", "Public", "Personal"],
            plotOptions: {
                radialBar: {
                    track: {
                        background: "#FFF7E8",
                        strokeWidth: "100%",
                        margin: 10, // Set margin to 0 to reduce space
                    },
                    dataLabels: {
                        name: {
                            show: false,
                        },
                        value: {
                            offsetY: -0, // Adjust this value to position the value label
                        },
                    },
                },
            },
            grid: {
                padding: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
            },
            stroke: {
                lineCap: "round",
            },
            legend: {
                show: true, // Show the legend
                position: "bottom", // Position the legend at the bottom
                horizontalAlign: "center", // Center the legend horizontally
                floating: false, // Disable floating for a fixed position
                fontSize: "14px", // Set the font size for the legend
                labels: {
                    colors: ["#000"], // Set the color of the legend labels
                },
                markers: {
                    width: 10,
                    height: 10,
                    strokeWidth: 0,
                    strokeColor: "#fff",
                    fillColors: undefined,
                },
                itemMargin: {
                    horizontal: 5,
                    vertical: 5,
                },
            },
        },
    });

    return (
        <div className="flex items-center justify-center [&_.apexcharts-datalabel-value]:text-4xl [&_.apexcharts-datalabel-value]:!fill-secondary [&_.apexcharts-datalabel-value]:!font-semibold [&_.apexcharts-datalabel-value]:!font-Inter">
            <ReactApexChart options={state.options} series={state.series} type="radialBar" height={400} width={400} />
        </div>
    );
}
