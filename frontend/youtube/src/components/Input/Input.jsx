import React,{useId} from "react";
import style from "./Input.module.css"

const Input = ({ type = "text", placeholder = "", name, label, ...props}, ref) => {

    const id = useId();
  return (
    <div className={style.inputContainer}>
        {label && <label className={style.label} htmlFor={id}>{label}</label>}
      <input
       className={style.input}
        type={type}
        placeholder={placeholder}
        name={name}
        id={id}
      ref={ref}
      {...props}
    />
    </div>
  );
};

export default React.forwardRef(Input);