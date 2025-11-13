import { type Reference } from '../../../../types';

import './ReferenceList.scss';

const ReferenceList = ({ items }: { items: Array<Reference> }) => {
  return (
    <ol className="referenceList">
      {items.map(({ id, title, url }) => (
        <li key={id}>
          <a href={url} rel="noopener noreferrer" target="_blank">
            {title}
          </a>
        </li>
      ))}
    </ol>
  );
}

export default ReferenceList;
