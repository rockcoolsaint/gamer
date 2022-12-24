import React, { MouseEventHandler, TouchEventHandler, useCallback, useState } from "react";
import { AnimeApiDataShape } from "../contexts/animeContext";

let timer: ReturnType<typeof setTimeout> = setTimeout(() => null);

const Card: React.FC<AnimeApiDataShape> = ({
    image,
    title,
    release_date,
    lastest_date,
    rating,
    rank,
}) => {
    const [cardActive, setCardActive] = useState<boolean>(false);

    const onMouseDown: MouseEventHandler<HTMLElement> = useCallback(() => {
        timer = setTimeout(() => setCardActive(true), 500);
    }, []);

    const onMouseUp: MouseEventHandler<HTMLElement> = useCallback(() => {
        clearTimeout(timer);
        setCardActive(false);
    }, []);

    const onTouchStart: TouchEventHandler<HTMLElement> =
        onMouseDown as unknown as TouchEventHandler<HTMLElement>;
    const onTouchEnd: TouchEventHandler<HTMLElement> =
        onMouseUp as unknown as TouchEventHandler<HTMLElement>;

    const cardClassNames: string = `card ${cardActive ? "card-active" : ""}`;

    return (
        <div className="card-wrapper">
            <article
                className={cardClassNames}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
            >
                <span className="rank">{rank}</span>
                <div className="card__image-wrapper">
                    <img src={image} alt={title} />
                </div>
                <div className="card__content">
                    <p>{title}</p>
                    <div className="card__extra-content">
                        <p>
                            Release:{" "}
                            <span>{release_date && new Date(release_date).toDateString()}</span>
                        </p>
                        <p>
                            Lastest:{" "}
                            <span>
                                {lastest_date ? new Date(lastest_date).toDateString() : "now"}
                            </span>
                        </p>
                        <p>
                            Rating: <span>{rating}</span>
                        </p>
                    </div>
                </div>
            </article>
        </div>
    );
};

export default Card;
