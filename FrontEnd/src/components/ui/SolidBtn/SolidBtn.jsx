import Styles from './SolidBtn.module.css'

export default function SolidBtn(props) {
  return (
    <button className={Styles.btn}><i className={`${props.icon} ${props.className}`}></i> {props.text}</button>
  )
}