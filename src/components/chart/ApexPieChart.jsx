import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ApexPieChart() {
    const [state, setState] = React.useState({
        series: [44, 55, 13, 43, 22],
        options: {
            chart: {
                width: 400,
                type: "pie",
            },
            labels: ["D. Processor", "D. Controller", "DPO Officers", "Public Sector", "Private Sector"],
            legend: {
                position: "bottom", // Position the legend at the bottom
                horizontalAlign: "center", // Center the legend horizontally
                floating: false, // Disable floating for a fixed position
                fontSize: "14px", // Set the font size for the legend
                offsetY: 10, // Adjust the vertical offset for spacing
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300,
                        },
                        legend: {
                            position: "bottom", // Ensure legend is at the bottom on smaller screens
                        },
                    },
                },
            ],
        },
    });
    return (
        <div>
            <ReactApexChart options={state.options} series={state.series} type="pie" height={400} />
        </div>
    );
}
