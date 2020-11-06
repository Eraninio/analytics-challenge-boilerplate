import React, { useEffect, useState } from 'react';
import { Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import { Event } from '../../models/event';

const colors: Array<string> = ['#625cd6', '#5cd6d6', '#7ad65c', '#d6995c', '#d65c5c', '#d6d65c'];

const Chart: React.FC = () => {
    const [chartData, setChartData] = useState<Array<any>>([]);

    useEffect(() => {
        (async () => {
            const { data } = await axios.get(`http://localhost:3001/events/all`);
            const osCount = Array(6).fill(0);
            data.forEach((event: Event) => {
                switch (event.os) {
                    case "windows":
                        osCount[0]++;
                        break;
                    case "mac":
                        osCount[1]++;
                        break;
                    case "linux":
                        osCount[2]++;
                        break;
                    case "ios":
                        osCount[3]++;
                        break;
                    case "android":
                        osCount[4]++;
                        break;
                    default:
                        osCount[5]++;
                        break;
                }
            })
            const osData = [
                { os: 'windows', count: osCount[0] },
                { os: 'mac', count: osCount[1] },
                { os: 'linux', count: osCount[2] },
                { os: 'ios', count: osCount[3] },
                { os: 'android', count: osCount[4] },
                { os: 'other', count: osCount[5] }
            ]
            setChartData(osData)
        })();
    }, [])
    return (
        <div style={{ border: 'solid' }}>
            <PieChart width={730} height={250}>
                <Pie data={chartData} dataKey="count" nameKey="os" outerRadius={90} fill="#625cd6" >
                    {chartData.map((data, index) => {
                        return <Cell key={`cell-${index}`} fill={colors[index]} />
                    })}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </div >
    )
}

export default Chart;