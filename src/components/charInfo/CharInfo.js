import './charInfo.scss';

import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

const CharInfo = (props) => {
    const [char, setChar] = useState(null);

    //Создаём экземпляр класса
    const {loading, error, getCharacter} = useMarvelService();

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

             getCharacter(charId)
            .then(onCharLoaded)
        //Своя ошибка чтобы проверить как отрабатывает предохранитель
        // this.foo.bar = 0;
    }

        //Метод чтобы записывать данные в стейт
        const onCharLoaded = (char) => {
            setChar(char);
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