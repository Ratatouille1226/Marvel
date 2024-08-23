import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import PropTypes from 'prop-types';
import { Component } from "react";

import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 302,
        charEnded: false,
    }

    //Экземпляр класса
    marvelService = new MarvelService();

        //Обновление персонажей
        componentDidMount() {
            this.onRequest();
        }

    //Записываем данные в стейт данные в стейт
    onCharListLoaded = (newCharList) => {
        //Проверяем остались ли ещё персонажи в базе данных, если они закончились удаляем кнопку пагинации со страницы
        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            error: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }));
    }

    //Ошибка
    onCharListError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }
    //Алгоритм запроса
    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onCharListError)
    }

    //Показываем загрузку дополнительных персонажей (пагинация)
    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    //РАБОТА С РЕФАМИ
    itemRefs = [];

    setRef = (ref) => {
        this.itemRefs.push(ref);
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

    //Создадим метод для оптимизации, чтобы не помещать такую конструкцию в render
    rednderItems(arr) {
       const items = arr.map((item, i) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item"
                ref={this.setRef} 
                key={item.id}
                onClick={() => {
                    this.props.onCharSelected(item.id);
                    this.focusOnItem(i);
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.rednderItems(charList);

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
                    onClick={() => this.onRequest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;