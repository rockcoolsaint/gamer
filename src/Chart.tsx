import { useMemo } from "react";
import {
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Area,
    Tooltip,
    YAxisProps,
    ResponsiveContainer,
} from "recharts";
import useAnime from "./hooks/useAnime";

const CartesianYAxis: YAxisProps = {
    hide: true,
};

type ChartData = {
    animes: string[];
    year: number;
    count: number;
};

const Chart = () => {
    const { animeList } = useAnime();

    const data = useMemo(() => {
        const dataStore: ChartData[] = [];
        animeList.forEach((anime, index) => {
            // used to check if a year already exist in store
            const anime_release_year = new Date(anime.release_date || "").getFullYear();
            const dataIndex = dataStore.findIndex((data) => data.year === anime_release_year);
            if (dataIndex === -1) {
                dataStore.push({
                    animes: [anime.title],
                    year: anime_release_year,
                    count: 1,
                });
            } else {
                dataStore[dataIndex] = {
                    ...dataStore[dataIndex],
                    animes: [...dataStore[dataIndex].animes, anime.title], //adding anime to eisting list
                    count: dataStore[dataIndex].count + 1,
                };
            }
        });
        const sortedDataStore = dataStore.sort((first, next) => {
            if (first.year > next.year) return 1;
            else if (first.year < next.year) return -1;
            else return 0;
        });
        return sortedDataStore;
    }, [animeList]);

    return (
        <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorUv" x1="0" y1="0.5" x2="1" y2="0.5">
                        <stop offset="5%" stopColor="#7beba1" stopOpacity={1} />
                        <stop offset="95%" stopColor="#b1aeda" stopOpacity={1} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="year" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 0" />
                <Tooltip content={<CustomToolTip />} />
                <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorUv)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default Chart;

type CustomToolTipProps = {
    active?: number;
    payload?: [{ payload: ChartData }];
    label?: string;
};

const CustomToolTip: React.FC<CustomToolTipProps> = ({ active, payload, label }) => {
    if (active && payload) {
        const { payload: chartData } = payload[0];
        const { year, animes } = chartData || {};
        return (
            <article className="custom-tooltip">
                <h3>{year}</h3>
                <ul>
                    {animes?.map((anime) => (
                        <li key={anime}>{anime}</li>
                    ))}
                </ul>
            </article>
        );
    }
    return <div />;
};
