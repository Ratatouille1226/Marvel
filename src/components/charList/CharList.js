import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import { useState, useEffect} from "react";

import './charList.scss';


const CharList = (props) => {
        const [charList, setCharList] = useState([]);   
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [newItemLoading, setNewItemLoading] = useState(false);
        const [offset, setOffset] = useState(302);
        const [charEnded, setCharEnded] = useState(false);    

    //Экземпляр класса
   const marvelService = new MarvelService();

        //Обновление персонажей
        useEffect(() => {
            onRequest();
        }, []);


    //Записываем данные в стейт данные в стейт
   const onCharListLoaded = (newCharList) => {
        //Проверяем остались ли ещё персонажи в базе данных, если они закончились удаляем кнопку пагинации со страницы
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        //Передал с аргументами чтобы отталкиваться от предыдущего состояния
        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);

    }

    //Ошибка
    const onCharListError = () => {
        setLoading(loading => false);
        setError(true);
    }
    //Алгоритм запроса
   const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
        .then(onCharListLoaded)
        .catch(onCharListError)
    }

    //Показываем загрузку дополнительных персонажей (пагинация)
    const onCharListLoading = () => {
        setNewItemLoading(true);
    }


    //Создадим метод для оптимизации
    function rednderItems(arr) {
       const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item"
                tabIndex={0}
                key={item.id}
                onClick={() => {
                    props.onCharSelected(item.id);
                }}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            )
        });
        //Вынес для центровки спинера/ошибки
        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

        const items = rednderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    style={{"display": charEnded ? 'none' : 'block'}}
                    disabled={newItemLoading}
                    onClick={() => onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
}

export default CharList;