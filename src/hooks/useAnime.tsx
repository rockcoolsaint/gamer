import { useContext } from "react";
import { AnimeContext, AnimeContextShape } from "../contexts/animeContext";

function useAnime() {
    return useContext<AnimeContextShape>(AnimeContext);
}

export default useAnime;
