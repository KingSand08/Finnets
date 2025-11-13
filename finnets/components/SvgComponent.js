import style from './image.container.module.css';
const SvgComponent = ({
  src,
  color = '--background',
  size = '30px',
  noColor = false,
}) => {
  return (
    <>
      {noColor ? (
        <div
          className={style.image_container}
          style={{
            backgroundImage: `url('${src}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            width: `${size}`,
            height: `${size}`,
          }}
        />
      ) : (
        <div
          className={style.image_container}
          style={{
            WebkitMask: `url(${src}) no-repeat center / contain`,
            Mask: `url(${src}') no-repeat center / contain`,
            backgroundColor: `var(${color})`,
            width: `${size}`,
            height: `${size}`,
          }}
        />
      )}
    </>
  );
};

export default SvgComponent;
