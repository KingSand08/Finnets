import styles from './finnetmodal.module.css';
const { useState } = require('react');

const IframeContainer = ({ src, title }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={styles.iframeWrap} aria-busy={!loaded}>
      {!loaded && (
        <div className={styles.loader_container}>
          <div className={styles.loader} />
        </div>
      )}
      <iframe
        title={title}
        src={src}
        sandbox='allow-scripts allow-same-origin allow-forms allow-popups'
        className={styles.iframe}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
    </div>
  );
};

export default IframeContainer;
