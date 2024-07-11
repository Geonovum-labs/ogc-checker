import { FC, useState } from 'react';

interface Props {
  onSubmit: (uri: string) => void;
}

const UriInput: FC<Props> = ({ onSubmit }) => {
  const [uri, setUri] = useState('');

  return (
    <div>
      <form onSubmit={() => onSubmit(uri)}>
        <label className="mr-2 font-medium">URI:</label>
        <input type="text" className="w-96" value={uri} onChange={event => setUri(event.target.value)} />
        <button type="submit" className="ml-2">
          Check
        </button>
      </form>
    </div>
  );
};

export default UriInput;
