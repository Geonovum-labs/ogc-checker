import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Props {
  className?: string;
}

const SpecSelector: FC<Props> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <select value={location.pathname} onChange={event => navigate(event.target.value)} className={className}>
      <option value="/json-fg">JSON-FG</option>
      <option value="/ogcapi-features">OGC API Features</option>
    </select>
  );
};

export default SpecSelector;
