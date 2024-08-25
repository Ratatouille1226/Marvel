import './charInfo.scss';

import { useState, useEffect } from 'react';

import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharInfo = (props) => {
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    //Создаём экземпляр класса
    const marvelService = new MarvelService();

        //Обновление стейта
        useEffect(() => {
            updateChar();
        }, [props.charId]);

    //Получаем персонажа по клику на иконку
    const updateChar = () => {
        const {charId} = props;
        if (!charId) {
            return;
        }

        onCharLoading();
        marvelService
            .getCharacter(charId)
            .then(onCharLoaded)
            .catch(onError)
        //Своя ошибка чтобы проверить как отрабатывает предохранитель
        // this.foo.bar = 0;
    }

        //Метод чтобы записывать данные в стейт
        const onCharLoaded = (char) => {
            setChar(char);
            setLoading(false);
            setError(false);
        }
        //Показываем спинер при загрузке персонажа
        const onCharLoading = () => {
            setLoading(true);
        }
        //Обработка ошибки получения персонажа с сервера
        const onError = () => {
            setLoading(false);
            setError(true);
        }

        const skeleton = char || loading || error ? null : <Skeleton />
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading || !char) ? <View char={char} /> : null;

    return (
        <div className="char__info">
            {skeleton}
            {errorMessage}
            {spinner}
            {content}
        </div>
    )
}

const View = ({char}) => {
    const {thumbnail, name, description, homepage, wiki, comics} = char;

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt="abyss"/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
               {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {
                    comics.map((item, i) => {
                        return (
                            <li key={i} className="char__comics-item">
                                {item.name}
                            </li>
                        )
                    })
                }
            </ul>
        </>
    )
}

export default CharInfo;