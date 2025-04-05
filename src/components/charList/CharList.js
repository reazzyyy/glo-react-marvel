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
    newItemLoading: false,
    offset: 0,
    charEnded: false,
  };

  marvelService = new MarvelService();

  componentDidMount() {
    this.onRequest();
  }

  onRequest = (offset) => {
    this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoading = () => {
    this.setState({ newItemLoading: true });
  };

  getAllCharacters = () => {
    this.marvelService
      .getAllCharacters()
      .then(this.onCharListLoaded)
      .catch(this.onError);
  };

  onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
      ended = true;
    }

    this.setState(({ offset, charList }) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      newItemLoading: false,
      offset: offset + 9,
      charEnded: ended,
    }));
  };

  render() {
    const { charList, loading, error, newItemLoading, offset, charEnded } =
      this.state;
    const { onCharSelected } = this.props;
    console.log(newItemLoading);

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
        <button
          className="button button__main button__long"
          disabled={newItemLoading}
          onClick={() => this.onRequest(offset)}
          style={{ display: charEnded ? 'none' : 'block' }}
        >
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
