import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './singleComic.scss';


const SingleComicPage = () => {
    const {comicId} = useParams();
    const [comic, setComic] = useState(null);
    const {loading, error, getComic} = useMarvelService();

        //Обновление стейта
        useEffect(() => {
            updateComic();
        }, [comicId]);

    //Получаем персонажа по клику на иконку
    const updateComic = () => {
             getComic(comicId)
            .then(onComicLoaded)
    }

        //Метод чтобы записывать данные в стейт
        const onComicLoaded = (comic) => {
            setComic(comic);
        }

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading || !comic) ? <View comic={comic} /> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {title, description, pageCount, thumbnail, price, language} = comic;

    return (
            <div className="single-comic">
                <img src={thumbnail} alt="x-men" className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{title}</h2>
                    <p className="single-comic__descr">{description}</p>
                    <p className="single-comic__descr">{pageCount}</p>
                    <p className="single-comic__descr">{language}</p>
                    <div className="single-comic__price">{price}</div>
                </div>
                <Link to="/comics" className="single-comic__back">Back to all</Link>
            </div>
    );
}

export default SingleComicPage;