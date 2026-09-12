import React from "react";
import ReactApexChart from "react-apexcharts";

export default function OverallWorkChart() {
    const [state, setState] = React.useState({
        series: [76],
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
            plotOptions: {
                radialBar: {
                    track: {
                        background: "#FFF7E8",
                        strokeWidth: "100%",
                        margin: 25, // Set margin to 0 to reduce space
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
        },
    });

    return (
        <div className="flex items-center justify-center [&_.apexcharts-datalabel-value]:text-4xl [&_.apexcharts-datalabel-value]:!fill-secondary [&_.apexcharts-datalabel-value]:!font-semibold [&_.apexcharts-datalabel-value]:!font-Inter">
            <ReactApexChart options={state.options} series={state.series} type="radialBar" height={400} width={400} />
        </div>
    );
}
