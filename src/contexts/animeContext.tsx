import React, { createContext, useState, useEffect, ReactNode, useMemo } from "react";
import { ANIME_API_END_POINT } from "../utils/constants";

export type AnimeApiDataShape = {
    mal_id: number;
    rank: number;
    image: string;
    title: string;
    release_date?: string;
    lastest_date?: string | null;
    rating: string;
};

type ActualApiDataShape = {
    mal_id: string;
    images: {
        webp: {
            image_url: string;
        };
    };
    title: string;
    aired: {
        from: string;
        to: string | null;
    };
    rating: string;
};

export type AnimeContextShape = {
    animeList: AnimeApiDataShape[];
    animeFetchLoading: boolean;
    animeFetchError: string | null;
};

export const AnimeContext = createContext<AnimeContextShape>({
    animeList: [],
    animeFetchLoading: true,
    animeFetchError: null,
});

export type AnimeContextProviderProps = {
    children: ReactNode;
};

const AnimeContextProvider: React.FC<AnimeContextProviderProps> = ({ children }) => {
    const [animeList, setAnimeList] = useState<AnimeApiDataShape[]>([]);
    const [animeFetchLoading, setAnimeFetchLoading] = useState<boolean>(false);
    const [animeFetchError, setAnimeFetchError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted: boolean = true;
        let controller = new AbortController();

        isMounted &&
            (async () => {
                try {
                    setAnimeFetchError(null);
                    setAnimeFetchLoading(true);
                    const response = await fetch(ANIME_API_END_POINT, {
                        signal: controller.signal,
                    });
                    if (!response) throw new Error("Network Error!");
                    if (response.status === 500) throw new Error("Server Error!");

                    const responseData = await response.json();

                    const formatResponse: AnimeApiDataShape[] = responseData.data.map(
                        ({
                            mal_id,
                            images: {
                                webp: { image_url },
                            },
                            title,
                            aired: { from, to },
                            rating,
                        }: ActualApiDataShape) => ({
                            mal_id,
                            image: image_url,
                            title,
                            release_date: from,
                            lastest_date: to,
                            rating,
                        })
                    );
                    setAnimeFetchError(null);
                    setAnimeList(formatResponse);
                } catch (error: any) {
                    setAnimeList([]);
                    setAnimeFetchError(error.message);
                } finally {
                    setAnimeFetchLoading(false);
                }
            })();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const contextValues: AnimeContextShape = useMemo(
        () => ({
            animeList,
            animeFetchLoading,
            animeFetchError,
        }),
        [animeList, animeFetchLoading, animeFetchError]
    );

    return <AnimeContext.Provider value={contextValues}>{children}</AnimeContext.Provider>;
};

export default AnimeContextProvider;
