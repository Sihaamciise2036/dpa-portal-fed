import React from "react";
import ReactApexChart from "react-apexcharts";

export default function TotalRevenuePieChart() {
    const [state, setState] = React.useState({
        series: [15, 26, 24, 19, 16],
        options: {
            chart: {
                width: "100%",
                height: "100%",
                type: "pie",
            },
            labels: ["Bank Breach", "Social Media Hacking", "Institution Data", "Cyber Bullying", "Teleco Breach"],
            colors: [
                "#FFB200", // Color for 'Bank Breach'
                "#FF3A29", // Color for 'Social Media Hacking'
                "#4339F2", // Color for 'Institution Data'
            ],
            theme: {
                monochrome: {
                    enabled: false, // Disable monochrome theme
                },
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -25,
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
            dataLabels: {
                formatter(val, opts) {
                    const name = opts.w.globals.labels[opts.seriesIndex];
                    return [name, val.toFixed(1) + "%"];
                },
            },
            legend: {
                show: false, // Show the legend
                position: "bottom", // Position the legend at the bottom
                horizontalAlign: "center", // Center the legend
            },
        },
    });

    return (
        <div>
            <ReactApexChart options={state.options} series={state.series} type="pie" height={400} />
        </div>
    );
}
