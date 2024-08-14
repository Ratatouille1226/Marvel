import { Component } from "react";

import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

class RandomChar extends Component {
    constructor(props) {
        super(props);
    //Пока вызываю метод в конструкторе (временно), потом обязательно всё поменяется
        this.updateChar();
    }

    state = {
        char: {},
        loading: true
    }
    //Создаём экземпляр класса
    marvelService = new MarvelService();

    //Метод чтобы записывать данные в стейт
    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false,
            error: false
        });
    }
    
    //Обработка ошибки получения персонажа с сервера
    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    }

    //Обновление персонажа
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.marvelService
            .getCharacter(id)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    render() {
        const {char, loading, error} = this.state;
        //Выносим компоненты в переменные для сравнения в тернарных операторах и отображения на странице
        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main">
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    }
}

//Коспонент для отрисовки спинера чтобы не ломать вторую часть компонента
const View = ({char}) => {
    const {thumbnail, name, description, homepage, wiki} = char;

    return (
        <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className="randomchar__img"/>
        <div className="randomchar__info">
            <p className="randomchar__name">{name}</p>
            <p className="randomchar__descr">
                {description}
            </p>
            <div className="randomchar__btns">
                <a href={homepage} className="button button__main">
                    <div className="inner">homepage</div>
                </a>
                <a href={wiki} className="button button__secondary">
                    <div className="inner">wiki</div>
                </a>
            </div>
        </div>
    </div>
    )
}

export default RandomChar;