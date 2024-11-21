import { useParams } from 'react-router-dom';

interface PowerPicksWrapperProps {
  WrappedElement: () => JSX.Element;
}

const PowerPicksWrapper: React.FC<PowerPicksWrapperProps> = ({ WrappedElement, ...props }) => {
  const { category } = useParams();

  return <WrappedElement key={category} {...props} />;
};

export default PowerPicksWrapper;
