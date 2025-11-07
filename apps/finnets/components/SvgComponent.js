import style from './image.container.module.css';
const SvgComponent = ({ src }) => {
  return (
    <div
      className={style.image_container}
      style={{
        WebkitMask: `url(${src}) no-repeat center / contain`,
        Mask: `url(${src}') no-repeat center / contain`,
      }}
    />
  );
};

export default SvgComponent;
