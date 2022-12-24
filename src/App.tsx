import "./css/style.css";
import { lazy, Suspense } from "react";
import Cards from "./Cards";
import AnimeContextProvider from "./contexts/animeContext";
import { Container } from "./components/Container";

const Chart = lazy(() => import("./Chart"));

function App() {
    return (
        <AnimeContextProvider>
            <Container>
                <Cards />
                <Suspense fallback={<h3>Loading Chart...</h3>}>
                    <Chart />
                </Suspense>
            </Container>
        </AnimeContextProvider>
    );
}

export default App;
