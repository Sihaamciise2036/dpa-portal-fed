import React from "react";
import ReactApexChart from "react-apexcharts";

export default function ApexSplineChart() {
    const [state, setState] = React.useState({
        colors: ["#007DFC"],
        series: [
            {
                name: "series2",
                data: [31, 40, 28, 51, 42, 55, 65, 31, 40, 28, 51, 42],
            },
        ],
        options: {
            chart: {
                height: 500,
                type: "area",
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            grid: {
                show: false, // Hide background grid lines
            },
            xaxis: {
                type: "datetime",
                // categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"],
                categories: [
                    new Date("2025-01-01").getTime(),
                    new Date("2025-02-05").getTime(),
                    new Date("2025-03-10").getTime(),
                    new Date("2025-04-15").getTime(),
                    new Date("2025-05-20").getTime(),
                    new Date("2025-06-25").getTime(),
                    new Date("2025-07-10").getTime(),
                    new Date("2025-08-05").getTime(),
                    new Date("2025-09-20").getTime(),
                    new Date("2025-10-25").getTime(),
                    new Date("2025-11-28").getTime(),
                    new Date("2025-12-15").getTime(),
                ],
                labels: {
                    formatter: function (value) {
                        return new Date(value).toLocaleString("en-US", { month: "short" });
                    },
                },
            },
            yaxis: {
                show: false, // Hide Y-axis
            },
            tooltip: {
                enabled: true,
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                    const date = new Date(w.globals.seriesX[seriesIndex][dataPointIndex]);
                    const formattedDate = date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                    });

                    return `
                        <div class="p-4 bg-secondary-950 text-white rounded-xl shadow-lg">
                            <p class="text-sm">${formattedDate}</p>
                            <h3 class="text-lg font-semibold">${series[seriesIndex][dataPointIndex]} Registered</h3>
                        </div>
                    `;
                },
            },
        },
    });
    return (
        <div>
            <ReactApexChart options={state.options} series={state.series} type="area" height={500} />
        </div>
    );
}
