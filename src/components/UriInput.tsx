import { FC, FormEventHandler, useState } from 'react';

interface Props {
  onSubmit: (uri: string) => void;
}

const UriInput: FC<Props> = ({ onSubmit }) => {
  const [uri, setUri] = useState('');

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();
    onSubmit(uri);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-96 px-1.5"
          placeholder="Enter URL to load a document from remote location..."
          value={uri}
          onChange={event => setUri(event.target.value)}
        />
        <button type="submit" className="ml-2 px-2.5 py-1.5 text-sm font-semibold cursor-pointer">
          Load
        </button>
      </form>
    </div>
  );
};

export default UriInput;
