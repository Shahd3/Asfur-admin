import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import api from '/src/api'; 

const COLORS = ['#FA9189', '#fcae7c', '#ffe699', '#FBE0A7', '#B3F5BC', '#BDE2FF', '#E2CBF7', '#D1BDFF'];

const CountryPieChart = ({ isArabic = false }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await api.get('/admin/country/get-country-list?limit=500');
                const countries = response.data.data;
                const totalCountries = response.data.total;

                const continentCounts = {};
                

                countries.forEach(country => {
                    const continentName =
                        country.continent?.translations?.find(t => t.locale === 'en')?.name || 'Unknown';

                    if (!continentCounts[continentName]) {
                        continentCounts[continentName] = 0;
                    }

                    continentCounts[continentName]++;
                });

                const chartData = Object.entries(continentCounts).map(([name, count]) => ({
                    name,
                    value: (count / totalCountries) * 100,
                    rawCount: count,
                }));

                setData(chartData);
            } catch (err) {
                console.error('Failed to fetch countries:', err);
            }
        };

        fetchCountries();
    }, []);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const { name, rawCount, value } = payload[0].payload;
            return (
                <div className="bg-white p-2 rounded shadow text-sm text-gray-700">
                    <p className="font-semibold">{name}</p>
                    <p>{`${rawCount} countries`}</p>
                    <p>{value.toFixed(1)}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">
                {isArabic ? 'نسبة البلدان حسب القارة' : 'Countries by Continent (%)'}
            </h3>
            {data.length === 0 ? (
                <p className="text-gray-500 text-sm">{isArabic ? 'لا توجد بيانات' : 'No data available'}</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, value }) => `${name} (${value.toFixed(0)}%)`}
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default CountryPieChart;
