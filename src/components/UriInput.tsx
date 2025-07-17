import { pick } from 'ramda';
import { FC, FormEventHandler, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useChecker } from '../store';
import { Spec, SpecInput } from '../types';
import { formatDocument, handleResponse } from '../util';

interface Props {
  spec: Spec;
}

const UriInput: FC<Props> = ({ spec }) => {
  const [uri, setUri] = useState('');

  const { setContent, setLinters, checking, setChecking, setError } = useChecker(
    useShallow(state => pick(['setContent', 'setLinters', 'checking', 'setChecking', 'setError'], state))
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    fetch(uri)
      .then(response => handleResponse(response, uri))
      .then(responseText =>
        spec.responseMapper //
          ? spec.responseMapper(responseText)
          : Promise.resolve({ content: responseText })
      )
      .then((input: SpecInput) => {
        setChecking(false);
        setContent(formatDocument(input.content));
        setLinters(input.linters ?? spec.linters);
      })
      .catch(error => {
        setChecking(false);

        if (error instanceof TypeError) {
          setError(`Possible network or CORS failure: "${error.message}". Check your browser console for more details.`);
        } else {
          setError(`Error: "${error.message}"`);
        }
      });
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
        <button type="submit" className="ml-2 px-2.5 py-1.5 text-sm font-semibold cursor-pointer" disabled={checking}>
          Load
        </button>
      </form>
    </div>
  );
};

export default UriInput;
