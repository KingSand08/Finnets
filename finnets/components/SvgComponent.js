import style from './image.container.module.css';
const SvgComponent = ({ src, color = '--background', size = '30px' }) => {
  return (
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
  );
};

export default SvgComponent;
