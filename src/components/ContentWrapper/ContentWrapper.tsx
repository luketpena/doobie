import { PropsWithChildren } from 'react';
import './ContentWrapper.scss';

interface ContentWrapperProps extends PropsWithChildren {}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  return <div className="page-wrapper_container">{children}</div>;
};

export { ContentWrapper };
