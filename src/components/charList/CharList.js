import { Component } from 'react';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/errorMessage';
import MarvelService from '../../services/MarvelService';

import './charList.scss';
class CharList extends Component {
  state = {
    charList: [],
    loading: true,
    error: false,
  };

  componentDidMount() {
    this.getAllCharacters();
  }

  marvelService = new MarvelService();

  getAllCharacters = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoaded = (charList) => {
    this.setState({ charList, loading: false });
  };

  render() {
    const { charList, loading, error } = this.state;
    const { onCharSelected } = this.props;

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? (
      <View charList={charList} onCharSelected={onCharSelected} />
    ) : null;

    return (
      <div className="char__list">
        {errorMessage}
        {spinner}
        {content}
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

const View = ({ charList, onCharSelected }) => {
  return (
    <ul className="char__grid">
      {charList.map((char) => {
        return (
          <CharView
            char={char}
            key={char.id}
            onClick={() => {
              onCharSelected(char.id);
            }}
          ></CharView>
        );
      })}
    </ul>
  );
};

const CharView = ({ char, onClick }) => {
  const { name, thumbnail } = char;

  return (
    <li className="char__item" onClick={onClick}>
      <img src={thumbnail} alt={name} />
      <div className="char__name">{name}</div>
    </li>
  );
};

export default CharList;
