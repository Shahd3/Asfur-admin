import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import api from "/src/api.js";

const GrowthLineChart = ({ lang, isArabic }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchRevenueData = async () => {
            try {
                const response = await api.get("admin/analytics/overall");
                const revenueGrowth = response.data.data.revenue_growth;

                if (Array.isArray(revenueGrowth)) {
                    const sorted = [...revenueGrowth].sort((a, b) =>
                        new Date(a.month) - new Date(b.month)
                    );
                    setData(sorted);
                } else {
                    setData([]);
                }
            } catch (err) {
                console.error("Failed to fetch revenue growth data", err);
            }
        };

        fetchRevenueData();
    }, [lang]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { month, revenue } = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
                    <p className="font-semibold">{month}</p>
                    <p>
                        {isArabic ? "الإيرادات: " : "Revenue: "}
                        ${revenue.toLocaleString()}
                    </p>
                </div>
            );
        }
        return null;
    };
    return (
        <div className="bg-white rounded-lg shadow p-4 mt-5">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {isArabic ? "نمو الإيرادات" : "Revenue Growth"}
            </h3>
            {data.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    {isArabic ? "لا توجد بيانات" : "No data available"}
                </p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) => {
                                if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
                                if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
                                return `$${value}`;
                            }}
                        />

                        <Tooltip content={<CustomTooltip />} />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#139295"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};


export default GrowthLineChart;
