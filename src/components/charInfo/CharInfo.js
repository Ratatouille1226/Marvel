import './charInfo.scss';

import { Component } from 'react';

import MarvelService from '../../services/MarvelService';
import Skeleton from '../skeleton/Skeleton';
import Spinner from "../spinner/Spinner";
import ErrorMessage from "../errorMessage/ErrorMessage";

class CharInfo extends Component {
    state = {
        char: null,
        loading: false,
        error: false
    }
    //Создаём экземпляр класса
    marvelService = new MarvelService();

        //Обновление стейта
        componentDidMount() {
            this.updateChar();
        }
        //Сравниваем состояние (если мы нажали на другого персонажа у него другой айди поэтому вызываем метод обновления персонажа)
        componentDidUpdate(prevProps) {
            if (this.props.charId !== prevProps.charId) {
                this.updateChar();
            }
        }

    //Получаем персонажа по клику на иконку
    updateChar = () => {
        const {charId} = this.props;
        if (!charId) {
            return;
        }

        this.onCharLoading();
        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

        //Метод чтобы записывать данные в стейт
        onCharLoaded = (char) => {
            this.setState({
                char,
                loading: false,
                error: false
            });
        }
        //Показываем спинер при загрузке персонажа
        onCharLoading = () => {
            this.setState({
                loading: true
            })
        }
        //Обработка ошибки получения персонажа с сервера
        onError = () => {
            this.setState({
                loading: false,
                error: true
            });
        }

   render() {
        const {char, loading, error} = this.state;

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