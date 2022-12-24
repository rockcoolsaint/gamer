import React from "react";
import Card from "./components/Card";
import { SkeletonCard } from "./components/SkeletonCard";
import useAnime from "./hooks/useAnime";

function Cards() {
    const { animeList, animeFetchLoading, animeFetchError } = useAnime();
    return (
        <section>
            {animeFetchError && <h3>An Error occured - {animeFetchError}</h3>}
            <div className="cards-wrapper">
                {animeFetchLoading &&
                    Array.from(Array(20).keys()).map((index) => <SkeletonCard key={index} />)}
                {!animeFetchLoading &&
                    !animeFetchError &&
                    animeList?.map((data, index) => (
                        <Card key={data.mal_id} {...data} rank={index + 1} />
                    ))}
            </div>
        </section>
    );
}

export default Cards;
