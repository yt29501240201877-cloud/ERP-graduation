import Styles from './GlowBtn.module.css'

export default function GlowBtn(props) {
  return (
    <button onClick={props.action} className={`${Styles.btn} ${props.className}`}><i className={props.icon}></i> {props.text} <i className={props.iconRight}></i></button>
  )
}4