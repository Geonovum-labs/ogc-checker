import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import specs from '../specs';

interface Props {
  className?: string;
}

const SpecSelector: FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <select value={location.pathname} onChange={event => navigate(event.target.value)} className={className}>
      {specs.map(spec => (
        <option key={spec.slug} value={`/${spec.slug}`}>
          {spec.name}
        </option>
      ))}
    </select>
  );
};

export default SpecSelector;
