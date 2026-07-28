import Styles from './SolidBtn.module.css'

export default function SolidBtn(props) {
  return (
    <button onClick={props.action} className={`${Styles.btn} ${props.className}`}><i className={props.icon}></i> {props.text}</button>
  )
}