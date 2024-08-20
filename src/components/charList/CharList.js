import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import { Component } from "react";

import './charList.scss';


class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false
    }

    //Экземпляр класса
    marvelService = new MarvelService();

    //Записываем данные в стейт данные в стейт
    onCharListLoaded = (charList) => {
        this.setState({
            charList,
            loading: false,
            error: false
        })
    }

    //Ошибка
    onCharListError = () => {
        this.setState({
            loading: false,
            error: true,
        })
    }

    //Обновление персонажей
    componentDidMount() {
        this.marvelService.getAllCharacters()
        .then(this.onCharListLoaded)
        .catch(this.onCharListError)
    }

    //Создадим метод для оптимизации, чтобы не помещать такую конструкцию в render
    rednderItems(arr) {
       const items = arr.map((item) => {
            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item" key={item.id}>
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
        const {charList, loading, error} = this.state;

        const items = this.rednderItems(charList);

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(error || loading) ? items : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;