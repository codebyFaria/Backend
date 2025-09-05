import style from './Button.module.css'

export const Button = ({
   children,
   onClick,
   type = "button",
   ...props
}) => {
  return (
    <button onClick={onClick} className={style.button} type={type} {...props}>
      <p className={style.buttonText}>{children}</p>
    </button>
  )
}
